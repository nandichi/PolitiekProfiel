import path from "node:path";
import fs from "node:fs/promises";
import { NextResponse } from "next/server";

const MARKDOWN_DIR = path.join(process.cwd(), "src", "content", "markdown");

const SLUGS = new Set(["home", "methodiek", "privacy", "ai-transparantie"]);

export const dynamic = "force-static";

export async function generateStaticParams() {
  return Array.from(SLUGS).map((slug) => ({ slug }));
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;

  if (!SLUGS.has(slug)) {
    return new NextResponse("Not found", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const filePath = path.join(MARKDOWN_DIR, `${slug}.md`);
  let content: string;
  try {
    content = await fs.readFile(filePath, "utf-8");
  } catch {
    return new NextResponse("Not found", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=300, stale-while-revalidate=86400",
      Vary: "Accept",
    },
  });
}
