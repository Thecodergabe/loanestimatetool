import * as cheerio from 'cheerio'
import * as fs from 'fs/promises'
import * as path from 'path'

/**
 * Output location for the scraped ZIP‑level insurance data.
 */
const OUTPUT_PATH = path.resolve(process.cwd(), 'data', 'insuranceByZip.json')

/**
 * Source page containing the ZIP‑by‑ZIP insurance rate table.
 */
const SOURCE_URL =
  'https://www.policygenius.com/homeowners-insurance/home-insurance-rates-by-zip-code/'

/**
 * Scrapes ZIP‑level homeowners insurance rates from Policygenius.
 * Extracts ZIP and annual cost from the table and writes results to disk.
 */
export async function scrapeInsuranceRates(): Promise<Record<string, number>> {
  const res = await fetch(SOURCE_URL)
  if (!res.ok) {
    throw new Error(`Failed to fetch Policygenius page: ${res.statusText}`)
  }

  const html = await res.text()
  const $ = cheerio.load(html)
  const results: Record<string, number> = {}

  // Parse each table row and extract ZIP + cost
  $('table tbody tr').each((_, row) => {
    const cells = $(row).find('td')
    const zip = $(cells[0]).text().trim()
    const costStr = $(cells[3]).text().replace(/[^0-9.]/g, '')
    const cost = parseFloat(costStr)

    // Only accept valid 5‑digit ZIPs with numeric cost
    if (/^\d{5}$/.test(zip) && !isNaN(cost)) {
      results[zip] = cost
    } else {
      console.warn(`Skipped invalid row: ZIP=${zip}, Cost=${costStr}`)
    }
  })

  // Ensure output directory exists and write results
  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true })
  await fs.writeFile(OUTPUT_PATH, JSON.stringify(results, null, 2))

  return results
}