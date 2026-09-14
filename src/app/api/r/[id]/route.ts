import { NextResponse } from "next/server";
import { deleteResult } from "@/lib/results-store";
import { isShareId } from "@/lib/share-id";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ id: string }>;
}

function isSameSite(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  const configured = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  try {
    return new URL(origin).origin === new URL(configured).origin;
  } catch {
    return false;
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  if (!isSameSite(request)) {
    return NextResponse.json({ error: "Ongeldig verzoek." }, { status: 403 });
  }

  const { id } = await context.params;
  if (!isShareId(id)) {
    return new NextResponse(null, { status: 404 });
  }

  const deleted = await deleteResult(id);
  if (!deleted) {
    return new NextResponse(null, {
      status: 404,
      headers: { "Cache-Control": "private, no-store" },
    });
  }

  return new NextResponse(null, {
    status: 204,
    headers: {
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
      "Referrer-Policy": "no-referrer",
    },
  });
}
