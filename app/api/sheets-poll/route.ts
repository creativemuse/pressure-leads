import { NextResponse } from "next/server"
import { Resend } from "resend"

import { verifyAdminBearer } from "@/lib/admin-auth"
import { fetchSheetRows, type SheetRow } from "@/lib/google-sheets"
import { getRedis } from "@/lib/redis"

const REDIS_KEY = "sheets:last-row"

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function buildLeadEmailHtml(row: SheetRow): string {
  const rows = Object.entries(row)
    .filter(([, v]) => v !== "")
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;font-weight:bold;border:1px solid #ddd">${escapeHtml(k)}</td><td style="padding:6px 12px;border:1px solid #ddd">${escapeHtml(v)}</td></tr>`,
    )
    .join("")

  return `<h2>New Pressure Washing Lead</h2>
<table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
${rows}
</table>`
}

function getLeadSubject(row: SheetRow): string {
  const name =
    row["Name"] ||
    row["Full Name"] ||
    [row["First Name"], row["Last Name"]].filter(Boolean).join(" ") ||
    "Unknown"
  const zip =
    row["Zip"] || row["Zip Code"] || row["Zip/Postal Code"] || row["ZIP"] || ""
  return `New Pressure Washing Lead: ${name}${zip ? ` — ${zip}` : ""}`
}

function verifyCronOrAdmin(request: Request): boolean {
  const cronSecret = process.env.CRON_SECRET?.trim()
  if (cronSecret && request.headers.get("authorization") === `Bearer ${cronSecret}`) {
    return true
  }
  return verifyAdminBearer(request)
}

export async function GET(request: Request) {
  if (!verifyCronOrAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const sheetId = process.env.GOOGLE_SHEET_ID?.trim()
  if (!sheetId) {
    return NextResponse.json(
      { error: "Missing GOOGLE_SHEET_ID" },
      { status: 500 },
    )
  }

  const range = process.env.GOOGLE_SHEET_RANGE?.trim() || "Sheet1"
  const notifyEmail =
    process.env.LEAD_NOTIFICATION_EMAIL?.trim() ||
    "info@staugustinepressurewashingpros.com"

  const resendKey = process.env.RESEND_API_KEY?.trim()
  const from = process.env.RESEND_FROM?.trim()
  if (!resendKey || !from) {
    return NextResponse.json(
      { error: "Missing RESEND_API_KEY or RESEND_FROM" },
      { status: 500 },
    )
  }

  const resend = new Resend(resendKey)
  const redis = await getRedis()

  const allRows = await fetchSheetRows(sheetId, range)
  const lastRowStr = await redis.get(REDIS_KEY)
  const lastRow = lastRowStr != null ? Number(lastRowStr) : 0

  const newRows = allRows.slice(lastRow)
  if (newRows.length === 0) {
    return NextResponse.json({ processed: 0, message: "No new leads" })
  }

  let sent = 0
  const errors: string[] = []

  for (const row of newRows) {
    try {
      const { error } = await resend.emails.send({
        from,
        to: notifyEmail,
        subject: getLeadSubject(row),
        html: buildLeadEmailHtml(row),
      })
      if (error) throw new Error(error.message)
      sent++
    } catch (err) {
      errors.push(
        `Row ${lastRow + sent + errors.length + 1}: ${err instanceof Error ? err.message : String(err)}`,
      )
    }
  }

  await redis.set(REDIS_KEY, String(lastRow + newRows.length))

  return NextResponse.json({
    processed: newRows.length,
    sent,
    errors: errors.length > 0 ? errors : undefined,
  })
}
