import { type NextRequest, NextResponse } from "next/server"

import { verifyAdminBearer } from "@/lib/admin-auth"
import { getLeadStats, leadStatsUtcDate } from "@/lib/lead-stats"

export const runtime = "nodejs"

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export async function GET(request: NextRequest) {
  if (!process.env.ADMIN_API_SECRET?.trim()) {
    return NextResponse.json({ error: "Admin API not configured" }, { status: 503 })
  }
  if (!verifyAdminBearer(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (!process.env.REDIS_URL?.trim()) {
    return NextResponse.json({ error: "Redis not configured" }, { status: 503 })
  }

  const { searchParams } = new URL(request.url)
  const zipRaw = searchParams.get("zip")?.trim() ?? ""
  const dateRaw = searchParams.get("date")?.trim() ?? leadStatsUtcDate()

  if (!DATE_RE.test(dateRaw)) {
    return NextResponse.json({ error: "Invalid date (use YYYY-MM-DD, UTC)" }, { status: 400 })
  }

  const zip = zipRaw === "" ? undefined : zipRaw
  if (zip != null && !/^\d{5}$/.test(zip)) {
    return NextResponse.json({ error: "Invalid zip (use 5 digits)" }, { status: 400 })
  }

  try {
    const { countGlobal, countForZip } = await getLeadStats(zip, dateRaw)
    return NextResponse.json({
      ok: true,
      date: dateRaw,
      zip: zip ?? null,
      countGlobal,
      countForZip,
    })
  } catch (e) {
    console.error("[admin/lead-stats]", e)
    return NextResponse.json({ error: "Failed to read stats" }, { status: 500 })
  }
}

export function POST() {
  return new NextResponse(null, { status: 405 })
}
