<template>
  <v-card elevation="2"
          class="pa-4 position-sticky top-0"
          variant="flat">
    <v-card-title class="d-flex justify-space-between align-center">
      <span class="text-h6">Loan Visualization</span>
      <v-btn-toggle v-model="chartType"
                    mandatory
                    density="compact"
                    class="ml-4">
        <v-btn value="donut"
               aria-label="View donut chart"
               icon="mdi-chart-donut" />
        <v-btn value="line"
               aria-label="View line chart"
               icon="mdi-chart-line" />
        <v-btn value="balance"
               aria-label="View balance chart"
               icon="mdi-finance" />
      </v-btn-toggle>
    </v-card-title>

    <v-card-text>
      <v-slide-y-transition>
        <LoanChart :form="form"
                   :schedule="amortizationSchedule"
                   :chart-type="chartType" />
      </v-slide-y-transition>

      <v-divider class="my-4" />

      <div class="d-flex flex-wrap justify-space-between text-body-2 text-medium-emphasis">
        <div class="ma-2">
          <strong>Total Monthly:</strong> {{ formatCurrency(totals.totalMonthly) }}
        </div>
        <div class="ma-2">
          <strong>Total Principal:</strong> {{ formatCurrency(totals.totalPrincipal) }}
        </div>
        <div class="ma-2">
          <strong>Total Interest:</strong> {{ formatCurrency(totals.totalInterest) }}
        </div>
        <div class="ma-2">
          <strong>Total Cost:</strong> {{ formatCurrency(totals.totalCost) }}
        </div>
      </div>
    </v-card-text>

    <v-card-actions class="align-center justify-center d-flex flex-column flex-lg-row mt-4">
      <v-select v-model="exportFormat"
                :items="['CSV', 'PDF']"
                label="Export Format"
                density="compact"
                variant="outlined"
                hide-details
                :aria-label="`Export in format ${exportFormat}`"
                :style="inputStyle"
                class="me-lg-4"
                :block="mobile" />
      <v-btn class="me-lg-4"
             variant="outlined"
             color="primary"
             aria-label="Download Amortization Schedule"
             :block="mobile"
             @click="downloadSchedule">
        {{ mobile ? 'Download Amortization' : 'Download Amortization Schedule' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { LoanModel } from '../models/loanModel'
import { useAmortizationPDF } from '../composables/useAmortizationPDF'
import type { AmortizationEntry } from '../types/loan'
import { useMortgageCalculator } from '../composables/useMortgageCalculator'
import LoanChart from './loanChart.vue'
import { useDisplay } from 'vuetify'

const { downloadAmortizationPDF } = useAmortizationPDF()
const inputStyle = computed(() =>
  mobile.value
    ? { width: '100%' }
    : { maxWidth: '150px' }
)

const { mobile } = useDisplay()
const props = defineProps<{ form: LoanModel }>()
const chartType = ref<'donut' | 'line' | 'balance'>('donut')
const exportFormat = ref<'CSV' | 'PDF'>('CSV')

const formRef = ref(props.form)
const {
  monthlyPayment,
  totalMonthly,
  principal,
  monthlyRate,
} = useMortgageCalculator(formRef)

const amortizationSchedule = computed<AmortizationEntry[]>(() => {
  const schedule: AmortizationEntry[] = []
  let balance = principal.value
  const r = monthlyRate.value
  const n = props.form.term * 12

  for (let i = 0; i < n; i++) {
    const interest = balance * r
    const principalPaid = monthlyPayment.value - interest
    balance -= principalPaid
    schedule.push({ month: i + 1, principalPaid, interest, balance })
  }

  return schedule
})

const totals = computed(() => {
  const schedule = amortizationSchedule.value
  const totalPrincipal = schedule.reduce((sum, p) => sum + p.principalPaid, 0)
  const totalInterest = schedule.reduce((sum, p) => sum + p.interest, 0)
  const totalCost = totalPrincipal + totalInterest

  return {
    totalMonthly: totalMonthly.value,
    totalPrincipal,
    totalInterest,
    totalCost,
  }
})

const formatCurrency = (value: number): string =>
  value.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

function downloadSchedule() {
  if (exportFormat.value === 'CSV') {
    downloadCSV()
  }
  else {
    downloadPDF()
  }
}

function downloadCSV() {
  const rows = [
    ['Month', 'Principal Paid', 'Interest', 'Remaining Balance'],
    ...amortizationSchedule.value.map(p => [
      p.month,
      p.principalPaid.toFixed(2),
      p.interest.toFixed(2),
      p.balance.toFixed(2),
    ]),
  ]
  const csv = rows.map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'amortization_schedule.csv'
  link.click()
  URL.revokeObjectURL(url)
}

function downloadPDF() {
  downloadAmortizationPDF(amortizationSchedule.value)
}
</script>
