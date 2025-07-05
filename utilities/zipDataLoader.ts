import fsp from 'fs/promises'
import fs from 'fs'
import path from 'path'
import { scrapeInsuranceRates } from './scrapeInsuranceRates.js'
import { generatePropertyTaxByZip } from './generatePropertyTaxByZip.js'

type ZipData = {
  propertyTax: Record<string, number>
  insurance: Record<string, number>
}

let cache: ZipData | null = null
let lastLoaded = 0
const REFRESH_INTERVAL = 1000 * 60 * 60 * 24 // 24 hours

const dataPath = (file: string) => path.resolve(process.cwd(), 'data', file)

async function ensureDataFile<T>(
  filename: string,
  generator: () => Promise<T>
): Promise<T> {
  try {
    const raw = await fsp.readFile(dataPath(filename), 'utf-8')
    return JSON.parse(raw)
  } catch {
    const data = await generator()
    await fsp.mkdir(path.dirname(dataPath(filename)), { recursive: true })
    await fsp.writeFile(dataPath(filename), JSON.stringify(data, null, 2))
    return data
  }
}

export async function getZipData(): Promise<ZipData> {
  const now = Date.now()
  if (cache && now - lastLoaded < REFRESH_INTERVAL) return cache

  const [propertyTax, insurance] = await Promise.all([
    ensureDataFile('propertyTaxByZip.json', generatePropertyTaxByZip),
    ensureDataFile('insuranceByZip.json', scrapeInsuranceRates)
  ])

  cache = { propertyTax, insurance }
  lastLoaded = now
  return cache
}