/**
 * @file composables/useZipEstimates.ts
 * @description Retrieves ZIP‑level property tax and insurance estimates.
 */

/** Map of ZIP codes to numeric values. */
type ZipTaxMap = Record<string, number>

export interface ZipEstimateResult {
  tax: number | null
  insurance: number | null
}

/**
 * Fetches tax and insurance data from public JSON assets.
 * Uses the global `fetch` API for compatibility with SSR, Node, and Vitest.
 */
export async function useZipEstimates(zip: string): Promise<ZipEstimateResult> {
  if (!zip || zip.length !== 5) {
    return { tax: null, insurance: null }
  }

  try {
    const [taxRes, insRes] = await Promise.all([
      fetch('/propertyTaxByZip.json'),
      fetch('/insuranceByZip.json'),
    ])

    if (!taxRes.ok || !insRes.ok) {
      throw new Error('Failed to load JSON assets')
    }

    const taxData: ZipTaxMap = await taxRes.json()
    const insuranceData: ZipTaxMap = await insRes.json()

    const rawTax = taxData?.[zip] ?? null
    const rawInsurance = insuranceData?.[zip] ?? null

    return {
      tax: rawTax,
      insurance:
        rawInsurance !== null
          ? Math.trunc((rawInsurance / 12) * 100) / 100
          : null,
    }
  } catch (error) {
    console.error(`[Mortgage Tool] Error fetching data for ZIP ${zip}:`, error)
    return { tax: null, insurance: null }
  }
}