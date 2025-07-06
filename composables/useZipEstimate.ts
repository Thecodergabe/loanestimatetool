import { useFetch } from 'nuxt/app'

type ZipTaxMap = Record<string, number>

export async function useZipEstimates(zip: string) {
  const { data: taxData } = await useFetch<ZipTaxMap>('/propertyTaxByZip.json')
  const { data: insuranceData } = await useFetch<ZipTaxMap>('/insuranceByZip.json')

  const rawTax = taxData.value?.[zip] ?? null
  const rawInsurance = insuranceData.value?.[zip] ?? null

  const tax = rawTax !== null ? rawTax : null
  const insurance = rawInsurance !== null
    ? Math.trunc((rawInsurance / 12) * 100) / 100
    : null

  return { tax, insurance }
}
