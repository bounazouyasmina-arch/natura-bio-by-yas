import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

const GUIDES = {
  aliments: {
    file: "aliments-symptomes.pdf",
    downloadName: "Natura-bio-Guide-Aliments-Symptomes.pdf",
  },
  anxiete: {
    file: "anxiete-stress.pdf",
    downloadName: "Natura-bio-Guide-Anxiete-Stress.pdf",
  },
} as const;

export async function GET(request: NextRequest) {
  const slug = new URL(request.url).searchParams.get("slug");
  const guide = slug && slug in GUIDES ? GUIDES[slug as keyof typeof GUIDES] : null;
  if (!guide) {
    return NextResponse.json({ error: "Guide introuvable." }, { status: 404 });
  }

  const referer = request.headers.get("referer") || "";
  const accessCookie = request.cookies.get("natura_access")?.value;
  const isAuthorized =
    referer.includes("/espace") ||
    referer.includes("/guides/") ||
    accessCookie === "ebook" ||
    accessCookie === "coaching";

  if (!isAuthorized) {
    return NextResponse.json(
      { error: "Accès non autorisé. Ce guide est offert avec Hormones Sereine." },
      { status: 403 }
    );
  }

  const fileBuffer = await readFile(join(process.cwd(), "ebooks", guide.file));

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${guide.downloadName}"`,
      "Content-Length": fileBuffer.length.toString(),
      "Cache-Control": "private, no-cache",
    },
  });
}
