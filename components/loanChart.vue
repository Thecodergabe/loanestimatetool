<template>
  <div class="chart-container">
    <v-skeleton-loader
      v-if="!showChart"
      type="image"
      class="rounded-lg"
      height="300"
    />
    <component
      :is="currentChartComponent"
      v-else
      key="chart"
      :data="currentChartData"
      :options="currentChartOptions"
      :plugins="currentChartPlugins"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent, onMounted } from 'vue'
import { useLoanChart } from '../composables/useLoanChart'
import type { LoanModel } from '../models/loanModel'
import type { AmortizationEntry } from '../types/loan'

const props = defineProps<{
  form: LoanModel
  schedule: AmortizationEntry[]
  chartType: 'donut' | 'line' | 'balance'
}>()

const showChart = ref(false)
onMounted(() => {
  requestIdleCallback(() => {
    showChart.value = true
  })
})

const Doughnut = defineAsyncComponent(() =>
  import('vue-chartjs').then(m => m.Doughnut),
)
const Line = defineAsyncComponent(() =>
  import('vue-chartjs').then(m => m.Line),
)

const formRef = ref(props.form)
const scheduleRef = ref(props.schedule)

const {
  donutData,
  lineData,
  balanceData,
  donutOptions,
  ChartDataLabels,
} = useLoanChart(formRef, scheduleRef)

const currentChartComponent = computed(() => {
  return props.chartType === 'donut' ? Doughnut : Line
})

const currentChartData = computed(() => {
  if (props.chartType === 'donut') return donutData.value
  return props.chartType === 'line' ? lineData.value : balanceData.value
})

const currentChartOptions = computed(() => {
  return props.chartType === 'donut' ? donutOptions : undefined
})

const currentChartPlugins = computed(() => {
  return props.chartType === 'donut' ? [ChartDataLabels] : undefined
})
</script>

<style scoped>
.chart-container {
  height: auto;

  min-height: 300px;
  content-visibility: auto;
  contain-intrinsic-size: 300px;
}
</style>
