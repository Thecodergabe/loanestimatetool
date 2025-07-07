import { defineNuxtPlugin } from 'nuxt/app'
import { getZipData } from '../utilities/zipDataLoader'

export default defineNuxtPlugin(async () => {
  try {
    await getZipData()
  }
  catch (err) {
    console.error('❌ Failed to warm ZIP data cache:', err)
  }
})
