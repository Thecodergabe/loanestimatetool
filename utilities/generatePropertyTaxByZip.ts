import * as path from 'path'
import * as fs from 'fs/promises'
import { createReadStream } from 'fs'
import * as readline from 'readline'
import { load } from 'cheerio'

/**
 * Row structure for ZIP → County → State mapping.
 */
type ZipCountyRow = { ZIP: string, County: string, State: string }

const ZIP_CSV_URL =
  'https://raw.githubusercontent.com/scpike/us-state-county-zip/master/geo-data.csv'
const ZIP_CSV_PATH = path.resolve(process.cwd(), 'data', 'zip_to_county.csv')
const OUTPUT_PATH = path.resolve(process.cwd(), 'data', 'propertyTaxByZip.json')
const TAX_FOUNDATION_URL =
  'https://taxfoundation.org/data/all/state/property-taxes-by-state-county/'

type TaxRateMap = Record<string, number>

/**
 * Normalizes a (state, county) pair into a consistent lookup key.
 */
function normalizeKey(state: string, county: string): string {
  return `${state.trim().toUpperCase()}|${county
    .trim()
    .toLowerCase()
    .replace(/\./g, '')                // remove punctuation
    .replace(/\s+/g, ' ')              // normalize whitespace
    .replace(
      / county| parish| borough| census area| city and borough| municipality/gi,
      '',
    )}`
}

/**
 * Downloads the ZIP→County CSV if not already present.
 */
async function downloadZipToCountyCSV(): Promise<void> {
  const res = await fetch(ZIP_CSV_URL, { redirect: 'follow' })
  if (!res.ok) {
    throw new Error(`Failed to download ZIP-to-county CSV: ${res.statusText}`)
  }

  const buffer = await res.arrayBuffer()
  await fs.mkdir(path.dirname(ZIP_CSV_PATH), { recursive: true })
  await fs.writeFile(ZIP_CSV_PATH, Buffer.from(buffer))
}

/**
 * Parses the ZIP→County CSV into structured rows.
 */
async function parseZipToCounty(): Promise<ZipCountyRow[]> {
  const stream = createReadStream(ZIP_CSV_PATH, 'utf-8')
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity })

  const rows: ZipCountyRow[] = []
  let headers: string[] = []

  for await (const line of rl) {
    const values = line.split(',').map(v => v.trim())

    // Capture header row
    if (!headers.length) {
      headers = values.map(h => h.toLowerCase())
      continue
    }

    // Map CSV columns to an object
    const row: Record<string, string> = {}
    headers.forEach((key, i) => {
      row[key] = values[i]
    })

    const ZIP = row['zipcode']
    const County = row['county']
    const State = row['state_abbr']

    if (ZIP && County && State) {
      rows.push({ ZIP, County, State })
    }
  }

  return rows
}

/**
 * Scrapes county-level property tax rates from the Tax Foundation table.
 */
async function scrapeCountyTaxRates(): Promise<Record<string, number>> {
  const res = await fetch(TAX_FOUNDATION_URL, { redirect: 'follow' })
  if (!res.ok) {
    throw new Error(`Failed to fetch Tax Foundation page: ${res.statusText}`)
  }

  const html = await res.text()
  const $ = load(html)
  const rates: Record<string, number> = {}

  $('table tbody tr').each((_, row) => {
    const cells = $(row).find('td')

    const state = $(cells[0]).text().trim()
    const rawCounty = $(cells[1]).text().trim()
    const county = rawCounty.replace(/ County$/, '').trim()

    const rateStr = $(cells[4]).text().replace('%', '').trim()
    const rate = parseFloat(rateStr)

    if (state && county && !isNaN(rate)) {
      const key = normalizeKey(state, county)
      rates[key] = rate
    }
  })

  return rates
}

/**
 * Generates a ZIP→property tax rate map by joining:
 *   - ZIP→County mapping
 *   - County→Tax rate mapping
 * Writes unmatched ZIPs to a log file for inspection.
 */
export async function generatePropertyTaxByZip(): Promise<TaxRateMap> {
  try {
    await downloadZipToCountyCSV()

    const zipCountyRows = await parseZipToCounty()
    const countyRates = await scrapeCountyTaxRates()

    const zipTaxMap: TaxRateMap = {}
    const unmatched: string[] = []

    // Join ZIPs to county-level tax rates
    for (const row of zipCountyRows) {
      const key = normalizeKey(row.State, row.County)
      const rate = countyRates[key]

      if (rate !== undefined) {
        zipTaxMap[row.ZIP] = rate
      } else {
        unmatched.push(`${row.ZIP},${row.State},${row.County} → ${key}`)
      }
    }

    // Log any ZIPs that couldn't be matched
    if (unmatched.length) {
      await fs.writeFile('unmatched-zip-keys.txt', unmatched.join('\n'))
      console.warn(
        `${unmatched.length} unmatched ZIPs written to unmatched-zip-keys.txt`,
      )
    }

    // Persist final ZIP→rate map
    await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true })
    await fs.writeFile(OUTPUT_PATH, JSON.stringify(zipTaxMap, null, 2))

    return zipTaxMap
  } catch (err) {
    console.error('Failed to generate ZIP tax data:', err)
    throw err
  }
}