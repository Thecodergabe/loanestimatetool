import * as path from 'path'
import * as fs from 'fs/promises'
import { createReadStream } from 'fs'
import { load } from "cheerio"
import * as Papa from 'papaparse'

type ZipCountyRow = { ZIP: string; County: string; State: string }


const ZIP_CSV_URL = 'https://raw.githubusercontent.com/scpike/us-state-county-zip/master/geo-data.csv'
const ZIP_CSV_PATH = path.resolve(process.cwd(), 'data', 'zip_to_county.csv')
const OUTPUT_PATH = path.resolve(process.cwd(), 'data', 'propertyTaxByZip.json')
const TAX_FOUNDATION_URL = 'https://taxfoundation.org/data/all/state/property-taxes-by-state-county/'

type TaxRateMap = Record<string, number>

function normalizeKey(state: string, county: string): string {
  return `${state.trim().toUpperCase()}|${county
    .trim()
    .toLowerCase()
    .replace(/\./g, '') // remove periods
    .replace(/\s+/g, ' ') // normalize whitespace
    .replace(/ county| parish| borough| census area| city and borough| municipality/gi, '')}`
}

async function downloadZipToCountyCSV(): Promise<void> {
  const res = await fetch(ZIP_CSV_URL, { redirect: 'follow' })
  if (!res.ok) throw new Error(`Failed to download ZIP-to-county CSV: ${res.statusText}`)
  const buffer = await res.arrayBuffer()
  await fs.mkdir(path.dirname(ZIP_CSV_PATH), { recursive: true })
  await fs.writeFile(ZIP_CSV_PATH, Buffer.from(buffer))
}


async function parseZipToCounty(): Promise<ZipCountyRow[]> {
  const file = await fs.readFile(ZIP_CSV_PATH, 'utf-8')
  const result = Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    transformHeader: h => h.trim().toLowerCase(),
  })

  if (result.errors.length) {
    console.error('❌ CSV parse errors:', result.errors)
    throw new Error('Failed to parse ZIP-to-county CSV')
  }

  return result.data
    .map((row: any) => {
      const ZIP = row['zipcode']?.trim()
      const County = row['county']?.trim()
      const State = row['state_abbr']?.trim()
      if (ZIP && County && State) {
        return { ZIP, County, State }
      }
      return null
    })
    .filter(Boolean) as ZipCountyRow[]
}

async function scrapeCountyTaxRates(): Promise<Record<string, number>> {
  const res = await fetch(TAX_FOUNDATION_URL, { redirect: 'follow' })
  if (!res.ok) throw new Error(`Failed to fetch Tax Foundation page: ${res.statusText}`)

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

export async function generatePropertyTaxByZip(): Promise<TaxRateMap> {
  try {
    await downloadZipToCountyCSV()

    const zipCountyRows = await parseZipToCounty()

    const countyRates = await scrapeCountyTaxRates()

    const zipTaxMap: TaxRateMap = {}
    const unmatched: string[] = []

    for (const row of zipCountyRows) {
      const key = normalizeKey(row.State, row.County)
      const rate = countyRates[key]
      if (rate !== undefined) {
        zipTaxMap[row.ZIP] = rate
      } else {
        unmatched.push(`${row.ZIP},${row.State},${row.County} → ${key}`)
      }
    }

    if (unmatched.length) {
      await fs.writeFile('unmatched-zip-keys.txt', unmatched.join('\n'))
      console.warn(`⚠️ ${unmatched.length} unmatched ZIPs written to unmatched-zip-keys.txt`)
    }

   await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true })
    await fs.writeFile(OUTPUT_PATH, JSON.stringify(zipTaxMap, null, 2))

    return zipTaxMap
  } catch (err) {
    console.error('❌ Failed to generate ZIP tax data:', err)
    throw err
  }
}