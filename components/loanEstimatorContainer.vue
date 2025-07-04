<template>
  <div class="d-flex flex-column flex-lg-row align-start ga-4">
    <!-- Form Panel -->
    <div class="flex-grow-1">
        <LoanForm v-model="loanData" @see-results="scrollToId" />
    </div>

    <!-- Chart Panel -->
    <div
      class="mt-4 mt-md-0 w-100 w-lg-auto"
    >
      <LoanResultsChart id="results" :form="loanData" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { LoanType, type LoanModel } from '~/models/loanModel'

// This is the shared reactive state between form and results
const loanData = ref<LoanModel>({
  purchasePrice: 500000,
  downPayment: 20,
  term: 30,
  rate: 6.5,
  zip: '97229',
  loanType: LoanType.Conventional, // or LoanType.Conventional if using enum
  hoa: 100,
  points: 0,
  includePMI: false,
  taxRate: 1.2,
  insurance: 1200,
  closingCosts: 3
})

const scrollToId = () => {
  const el = document.getElementById("results")
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped>
</style>