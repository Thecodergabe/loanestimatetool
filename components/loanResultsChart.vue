<template>
  <v-card 
    elevation="0" 
    class="pa-4 pa-sm-6 rounded-xl border-light fill-height d-flex flex-column bg-visualization shadow-sm"
  >
    <div class="d-flex align-center justify-space-between mb-4">
      <h3 class="text-h6 font-weight-black">Loan Visualization</h3>

      <div class="d-flex ga-2">
        <v-btn
          icon="mdi-chart-donut"
          :variant="activeChart === 'donut' ? 'flat' : 'tonal'"
          :color="activeChart === 'donut' ? 'primary' : undefined"
          size="small"
          @click="activeChart = 'donut'"
        />

        <v-btn
          icon="mdi-chart-timeline-variant"
          :variant="activeChart === 'line' ? 'flat' : 'tonal'"
          :color="activeChart === 'line' ? 'primary' : undefined"
          size="small"
          @click="activeChart = 'line'"
        />
      </div>
    </div>

    <div class="chart-wrapper mb-6 position-relative">
      <div v-if="activeChart === 'donut'" class="center-text">
        <div class="text-h5 text-sm-h4 font-weight-black" :class="mainValueClass">
          {{ formatCurrency(calc.totalMonthly.value) }}
        </div>
        <div class="text-caption font-weight-bold text-medium-emphasis uppercase tracking-wider">
          Monthly Total
        </div>
      </div>

      <Doughnut
        v-if="activeChart === 'donut'"
        :data="donutData"
        :options="donutOptions"
      />

      <Line
        v-else
        :data="lineData"
        :options="lineOptions"
      />
    </div>

    <v-divider class="mb-4 opacity-10" />

    <v-row no-gutters class="text-start mb-6 border-grid">
      <v-col cols="6" class="pa-3 border-r border-b">
        <div :class="labelClass">Monthly P&I</div>
        <div class="text-subtitle-1 font-weight-black text-primary">
          {{ formatCurrency(calc.monthlyPayment.value) }}
        </div>
      </v-col>

      <v-col cols="6" class="pa-3 border-b">
        <div :class="labelClass">Total Principal</div>
        <div :class="valueClass">
          {{ formatCurrency(calc.principal.value) }}
        </div>
      </v-col>

      <v-col cols="6" class="pa-3 border-r">
        <div :class="labelClass">Total Interest</div>
        <div class="text-subtitle-1 font-weight-black text-error">
          {{ formatCurrency(totalInterest) }}
        </div>
      </v-col>

      <v-col cols="6" class="pa-3">
        <div :class="labelClass">Total Loan Cost</div>
        <div :class="valueClass">
          {{ formatCurrency(totalLoanCost) }}
        </div>
      </v-col>
    </v-row>

    <div class="mt-auto">
      <v-btn
        color="primary"
        block
        size="large"
        class="text-none font-weight-bold "
        rounded="lg"
        elevation="4"
        @click="handleDownload"
      >
        Download Amortization PDF
      </v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
/**
 * @file components/loanResultsChart.vue
 * @description Interactive visualization component supporting donut/line views.
 * Uses composables for mortgage math + PDF export.
 */

import { ref, computed } from 'vue'
import { useTheme } from 'vuetify'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler
} from 'chart.js'
import { Doughnut, Line } from 'vue-chartjs'
import type { LoanModel } from '../models/loanModel.js'
import { useMortgageCalculator } from '../composables/useMortgageCalculator.js'
import { useAmortizationPDF } from '../composables/useAmortizationPDF.js'

/**
 * Register required Chart.js modules.
 * vue-chartjs won't render unless these are explicitly registered.
 */
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler
)

/**
 * Props:
 * - form: the full loan configuration used to compute amortization + PITI.
 */
const props = defineProps<{ form: LoanModel }>()

/**
 * Theme awareness for dynamic color adjustments.
 */
const theme = useTheme()
const isDark = computed(() => theme.global.current.value.dark)

/**
 * Active chart type (donut or line).
 */
const activeChart = ref<'donut' | 'line'>('donut')

/**
 * Mortgage calculation engine.
 * Provides:
 * - monthly payment
 * - principal
 * - amortization schedule
 * - total monthly cost
 */
const calc = useMortgageCalculator(computed(() => props.form))

/**
 * PDF export composable.
 */
