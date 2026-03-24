import { defineNuxtPlugin } from 'nuxt/app'
import { getZipData } from '../utilities/zipDataLoader.js'

/**
 * Nuxt plugin that warms the ZIP‑level tax/insurance data cache
 * on server startup. This avoids the first request paying the load cost.
 */
export default defineNuxtPlugin(async () => {
  try {
    await getZipData()
  }
  catch (err) {
    console.error('Failed to warm ZIP data cache:', err)
  }
})