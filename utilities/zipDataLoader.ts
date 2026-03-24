import fsp from 'fs/promises'
import path from 'path'
import { scrapeInsuranceRates } from './scrapeInsuranceRates.js'
import { generatePropertyTaxByZip } from './generatePropertyTaxByZip.js'

/**
 * Shape of the cached ZIP‑level data.
 */
type ZipData = {
  propertyTax: Record<string, number>
  insurance: Record<string, number>
}

let cache: ZipData | null = null
let lastLoaded = 0

// Refresh data once every 24 hours
const REFRESH_INTERVAL = 1000 * 60 * 60 * 24

// Resolve file paths inside the /data directory
const dataPath = (file: string) => path.resolve(process.cwd(), 'data', file)

/**
 * Ensures a data file exists. If missing, generates it and writes it to disk.
 */
async function ensureDataFile<T>(
  filename: string,
  generator: () => Promise<T>,
): Promise<T> {
  try {
    const raw = await fsp.readFile(dataPath(filename), 'utf-8')
    return JSON.parse(raw)
  }
  catch {
    // File missing — generate and persist it
    const data = await generator()
    await fsp.mkdir(path.dirname(dataPath(filename)), { recursive: true })
    await fsp.writeFile(dataPath(filename), JSON.stringify(data, null, 2))
    return data
  }
}

/**
 * Loads ZIP‑level property tax and insurance data.
 * Uses in‑memory caching with a 24‑hour refresh window.
 */
export async function getZipData(): Promise<ZipData> {
  const now = Date.now()

  // Return cached data if still fresh
  if (cache && now - lastLoaded < REFRESH_INTERVAL) return cache

  // Load or generate both datasets in parallel
  const [propertyTax, insurance] = await Promise.all([
    ensureDataFile('propertyTaxByZip.json', generatePropertyTaxByZip),
    ensureDataFile('insuranceByZip.json', scrapeInsuranceRates),
  ])

  cache = { propertyTax, insurance }
  lastLoaded = now
  return cache
}