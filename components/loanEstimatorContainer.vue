<template>
  <div class="d-flex flex-column flex-lg-row align-start ga-4 position-relative pa-0 ma-0 pa-md-auto ma-md-auto">
    <!-- Form Panel -->
    <div class="flex-grow-1 w-100 w-lg-auto">
      <LoanForm v-model="loanData"
                :zip-data-found="zipDataFound" />
    </div>

    <!-- Chart Panel -->
    <div class="mt-4 mt-md-0 w-100 w-lg-auto">
      <LoanResultsChart id="results"
                        :form="loanData" />
    </div>
    <ScrollToBtn v-if="smAndDown"
                 target="#results"
                 behavior="smooth"
                 color="primary"
                 variant="elevated"
                 size="large"
                 block
                 style="z-index: 1000"
                 class="position-fixed bottom-0 left-0 w-100 rounded-0">
      See Estimate
    </ScrollToBtn>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { LoanType } from '../models/loanModel'
import type { LoanModel } from '../models/loanModel'
import { useDisplay } from 'vuetify'
import { useZipEstimates } from '../composables/useZipEstimate'
import ScrollToBtn from './scrollToBtn.vue'
const { smAndDown } = useDisplay()
const zipDataFound = ref(false)
const isAtBottom = ref(false)
// This is the shared reactive state between form and results
const loanData = ref<LoanModel>({
  purchasePrice: 500000,
  downPayment: 20,
  term: 30,
  rate: 6.5,
  zip: '',
  loanType: LoanType.CONV, // or LoanType.CONV if using enum
  hoa: 100,
  points: 0,
  includePMI: false,
  taxRate: 1.2,
  insurance: 1200,
  closingCosts: 3,
})

watch(() => loanData.value.zip, async (zip) => {
  if (!zip || zip.length !== 5) return

  const { tax, insurance } = await useZipEstimates(zip)

  zipDataFound.value = tax !== null || insurance !== null

  if (tax !== null) loanData.value.taxRate = tax
  if (insurance !== null) loanData.value.insurance = insurance
})

</script>

<style scoped></style>
