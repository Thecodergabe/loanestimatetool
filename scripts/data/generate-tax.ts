import * as xlsx from 'xlsx'
import * as fs from 'fs/promises'
import * as path from 'path'

/**
 * Input Excel file containing ZIP‑level insurance data.
 */
const INPUT_PATH = path.resolve(process.cwd(), 'data', 'insuranceByArea.xlsx')

/**
 * Output location for the normalized ZIP → premium map.
 */
const OUTPUT_PATH = path.resolve(process.cwd(), 'public', 'insuranceByZip.json')

/**
 * Converts the insurance Excel sheet into a normalized JSON map.
 * Extracts ZIP codes and premium values, cleans formatting, and writes output.
 */
async function convertXlsxToJson() {
  const workbook = xlsx.readFile(INPUT_PATH)
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows = xlsx.utils.sheet_to_json<Record<string, unknown>>(sheet)

  const result: Record<string, number> = {}

  for (const row of rows) {
    const zipRaw = row['ZIP Code']
    const zip = String(zipRaw).padStart(5, '0')

    const premiumRaw = row['Premiums Per Policy']
    const premium =
      typeof premiumRaw === 'string'
        ? parseFloat(premiumRaw.replace(/[^0-9.]/g, ''))
        : Number(premiumRaw)

    // Only accept valid 5‑digit ZIPs with numeric premium values
    if (/^\d{5}$/.test(zip) && !isNaN(premium)) {
      result[zip] = parseFloat(premium.toFixed(2))
    } else {
      console.warn(`Skipped invalid row: ZIP=${zip}, Premium=${premiumRaw}`)
    }
  }

  // Persist the final ZIP → premium map
  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true })
  await fs.writeFile(OUTPUT_PATH, JSON.stringify(result, null, 2))

  console.log(
    `Wrote ${Object.keys(result).length} ZIP-level insurance rates to ${OUTPUT_PATH}`,
  )
}

// Execute conversion when run directly
convertXlsxToJson().catch((err) => {
  console.error('Failed to convert Excel file:', err)
  process.exit(1)
})