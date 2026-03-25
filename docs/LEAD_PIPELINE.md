# Lead pipeline, IPFS, email, and payments

## MVP split (Next.js + Pinata Agent)

| Layer | Responsibility | Where |
| ----- | --------------- | ----- |
| **Frontline customer traffic** | Tally → verify webhook → pin IPFS → Claude summary → Crossmint USDC → Resend email; ZIP routing from Redis/KV | `app/api/tally-webhook/route.ts` + `lib/tally-webhook/run-lead-pipeline.ts` |
| **Internal operations** | Slack/Telegram Pinata OpenClaw agent as COO-style assistant; optional HTTP tools against this app | Pinata Agents (not in this repo) |

The webhook pipeline does **not** call Pinata Agents. **Pinata pinning** (`pinJSONToIPFS`) is separate from **Pinata Agents** (hosted OpenClaw).

## Two Pinata roles

- **Pinata pinning API** — `PINATA_JWT` on Vercel; stores raw Tally JSON on IPFS from `runLeadPipeline`.
- **Pinata Agents** — optional; configure in Pinata dashboard (Secrets, Skills, Slack/Telegram). Not referenced in application code.

Lead email text uses **Anthropic** on the server (`ANTHROPIC_API_KEY`), not the agent’s LLM.

## End-to-end flow (consumer lead)

1. Tally POSTs signed JSON to `/api/tally-webhook` (`TALLY_WEBHOOK_SECRET`).
2. `resolveContractorForLead` resolves ZIP from payload → Vercel KV list `zip:<5-digit>:contractors`, then legacy Redis `contractor:zip:<zip>`, then env fallback. Paused contractors (Redis flag) fall back to default.
3. Crossmint wallet: onboarded Creative Bank `0x` address when present, else `email:{email}:evm`.
4. Pin JSON to IPFS; Claude formats one line; structured body from `pressure-washing-lead-fields`.
5. Crossmint balance → if under `LEAD_FEE_USDC`, email `ADMIN_EMAIL`. Else transfer USDC to `TREASURY_WALLET_ADDRESS`; if awaiting approval, email admin; else email contractor.

Contractor onboarding uses `/api/contractor-onboarding` and `CONTRACTOR_ONBOARDING_TALLY_WEBHOOK_SECRET`.

## Crossmint webhooks

Not required. The app calls Crossmint’s REST API only (outbound). Add Crossmint webhooks later if you want push notifications.

## Ops: lead counts and contractor pause (Redis)

When `REDIS_URL` is set, each completed lead email path increments:

- `lead:count:zip:<5-digit>:day:<YYYY-MM-DD>` (UTC day)
- `lead:count:day:<YYYY-MM-DD>`

Paused contractors: Redis key `contractor:paused:<lowercase-email>` = `1`.

### Admin API (for scripts or agent tools)

Set `ADMIN_API_SECRET` (long random string). Send `Authorization: Bearer <secret>`.

- `GET /api/admin/lead-stats?zip=32092&date=2025-03-21` — `date` defaults to today (UTC). `zip` optional; when omitted, `countForZip` is null.
- `POST /api/admin/contractor-pause` — JSON `{ "email": "pro@example.com", "paused": true | false }`

**HTTP status:** Missing `ADMIN_API_SECRET` → **503** `Admin API not configured`. Wrong or missing Bearer token → **401** `Unauthorized`. Missing `REDIS_URL` → **503** `Redis not configured`. Validation uses `verifyAdminBearer` in `lib/admin-auth.ts` (constant-time compare; header must start with `Bearer `, not lowercase `bearer`).

#### Troubleshooting 401 vs 503

- **503** `Admin API not configured` — the deployment has no `ADMIN_API_SECRET` (or it is empty). Fix environment variables on the host, not the `Authorization` header format.
- **401** `Unauthorized` — the route is running and a secret is set, but the token does not match. Use the same value as in the host env; in Postman use **Authorization → Bearer Token** so the `Authorization` header is formatted correctly. On Vercel, after changing `ADMIN_API_SECRET`, **redeploy** so the live app uses the new value. Avoid stray spaces when copying the secret.

## Env reference

See root `.env.example` for Tally, Pinata JWT, Anthropic, Crossmint, Resend, treasury, fallback contractor, KV, Redis, and `ADMIN_API_SECRET`.
