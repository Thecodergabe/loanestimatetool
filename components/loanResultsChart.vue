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
               icon="mdi-chart-donut" />
        <v-btn value="line"
               icon="mdi-chart-line" />
        <v-btn value="balance"
               icon="mdi-finance" />
      </v-btn-toggle>
    </v-card-title>

    <v-card-text>
      <v-slide-y-transition>
        <div v-if="chartType === 'donut'"
             key="donut">
          <Doughnut :data="donutData"
                    :options="donutOptions"
                    :plugins="[ChartDataLabels]" />
        </div>
        <div v-else-if="chartType === 'line'"
             key="line">
          <Line :data="lineData" />
        </div>
        <div v-else
             key="balance">
          <Line :data="balanceData" />
        </div>
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
    <v-card-actions class="align-center justify-center d-flex mt-4">
      <v-select v-model="exportFormat"
                :items="['CSV', 'PDF']"
                label="Export Format"
                density="compact"
                variant="solo"
                hide-details
                style="max-width: 150px"
                class="me-4" />
      <v-btn class="me-4"
             variant="outlined"
             color="primary"
             @click="downloadSchedule">
        Download Amortization Schedule
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Doughnut, Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  type ChartOptions
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import type { LoanModel } from '~/models/loanModel'
import { useMortgageCalculator } from '~/composables/useMortgageCalculator'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
// Register only core chart components globally
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale
)

const props = defineProps<{ form: LoanModel }>()
const chartType = ref<'donut' | 'line'>('donut')
const formatCurrency = (value: number): string =>
  value.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
const formRef = ref(props.form)
const {
  monthlyPayment,
  taxes,
  insurance,
  pmi,
  hoa,
  totalMonthly,
  principal,
  monthlyRate
} = useMortgageCalculator(formRef)

const balanceData = computed(() => ({
  labels: amortizationSchedule.value.map(p => `Month ${p.month}`),
  datasets: [
    {
      label: 'Remaining Balance',
      data: amortizationSchedule.value.map(p => p.balance),
      borderColor: '#1976D2',
      fill: false
    }
  ]
}))

const donutData = computed(() => ({
  labels: ['Principal + Interest', 'Taxes', 'Insurance', 'PMI', 'HOA'],
  datasets: [
    {
      data: [
        monthlyPayment.value,
        taxes.value,
        insurance.value,
        pmi.value,
        hoa.value
      ],
      backgroundColor: ['#1976D2', '#4CAF50', '#FFC107', '#E91E63', '#9C27B0']
    }
  ]
}))

const donutOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    datalabels: {
      color: '#fff',
      font: { weight: 'bold' },
      formatter: (value: number) => `$${value.toFixed(0)}`
    },
    legend: {
      position: 'bottom'
    }
  }
}

const amortizationSchedule = computed(() => {
  const schedule = []
  let balance = principal.value
  const r = monthlyRate.value
  const n = props.form.term * 12

  for (let i = 0; i < n; i++) {
    const interest = balance * r
    const principalPaid = monthlyPayment.value - interest
    balance -= principalPaid
    schedule.push({
      month: i + 1,
      principalPaid,
      interest,
      balance
    })
  }

  return schedule
})

const lineData = computed(() => ({
  labels: amortizationSchedule.value.map(p => `Month ${p.month}`),
  datasets: [
    {
      label: 'Principal Paid',
      data: amortizationSchedule.value.map(p => p.principalPaid),
      borderColor: '#4CAF50',
      fill: false
    },
    {
      label: 'Interest Paid',
      data: amortizationSchedule.value.map(p => p.interest),
      borderColor: '#E91E63',
      fill: false
    }
  ]
}))

const totals = computed(() => {
  const schedule = amortizationSchedule.value
  const totalPrincipal = schedule.reduce((sum, p) => sum + p.principalPaid, 0)
  const totalInterest = schedule.reduce((sum, p) => sum + p.interest, 0)
  const totalCost = totalPrincipal + totalInterest

  return {
    totalMonthly: totalMonthly.value,
    totalPrincipal,
    totalInterest,
    totalCost
  }
})

function downloadCSV() {
  const rows = [
    ['Month', 'Principal Paid', 'Interest', 'Remaining Balance'],
    ...amortizationSchedule.value.map(p => [
      p.month,
      p.principalPaid.toFixed(2),
      p.interest.toFixed(2),
      p.balance.toFixed(2)
    ])
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

const exportFormat = ref<'CSV' | 'PDF'>('CSV')

function downloadSchedule() {
  if (exportFormat.value === 'CSV') {
    downloadCSV()
  } else if (exportFormat.value === 'PDF') {
    downloadPDF()
  }
}

async function downloadPDF() {
  const pdfDoc = await PDFDocument.create()
  let page = pdfDoc.addPage([595.28, 841.89]) // A4 size
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const margin = 50
  let y = 800
  const lineHeight = 18

  // Title
  page.drawText('Amortization Schedule (Yearly Summary)', {
    x: margin,
    y,
    size: 16,
    font,
    color: rgb(0, 0, 0)
  })

  y -= lineHeight * 2

  // Header row
  page.drawText('Year', { x: margin, y, size: 12, font, color: rgb(0.2, 0.2, 0.2) })
  page.drawText('Principal Paid', { x: margin + 80, y, size: 12, font })
  page.drawText('Interest Paid', { x: margin + 200, y, size: 12, font })
  page.drawText('Remaining Balance', { x: margin + 320, y, size: 12, font })

  y -= lineHeight

  // Group by year
  const grouped = new Map<number, { principal: number; interest: number; balance: number }>()

  amortizationSchedule.value.forEach(p => {
    const year = Math.ceil(p.month / 12)
    if (!grouped.has(year)) {
      grouped.set(year, { principal: 0, interest: 0, balance: p.balance })
    }
    const entry = grouped.get(year)!
    entry.principal += p.principalPaid
    entry.interest += p.interest
    entry.balance = p.balance
  })

  for (const [year, data] of grouped.entries()) {
    if (y < 60) {
      // Add new page if needed
      const newPage = pdfDoc.addPage([595.28, 841.89])
      y = 800
      page.drawText('Continued...', { x: margin, y, size: 12, font })
      page = newPage
    }

    page.drawText(`${year}`, { x: margin, y, size: 10, font })
    page.drawText(`$${data.principal.toFixed(2)}`, { x: margin + 80, y, size: 10, font })
    page.drawText(`$${data.interest.toFixed(2)}`, { x: margin + 200, y, size: 10, font })
    page.drawText(`$${data.balance.toFixed(2)}`, { x: margin + 320, y, size: 10, font })

    y -= lineHeight
  }

  const pdfBytes = await pdfDoc.save()
  const blob = new Blob([pdfBytes], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = 'amortization_schedule.pdf'
  link.click()
  URL.revokeObjectURL(url)
}


</script>