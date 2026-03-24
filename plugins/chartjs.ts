import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
} from 'chart.js'
import { defineNuxtPlugin } from 'nuxt/app'

/**
 * Registers the Chart.js components needed across the app.
 * Loaded once via Nuxt plugin initialization.
 */
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