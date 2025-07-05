import * as cheerio from 'cheerio'
import * as fs from 'fs/promises'
import * as path from 'path'

const OUTPUT_PATH = path.resolve(process.cwd(), 'data', 'insuranceByZip.json')
const SOURCE_URL = 'https://www.policygenius.com/homeowners-insurance/home-insurance-rates-by-zip-code/'

export async function scrapeInsuranceRates(): Promise<Record<string, number>> {
 const res = await fetch(SOURCE_URL)
  if (!res.ok) throw new Error(`Failed to fetch Policygenius page: ${res.statusText}`)

  const html = await res.text()
  const $ = cheerio.load(html)
  const results: Record<string, number> = {}

  $('table tbody tr').each((_, row) => {
    const cells = $(row).find('td')
    const zip = $(cells[0]).text().trim()
    const costStr = $(cells[3]).text().replace(/[^0-9.]/g, '')
    const cost = parseFloat(costStr)

    if (/^\d{5}$/.test(zip) && !isNaN(cost)) {
      results[zip] = cost
    } else {
      console.warn(`⚠️ Skipped invalid row: ZIP=${zip}, Cost=${costStr}`)
    }
  })

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true })
  await fs.writeFile(OUTPUT_PATH, JSON.stringify(results, null, 2))

  return results
}