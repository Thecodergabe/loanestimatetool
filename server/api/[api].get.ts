/**
 * @file server/api/estimate/[zip].get.ts
 * @description This is a Nitro Server Route. It runs on the Cloudflare Edge.
 * It reads your local JSON files and returns only the data for the requested ZIP.
 */

// Nuxt lets us import JSON directly. 
// These stay on the server and are NEVER sent to the client's browser.
import propertyTaxes from '~/data/propertyTaxByZip.json'
import insuranceRates from '~/data/insuranceByZip.json'

export default defineEventHandler(async (event) => {
  // This gets the [zip] part from the URL /api/estimate/90210
  const zip = getRouterParam(event, 'zip')

  if (!zip || zip.length !== 5) {
    throw createError({ statusCode: 400, message: 'Invalid ZIP' })
  }

  // Lookup data from your local files
  const tax = (propertyTaxes as any)[zip] || 1.2
  const insurance = (insuranceRates as any)[zip] || 1200

  // Return only the specific data for this user
  return {
    zip,
    tax,
    insurance: Math.trunc((insurance / 12) * 100) / 100 // Monthly calc
  }
})