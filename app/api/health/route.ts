import { NextResponse } from "next/server"

import { kv } from "@vercel/kv"

import { getRedis } from "@/lib/redis"

export const runtime = "nodejs"

type ServiceStatus = {
  ok: boolean
  latencyMs: number
  error?: string
}

async function checkRedis(): Promise<ServiceStatus> {
  const url = process.env.REDIS_URL?.trim()
  if (!url) return { ok: false, latencyMs: 0, error: "REDIS_URL not configured" }

  const start = Date.now()
  try {
    const r = await getRedis()
    await r.ping()
    return { ok: true, latencyMs: Date.now() - start }
  } catch (e) {
    return { ok: false, latencyMs: Date.now() - start, error: e instanceof Error ? e.message : String(e) }
  }
}

async function checkKv(): Promise<ServiceStatus> {
  const start = Date.now()
  try {
    await kv.ping()
    return { ok: true, latencyMs: Date.now() - start }
  } catch (e) {
    return { ok: false, latencyMs: Date.now() - start, error: e instanceof Error ? e.message : String(e) }
  }
}

function checkPipelineEnv(): { configured: boolean; missing: string[] } {
  const required = [
    "TALLY_WEBHOOK_SECRET",
    "PINATA_JWT",
    "ANTHROPIC_API_KEY",
    "CROSSMINT_API_KEY",
    "RESEND_API_KEY",
    "RESEND_FROM",
    "ADMIN_EMAIL",
    "LEAD_FEE_USDC",
    "TREASURY_WALLET_ADDRESS",
    "CONTRACTOR_FALLBACK_EMAIL",
    "CONTRACTOR_FALLBACK_PHONE_E164",
  ]
  const missing = required.filter((k) => !process.env[k]?.trim())
  return { configured: missing.length === 0, missing }
}

export async function GET() {
  const [redis, kvStatus] = await Promise.all([checkRedis(), checkKv()])
  const pipeline = checkPipelineEnv()

  const healthy = redis.ok && kvStatus.ok && pipeline.configured
  const status = healthy ? 200 : 503

  return NextResponse.json(
    {
      status: healthy ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      services: {
        redis,
        kv: kvStatus,
      },
      pipeline: {
        configured: pipeline.configured,
        ...(pipeline.missing.length > 0 ? { missingEnvVars: pipeline.missing } : {}),
      },
    },
    { status },
  )
}
