import fs from "fs/promises"
import path from "path"
import { parse } from "csv-parse"
import * as cheerio from "cheerio"
import fetch from "node-fetch"

const ZIP_CSV_PATH = path.resolve("../data/zip_to_county.csv")
const OUTPUT_PATH = path.resolve("../public/propertyTaxByZip.json")
const TAX_FOUNDATION_URL = "https://taxfoundation.org/data/all/state/property-taxes-by-state-county/"

const normalizeKey = (state, county) =>
  `${state.trim().toUpperCase()}|${county
    .trim()
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/\s+/g, " ")
    .replace(/ county| parish| borough| census area| city and borough| municipality/gi, "")}`

const parseZipToCounty = async () => {
  const file = await fs.readFile(ZIP_CSV_PATH, "utf-8")
  return new Promise((resolve, reject) => {
    parse(file, { columns: true, skip_empty_lines: true, trim: true }, (err, records) => {
      if (err) return reject(err)
      const rows = records
        .map((row) => {
          const ZIP = row["zipcode"]?.trim()
          const County = row["county"]?.trim()
          const State = row["state"]?.trim()
          if (ZIP && County && State) return { ZIP, County, State }
          return null
        })
        .filter(Boolean)
      resolve(rows)
    })
  })
}

const scrapeCountyTaxRates = async () => {
  const res = await fetch(TAX_FOUNDATION_URL)
  const html = await res.text()
  const $ = cheerio.load(html)
  const rates = {}

  $("table tbody tr").each((_, row) => {
    const cells = $(row).find("td")
    const state = $(cells[0]).text().trim()
    const rawCounty = $(cells[1]).text().trim()
    const county = rawCounty.replace(/ County$/, "").trim()
    const rateStr = $(cells[4]).text().replace("%", "").trim()
    const rate = parseFloat(rateStr)
    if (state && county && !isNaN(rate)) {
      const key = normalizeKey(state, county)
      rates[key] = rate
    }
  })

  return rates
}

const generate = async () => {
  const zipCountyRows = await parseZipToCounty()
  const countyRates = await scrapeCountyTaxRates()
  const zipTaxMap = {}

  for (const row of zipCountyRows) {
    const key = normalizeKey(row.State, row.County)
    const rate = countyRates[key]
    if (rate !== undefined) {
      zipTaxMap[row.ZIP] = rate
    }
  }

  await fs.writeFile(OUTPUT_PATH, JSON.stringify(zipTaxMap, null, 2))
}

generate().catch((err) => {
  console.error("âŒ Failed:", err)
  process.exit(1)
})
