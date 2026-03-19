<template>
  <div class="chart-container">
    <Doughnut
      v-if="chartType === 'donut'"
      :data="donutData"
      :options="commonOptions"
    />
    <Line
      v-else
      :data="lineData"
      :options="commonOptions"
    />
  </div>
</template>

<script setup lang="ts">
/**
 * @file components/loanChart.vue
 * @description Mortgage visualization using Chart.js & vue-chartjs.
 */
import { computed } from 'vue'
import { 
  Chart as ChartJS, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Filler 
} from 'chart.js'
import { Doughnut, Line } from 'vue-chartjs'
import type { LoanModel, AmortizationEntry } from '../models/loanModel.js'

// Register Chart.js components
ChartJS.register(
  Title, Tooltip, Legend, ArcElement, 
  CategoryScale, LinearScale, PointElement, LineElement, Filler
)

const props = defineProps<{
  form: LoanModel
  schedule: AmortizationEntry[]
  chartType: 'donut' | 'line' | 'balance'
}>()

/**
 * Donut Chart Data (Principal vs Total Interest)
 */
const donutData = computed(() => {
  const totalInterest = props.schedule.reduce((sum, m) => sum + m.interest, 0)
  const principalAmount = props.form.purchasePrice - (props.form.purchasePrice * (props.form.downPayment / 100))
  
  return {
    labels: ['Principal', 'Total Interest'],
    datasets: [{
      backgroundColor: ['#41B883', '#E46651'],
      data: [principalAmount, totalInterest]
    }]
  }
})

/**
 * Line Chart Data (Balance over time)
 */
const lineData = computed(() => {
  // Filter for yearly data points to keep the chart clean
  const yearlyData = props.schedule.filter((_, i) => i % 12 === 0)
  
  return {
    labels: yearlyData.map(m => `Year ${m.month / 12}`),
    datasets: [{
      label: props.chartType === 'balance' ? 'Remaining Balance' : 'Equity Build',
      backgroundColor: 'rgba(65, 184, 131, 0.2)',
      borderColor: '#41B883',
      fill: true,
      data: yearlyData.map(m => m.balance)
    }]
  }
})

const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' as const }
  }
}
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 400px;
  width: 100%;
}
</style>