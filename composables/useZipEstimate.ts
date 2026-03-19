/**
 * @file composables/useZipEstimates.ts
 * @description Fetches localized property tax and insurance estimates.
 * Optimized for Nuxt SSR and Cloudflare execution.
 */

/**
 * Record type mapping ZIP codes to their respective numerical values.
 */
type ZipTaxMap = Record<string, number>;

export interface ZipEstimateResult {
  tax: number | null;
  insurance: number | null;
}

/**
 * Retrieves tax and insurance data from public JSON assets.
 * Uses the native fetch API for maximum compatibility with Vitest and NodeNext.
 */
export async function useZipEstimates(zip: string): Promise<ZipEstimateResult> {
  if (!zip || zip.length !== 5) {
    return { tax: null, insurance: null };
  }

  try {
    /**
     * FIX: Use global 'fetch' instead of '$fetch'.
     * In Nuxt/Browser/Node 18+, 'fetch' is globally available.
     * This resolves the "Cannot find name '$fetch'" error in tests.
     */
    const [taxRes, insRes] = await Promise.all([
      fetch('/propertyTaxByZip.json'),
      fetch('/insuranceByZip.json')
    ]);

    if (!taxRes.ok || !insRes.ok) throw new Error('Failed to load JSON assets');

    const taxData: ZipTaxMap = await taxRes.json();
    const insuranceData: ZipTaxMap = await insRes.json();

    const rawTax = taxData?.[zip] ?? null;
    const rawInsurance = insuranceData?.[zip] ?? null;

    return { 
      tax: rawTax, 
      insurance: rawInsurance !== null ? Math.trunc((rawInsurance / 12) * 100) / 100 : null 
    };
  } catch (error) {
    console.error(`[Mortgage Tool] Error fetching data for ZIP ${zip}:`, error);
    return { tax: null, insurance: null };
  }
}