const { downloadAmortizationPDF } = useAmortizationPDF()

/**
 * Dynamic UI classes based on theme.
 * Ensures proper contrast in dark/light mode.
 */
const labelClass = computed(() =>
  isDark.value
    ? 'text-slate-400 font-weight-bold text-caption'
    : 'text-slate-500 font-weight-bold text-caption'
)

const valueClass = computed(() =>
  isDark.value
    ? 'text-slate-100 text-subtitle-1 font-weight-black'
    : 'text-slate-900 text-subtitle-1 font-weight-black'
)

const mainValueClass = computed(() =>
  isDark.value ? 'text-white' : 'text-slate-900'
)

/**
 * Total interest paid over the entire loan.
 */
const totalInterest = computed(() =>
  calc.amortizationSchedule.value.reduce((sum, month) => sum + month.interest, 0)
)

/**
 * Total cost of the loan = principal + interest.
 */
const totalLoanCost = computed(() =>
  calc.principal.value + totalInterest.value
)

/**
 * Donut chart data:
 * Breakdown of monthly payment components (P&I, taxes, insurance, HOA, PMI).
 */
const donutData = computed(() => {
  const pAndI = calc.monthlyPayment.value
  const taxes = (props.form.purchasePrice * (props.form.taxRate / 100)) / 12
  const insurance = (props.form.insurance || 0) / 12
  const hoa = props.form.hoa || 0

  // PMI applies only if down payment < 20%
  const pmi =
    props.form.includePMI && props.form.downPayment < 20
      ? (calc.principal.value * 0.005) / 12
      : 0

  return {
    labels: ['P&I', 'Taxes', 'Insurance', 'HOA', 'PMI'],
    datasets: [
      {
        data: [pAndI, taxes, insurance, hoa, pmi],
        backgroundColor: ['#1E88E5', '#43A047', '#FB8C00', '#9C27B0', '#E53935'],
        cutout: '80%',
        borderWidth: 0
      }
    ]
  }
})

/**
 * Line chart data:
 * Remaining balance over time (yearly points only).
 */
const lineData = computed(() => {
  const yearlyData = calc.amortizationSchedule.value.filter((_, i) => i % 12 === 0)

  return {
    labels: yearlyData.map(m => `Year ${Math.floor(m.month / 12)}`),
    datasets: [
      {
        label: 'Remaining Balance',
        data: yearlyData.map(m => m.balance),
        borderColor: '#1E88E5',
        backgroundColor: 'rgba(30, 136, 229, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }
})

/**
 * Chart.js options for donut chart.
 */
const donutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } }
}

/**
 * Chart.js options for line chart.
 * Includes dynamic grid/tick colors for dark mode.
 */
const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: () =>
          isDark.value ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
      },
      ticks: {
        color: () => (isDark.value ? '#94A3B8' : '#64748B'),
        callback: (val: any) => '$' + val.toLocaleString()
      }
    },
    x: {
      grid: { display: false },
      ticks: {
        color: () => (isDark.value ? '#94A3B8' : '#64748B')
      }
    }
  },
  plugins: { legend: { display: false } }
}

/**
 * Currency formatter for UI display.
 */
const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(val)
}

/**
 * Handles export action.
 * Currently supports PDF only.
 */
const handleDownload = () => {
  downloadAmortizationPDF(calc.amortizationSchedule.value, props.form.zip)
}
</script>

<style scoped>
.bg-visualization {
  background-color: v-bind('isDark ? "#1E293B" : "#FFFFFF"') !important;
}

.chart-wrapper {
  height: 280px;
  width: 100%;
}

.center-text {
  position: absolute;
  top: 55%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 100%;
  pointer-events: none;
}

.border-light {
  border: 1px solid v-bind('isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"') !important;
}

.border-r { 
  border-right: 1px solid v-bind('isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"'); 
}

.border-b { 
  border-bottom: 1px solid v-bind('isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"'); 
}


.uppercase { text-transform: uppercase; }

.tracking-wider { letter-spacing: 0.1em; }

.text-slate-100 { color: #F1F5F9 !important; }
.text-slate-400 { color: #94A3B8 !important; }
.text-slate-500 { color: #64748B !important; }
.text-slate-900 { color: #0F172A !important; }

.custom-select :deep(.v-field__outline) {
  --v-field-border-opacity: 0.1;
}
</style>