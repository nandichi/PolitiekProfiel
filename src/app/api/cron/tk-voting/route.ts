/**
 * Vercel Cron: wekelijkse refresh van Tweede Kamer stemgedrag.
 *
 * Schema staat in `vercel.json` (`/api/cron/tk-voting`, "0 4 * * 1" = elke
 * maandag 04:00 UTC). Vercel injecteert automatisch een `Authorization`
 * header met `Bearer <CRON_SECRET>`; wij valideren die hier.
 *
 * Lokale test: `curl http://localhost:3000/api/cron/tk-voting -H "Authorization: Bearer dev"` zal alleen werken
 * als `CRON_SECRET=dev` in `.env.local` staat.
 */
import { NextResponse } from "next/server";
import { refreshTkVoting } from "@/lib/tk-open-data/refresh";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

function authorized(request: Request): boolean {
  const auth = request.headers.get("authorization") ?? "";
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    // Development convenience: zonder secret zijn we alleen toegankelijk
    // via localhost.
    const url = new URL(request.url);
    return url.hostname === "localhost" || url.hostname === "127.0.0.1";
  }
  return auth === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(request.url);
  const sinceParam = url.searchParams.get("since");
  const since = sinceParam ? new Date(sinceParam) : undefined;

  const summary = await refreshTkVoting({ since });
  return NextResponse.json(summary);
}

export const POST = GET;
