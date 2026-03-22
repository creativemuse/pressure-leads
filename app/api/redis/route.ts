import { NextResponse } from "next/server"

import { getRedis } from "@/lib/redis"

export const runtime = "nodejs"

/**
 * Example route for local Redis (e.g. Vercel Redis + node-redis).
 * Disabled in production builds (`NODE_ENV === "production"`) to avoid an open Redis probe endpoint.
 * Prerequisite when enabled: set `REDIS_URL` (e.g. `vercel env pull .env.development.local`).
 */
export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  try {
    const redis = await getRedis()
    const result = await redis.get("item")
    return NextResponse.json({ result }, { status: 200 })
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    console.error("[api/redis]", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export function GET() {
  return NextResponse.json({ error: "Not found" }, { status: 404 })
}
