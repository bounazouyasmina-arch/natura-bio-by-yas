import { NextRequest, NextResponse } from "next/server";
import { readFile, access } from "fs/promises";
import { join } from "path";
import { constants } from "fs";

/** Noms acceptés (nouveau d’abord, ancien en secours) */
const EBOOK_CANDIDATES = [
  "hormones-sereine.pdf",
  "Hormones-Sereine.pdf",
  "menopause-au-naturel.pdf",
];

async function resolveEbookPath(): Promise<string | null> {
  for (const name of EBOOK_CANDIDATES) {
    const path = join(process.cwd(), "ebooks", name);
    try {
      await access(path, constants.R_OK);
      return path;
    } catch {
      /* try next */
    }
  }
  return null;
}

export async function GET(request: NextRequest) {
  const referer = request.headers.get("referer") || "";
  const url = new URL(request.url);
  const hasPaidFlag = url.searchParams.get("paid") === "true";
  const accessCookie = request.cookies.get("natura_access")?.value;

  const isAuthorized =
    referer.includes("/espace") ||
    hasPaidFlag ||
    accessCookie === "ebook" ||
    accessCookie === "coaching";

  if (!isAuthorized) {
    return NextResponse.json(
      {
        error:
          "Accès non autorisé. Tu dois avoir acheté l'ebook Hormones Sereine.",
      },
      { status: 403 }
    );
  }

  const ebookPath = await resolveEbookPath();
  if (!ebookPath) {
    return NextResponse.json(
      {
        error:
          "Fichier ebook introuvable. Place ton PDF dans ebooks/ sous le nom hormones-sereine.pdf",
      },
      { status: 404 }
    );
  }

  const fileBuffer = await readFile(ebookPath);

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="Hormones-Sereine-natura-bio-by-yas.pdf"`,
      "Content-Length": fileBuffer.length.toString(),
      "Cache-Control": "private, no-cache",
    },
  });
}
