import { NextResponse } from "next/server"

import { getRedis } from "@/lib/redis"

export const runtime = "nodejs"

/**
 * Example route aligned with Vercel Redis + node-redis.
 * Prerequisite: `vercel link`, then `vercel env pull .env.development.local` (or set `REDIS_URL` yourself).
 */
export async function POST() {
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
