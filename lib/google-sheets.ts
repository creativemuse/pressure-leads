import { google, type sheets_v4 } from "googleapis"

/**
 * Authenticate with Google Sheets using a base64-encoded service account key
 * from the `GOOGLE_SERVICE_ACCOUNT_JSON` env var.
 */
function getAuthClient() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim()
  if (!raw) throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_JSON")

  const credentials = JSON.parse(Buffer.from(raw, "base64").toString("utf8"))
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  })
  return auth
}

export interface SheetRow {
  [header: string]: string
}

/**
 * Fetches all rows from the given sheet/range, returning an array of objects
 * keyed by the header row values.
 */
export async function fetchSheetRows(
  sheetId: string,
  range: string,
): Promise<SheetRow[]> {
  const auth = getAuthClient()
  const sheets: sheets_v4.Sheets = google.sheets({ version: "v4", auth })

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range,
  })

  const rows = res.data.values
  if (!rows || rows.length < 2) return []

  const headers = rows[0].map((h: string) => String(h).trim())
  return rows.slice(1).map((row) => {
    const obj: SheetRow = {}
    for (let i = 0; i < headers.length; i++) {
      obj[headers[i]] = row[i] != null ? String(row[i]) : ""
    }
    return obj
  })
}
