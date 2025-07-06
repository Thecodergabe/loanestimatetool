// composables/useChartConfig.ts
import { Chart, type ChartOptions, type Plugin } from 'chart.js'

export async function useChartConfig(): Promise<{
  donutOptions: ChartOptions<'doughnut'>
  lineOptions: ChartOptions<'line'>
  balanceOptions: ChartOptions<'line'>
}> {
  const ChartDataLabels = (await import('chartjs-plugin-datalabels')).default as unknown as Plugin<'doughnut'>

  Chart.register(ChartDataLabels)

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

  const lineOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Month',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Amount ($)',
        },
      },
    },
  }

  const balanceOptions: ChartOptions<'line'> = {
    ...lineOptions,
    plugins: {
      ...lineOptions.plugins,
      tooltip: {
        callbacks: {
          label: (ctx) => `Balance: $${ctx.parsed.y.toFixed(2)}`,
        },
      },
    },
  }

  return {
    donutOptions,
    lineOptions,
    balanceOptions,
  }
}