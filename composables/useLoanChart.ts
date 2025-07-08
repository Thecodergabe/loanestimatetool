import { computed } from 'vue'
import type { Ref } from 'vue'
import type { ChartData, ChartOptions } from 'chart.js'
import type { AmortizationEntry } from '../types/loan.js'
import { useMortgageCalculator } from './useMortgageCalculator.js'
import type { LoanModel } from '../models/loanModel.js'

export function useLoanChart(
  form: Ref<LoanModel>,
  schedule: Ref<AmortizationEntry[]>
) {
  const { monthlyPayment, taxes, insurance, pmi, hoa } = useMortgageCalculator(form)

  const donutData = computed<ChartData<'doughnut'>>(() => ({
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

  const lineData = computed<ChartData<'line'>>(() => ({
    labels: schedule.value.map(p => `Month ${p.month}`),
    datasets: [
      {
        label: 'Principal Paid',
        data: schedule.value.map(p => p.principalPaid),
        borderColor: '#4CAF50',
        backgroundColor: 'transparent',
        borderWidth: 2,
        fill: false
      },
      {
        label: 'Interest Paid',
        data: schedule.value.map(p => p.interest),
        borderColor: '#E91E63',
        backgroundColor: 'transparent',
        borderWidth: 2,
        fill: false
      }
    ]
  }))

  const balanceData = computed<ChartData<'line'>>(() => ({
    labels: schedule.value.map(p => `Month ${p.month}`),
    datasets: [
      {
        label: 'Remaining Balance',
        data: schedule.value.map(p => p.balance),
        borderColor: '#1976D2',
        backgroundColor: 'transparent',
        borderWidth: 2,
        fill: false
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
      legend: { position: 'bottom' }
    }
  }

  const lineOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: { position: 'bottom' }
    },
    elements: {
      line: { borderWidth: 2 },
      point: { radius: 2 }
    },
    scales: {
      x: { title: { display: true, text: 'Month' } },
      y: { title: { display: true, text: 'Amount ($)' } }
    }
  }

  const balanceOptions: ChartOptions<'line'> = {
    ...lineOptions,
    plugins: {
      ...lineOptions.plugins,
      tooltip: {
        callbacks: {
          label: (ctx) => `Balance: $${ctx.parsed.y.toFixed(2)}`
        }
      }
    }
  }

  return {
    donutData,
    lineData,
    balanceData,
    donutOptions,
    lineOptions,
    balanceOptions
  }
}