// plugins/chartjs.ts
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale } from 'chart.js'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(() => {
  ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
  )
})
