import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Quiz interaction telemetry is disabled because answer sequences can reveal
 * political opinions. This route stays explicit so stale clients cannot write
 * event data to a fallback store.
 */
export async function POST() {
  return NextResponse.json(
    { ok: false, error: "Quizinteractie wordt niet opgeslagen." },
    { status: 410 },
  );
}
