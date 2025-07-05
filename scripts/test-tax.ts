import { generatePropertyTaxByZip } from '../utilities/generatePropertyTaxByZip.js'

generatePropertyTaxByZip()
  .catch(err => {
    console.error('❌ Failed to generate ZIP tax data:', err)
  })