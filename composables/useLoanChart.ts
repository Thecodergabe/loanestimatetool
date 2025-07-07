// composables/useLoanChart.ts
import type { Ref } from 'vue'
import { computed } from 'vue'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import type { ChartOptions, Plugin } from 'chart.js'
import type { AmortizationEntry } from '../types/loan'
import { useMortgageCalculator } from './useMortgageCalculator'
import type { LoanModel } from '../models/loanModel'

export function useLoanChart(form: Ref<LoanModel>, schedule: Ref<AmortizationEntry[]>) {
  const {
    monthlyPayment,
    taxes,
    insurance,
    pmi,
    hoa,
  } = useMortgageCalculator(form)

  const donutData = computed(() => ({
    labels: ['Principal + Interest', 'Taxes', 'Insurance', 'PMI', 'HOA'],
    datasets: [
      {
        data: [
          monthlyPayment.value,
          taxes.value,
          insurance.value,
          pmi.value,
          hoa.value,
        ],
        backgroundColor: ['#1976D2', '#4CAF50', '#FFC107', '#E91E63', '#9C27B0'],
      },
    ],
    options: {
      animation: false,
    },
  }))

  const lineData = computed(() => ({
    labels: schedule.value.map(p => `Month ${p.month}`),
    datasets: [
      {
        label: 'Principal Paid',
        data: schedule.value.map(p => p.principalPaid),
        borderColor: '#4CAF50',
        fill: false,
      },
      {
        label: 'Interest Paid',
        data: schedule.value.map(p => p.interest),
        borderColor: '#E91E63',
        fill: false,
      },
    ],
    options: {
      animation: false,
    },
  }))

  const balanceData = computed(() => ({
    labels: schedule.value.map(p => `Month ${p.month}`),
    datasets: [
      {
        label: 'Remaining Balance',
        data: schedule.value.map(p => p.balance),
        borderColor: '#1976D2',
        fill: false,
      },
    ],
    options: {
      animation: false,
    },
  }))

  const donutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        color: '#fff',
        font: { weight: 'bold' },
        formatter: (value: number) => `$${value.toFixed(0)}`,
      },
      legend: {
        position: 'bottom',
      },
    },
  }

  return {
    donutData,
    lineData,
    balanceData,
    donutOptions,
    ChartDataLabels: ChartDataLabels as Plugin<'doughnut'>,
  }
}
