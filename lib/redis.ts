import { createClient, type RedisClientType } from "redis"

/**
 * Reuse one client per server process (helps Next.js dev HMR / warm serverless isolates).
 * Set `REDIS_URL` (e.g. from `vercel env pull .env.development.local` after linking the project).
 */
const globalForRedis = globalThis as unknown as {
  redisClient?: RedisClientType
}

export async function getRedis(): Promise<RedisClientType> {
  const url = process.env.REDIS_URL?.trim()
  if (!url) {
    throw new Error("Missing REDIS_URL")
  }

  let client = globalForRedis.redisClient
  if (!client) {
    client = createClient({ url })
    client.on("error", (err) => console.error("[redis]", err))
    globalForRedis.redisClient = client
  }

  if (!client.isOpen) {
    await client.connect()
  }

  return client
}
