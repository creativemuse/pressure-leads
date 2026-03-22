import { NextResponse } from "next/server"

import { verifyAdminBearer } from "@/lib/admin-auth"
import { setContractorPaused } from "@/lib/contractor-pause"

export const runtime = "nodejs"

type Body = { email?: unknown; paused?: unknown }

export async function POST(request: Request) {
  if (!process.env.ADMIN_API_SECRET?.trim()) {
    return NextResponse.json({ error: "Admin API not configured" }, { status: 503 })
  }
  if (!verifyAdminBearer(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (!process.env.REDIS_URL?.trim()) {
    return NextResponse.json({ error: "Redis not configured" }, { status: 503 })
  }

  let body: Body
  try {
    body = (await request.json()) as Body
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const email = typeof body.email === "string" ? body.email.trim() : ""
  const paused = body.paused === true || body.paused === false ? body.paused : null
  if (!email || paused === null) {
    return NextResponse.json({ error: "Expected { \"email\": string, \"paused\": boolean }" }, { status: 400 })
  }

  try {
    await setContractorPaused(email, paused)
    return NextResponse.json({ ok: true, email: email.toLowerCase(), paused })
  } catch (e) {
    console.error("[admin/contractor-pause]", e)
    return NextResponse.json({ error: "Failed to update pause state" }, { status: 500 })
  }
}

export function GET() {
  return new NextResponse(null, { status: 405 })
}
