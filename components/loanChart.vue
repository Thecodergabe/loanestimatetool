<template>
  <div class="chart-container">
    <v-skeleton-loader
      v-if="!showChart"
      type="image"
      class="rounded-lg"
      height="300"
    />
    <ClientOnly>
      <Doughnut
        v-if="showChart && props.chartType === 'donut'"
        key="donut"
        :data="donutData"
        :options="donutOptions"
      />
      <Line
        v-else-if="props.chartType === 'line'"
        key="line"
        :data="lineData"
        :options="lineOptions"
      />
      <Line
        v-else-if="props.chartType === 'balance'"
        key="balance"
        :data="balanceData"
        :options="balanceOptions"
      />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent, onMounted } from 'vue'
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
  import('vue-chartjs').then(m => m.Doughnut)
)
const Line = defineAsyncComponent(() =>
  import('vue-chartjs').then(m => m.Line)
)

const formRef = ref(props.form)
const scheduleRef = ref(props.schedule)

const {
  donutData,
  lineData,
  balanceData,
  donutOptions,
  lineOptions,
  balanceOptions
} = useLoanChart(formRef, scheduleRef)

</script>

<style scoped>
.chart-container {
  min-height: 300px;
  content-visibility: auto;
  contain-intrinsic-size: 300px;
}
</style>