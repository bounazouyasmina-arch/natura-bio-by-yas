import { NextRequest, NextResponse } from "next/server";
import { readFile, access } from "fs/promises";
import { join } from "path";
import { constants } from "fs";

const EBOOK_FILENAME = "menopause-au-naturel.pdf"; // ← L'utilisateur renomme son fichier comme ça
const EBOOK_PATH = join(process.cwd(), "ebooks", EBOOK_FILENAME);

export async function GET(request: NextRequest) {
  // Pour le MVP on autorise le téléchargement si l'utilisateur vient de l'espace ou a le paramètre paid
  // (en vrai plus tard on vérifiera via session Supabase / achat stocké)
  const referer = request.headers.get("referer") || "";
  const url = new URL(request.url);
  const hasPaidFlag = url.searchParams.get("paid") === "true";

  const isAuthorized = referer.includes("/espace") || hasPaidFlag;

  if (!isAuthorized) {
    return NextResponse.json(
      { error: "Accès non autorisé. Tu dois avoir acheté l'ebook." },
      { status: 403 }
    );
  }

  try {
    await access(EBOOK_PATH, constants.R_OK);
  } catch {
    return NextResponse.json(
      {
        error:
          "Fichier ebook introuvable. Place ton PDF dans le dossier 'ebooks/' à la racine du projet et nomme-le 'menopause-au-naturel.pdf'.",
      },
      { status: 404 }
    );
  }

  const fileBuffer = await readFile(EBOOK_PATH);

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="Menopause-au-Naturel-Sagesse-Vitale.pdf"`,
      "Content-Length": fileBuffer.length.toString(),
      "Cache-Control": "private, no-cache",
    },
  });
}
