import { NextResponse } from "next/server";
import { readTkVotingHeartbeat } from "@/lib/tk-open-data/heartbeat";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Publieke gezondheidscheck voor de TK-stemgedrag-refresh: wanneer liep de cron
 * voor het laatst en ging dat goed? Bevat geen gevoelige data, alleen een
 * tijdstempel en een telling.
 */
export async function GET() {
  try {
    const heartbeat = await readTkVotingHeartbeat();
    return NextResponse.json(
      { ...heartbeat, checkedAt: new Date().toISOString() },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "onbekende fout";
    return NextResponse.json(
      { error: message, checkedAt: new Date().toISOString() },
      { status: 500, headers: { "cache-control": "no-store" } },
    );
  }
}
