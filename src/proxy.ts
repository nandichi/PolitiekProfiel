import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const MARKDOWN_PATHS: Record<string, string> = {
  "/": "home",
  "/methodiek": "methodiek",
  "/privacy": "privacy",
};

interface AcceptEntry {
  type: string;
  q: number;
}

function parseAccept(accept: string): AcceptEntry[] {
  return accept.split(",").map((part) => {
    const [rawType, ...params] = part.trim().split(";");
    const type = rawType.trim().toLowerCase();
    let q = 1;
    for (const param of params) {
      const [k, v] = param.trim().split("=");
      if (k?.trim().toLowerCase() === "q" && v !== undefined) {
        const parsed = Number.parseFloat(v);
        if (Number.isFinite(parsed)) q = parsed;
      }
    }
    return { type, q };
  });
}

function bestQ(entries: AcceptEntry[], type: string): number {
  let best = -1;
  for (const e of entries) {
    if (e.type === type && e.q > best) best = e.q;
  }
  return best;
}

function wantsMarkdown(accept: string | null): boolean {
  if (!accept) return false;
  const entries = parseAccept(accept);

  const mdQ = bestQ(entries, "text/markdown");
  if (mdQ < 0) return false;

  const htmlQ = Math.max(
    bestQ(entries, "text/html"),
    bestQ(entries, "application/xhtml+xml"),
  );
  const wildQ = bestQ(entries, "*/*");

  return mdQ > htmlQ && mdQ > wildQ;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const slug = MARKDOWN_PATHS[pathname];

  if (!slug) {
    return NextResponse.next();
  }

  if (!wantsMarkdown(request.headers.get("accept"))) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/api/md/${slug}`;
  url.search = "";

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/", "/methodiek", "/privacy"],
};
