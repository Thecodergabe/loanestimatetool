<template>
  <v-card 
    elevation="0" 
    class="pa-4 pa-sm-6 rounded-xl border border-light fill-height d-flex flex-column"
  >
    <div class="d-flex align-center justify-space-between mb-4">
      <h3 class="text-h6 font-weight-black">Loan Visualization</h3>
      <div class="d-flex gap-x-2">
        <v-btn 
          icon="mdi-chart-donut" 
          :variant="activeChart === 'donut' ? 'flat' : 'tonal'" 
          :color="activeChart === 'donut' ? 'primary' : 'default'"
          size="small" 
          @click="activeChart = 'donut'"
        />
        <v-btn 
          icon="mdi-chart-timeline-variant" 
          :variant="activeChart === 'line' ? 'flat' : 'tonal'" 
          :color="activeChart === 'line' ? 'primary' : 'default'"
          size="small" 
          @click="activeChart = 'line'"
        />
      </div>
    </div>

    <div class="chart-wrapper mb-6 position-relative">
      <div v-if="activeChart === 'donut'" class="center-text">
        <div class="text-h5 text-sm-h4 font-weight-black">
          {{ formatCurrency(calc.totalMonthly.value) }}
        </div>
        <div class="text-caption font-weight-bold text-medium-emphasis uppercase">
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

    <v-divider class="mb-4" />

    <v-row no-gutters class="text-start mb-6">
      <v-col cols="6" class="pa-2 border-right border-bottom">
        <div class="text-caption text-medium-emphasis font-weight-bold">Monthly P&I</div>
        <div class="text-subtitle-1 font-weight-black text-primary">
          {{ formatCurrency(calc.monthlyPayment.value) }}
        </div>
      </v-col>
      <v-col cols="6" class="pa-2 border-bottom">
        <div class="text-caption text-medium-emphasis font-weight-bold">Total Principal</div>
        <div class="text-subtitle-1 font-weight-black text-grey-darken-3">
          {{ formatCurrency(calc.principal.value) }}
        </div>
      </v-col>
      <v-col cols="6" class="pa-2 border-right">
        <div class="text-caption text-medium-emphasis font-weight-bold">Total Interest</div>
        <div class="text-subtitle-1 font-weight-black text-error">
          {{ formatCurrency(totalInterest) }}
        </div>
      </v-col>
      <v-col cols="6" class="pa-2">
        <div class="text-caption text-medium-emphasis font-weight-bold">Total Loan Cost</div>
        <div class="text-subtitle-1 font-weight-black text-grey-darken-3">
          {{ formatCurrency(totalLoanCost) }}
        </div>
      </v-col>
    </v-row>

    <div class="mt-auto">
      <v-select
        v-model="exportFormat"
        :items="['CSV', 'PDF', 'XLSX']"
        label="Export Format"
        variant="outlined"
        density="compact"
        rounded="lg"
        hide-details
        class="mb-3"
      />
      <v-btn
        color="primary"
        block
        class="text-none font-weight-bold download-btn"
        rounded="lg"
        elevation="0"
        @click="handleDownload"
      >
        Download Amortization Schedule
      </v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
/**
 * @file components/loanResultsChart.vue
 * @description Orchestrates visualization, view switching, and PDF export.
 * Powered by useMortgageCalculator for real-time mathematical reactivity.
 */
import { ref, computed } from 'vue';
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
} from 'chart.js';
import { Doughnut, Line } from 'vue-chartjs';
import type { LoanModel } from '../models/loanModel.js';
import { useMortgageCalculator } from '../composables/useMortgageCalculator.js';
import { useAmortizationPDF } from '../composables/useAmortizationPDF.js';

// Register all required Chart.js components for both Donut and Line views
ChartJS.register(
  ArcElement, Tooltip, Legend, CategoryScale, 
  LinearScale, PointElement, LineElement, Filler
);

const props = defineProps<{ form: LoanModel }>();
const exportFormat = ref('PDF');
const activeChart = ref<'donut' | 'line'>('donut');

// Initialize Calculator with reactive form binding
const calc = useMortgageCalculator(computed(() => props.form));
const { downloadAmortizationPDF } = useAmortizationPDF();

/**
 * Total interest derived from the sum of all monthly interest payments.
 */
const totalInterest = computed(() => 
  calc.amortizationSchedule.value.reduce((sum, month) => sum + month.interest, 0)
);

/**
 * Total financial obligation (Principal + Total Interest).
 */
const totalLoanCost = computed(() => 
  calc.principal.value + totalInterest.value
);

/**
 * Doughnut Data: Breakdown of monthly payment components.
 */
const donutData = computed(() => {
  const pAndI = calc.monthlyPayment.value;
  const taxes = (props.form.purchasePrice * (props.form.taxRate / 100)) / 12;
  const insurance = (props.form.insurance || 0) / 12;
  const hoa = props.form.hoa || 0;
  const pmi = (props.form.includePMI && props.form.downPayment < 20) 
    ? (calc.principal.value * 0.005) / 12 
    : 0;

  return {
    labels: ['P&I', 'Taxes', 'Insurance', 'HOA', 'PMI'],
    datasets: [{
      data: [pAndI, taxes, insurance, hoa, pmi],
      backgroundColor: ['#1E88E5', '#43A047', '#FB8C00', '#9C27B0', '#E53935'],
      cutout: '80%',
      borderWidth: 0
    }]
  };
});

/**
 * Line Data: Visualizes balance reduction over the loan term.
 */
const lineData = computed(() => {
  const yearlyData = calc.amortizationSchedule.value.filter((_, i) => i % 12 === 0);
  return {
    labels: yearlyData.map(m => `Yr ${m.month / 12}`),
    datasets: [{
      label: 'Remaining Balance',
      data: yearlyData.map(m => m.balance),
      borderColor: '#1E88E5',
      backgroundColor: 'rgba(30, 136, 229, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };
});

const donutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } }
};

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: { beginAtZero: true, ticks: { callback: (val: any) => '$' + val.toLocaleString() } }
  },
  plugins: { legend: { display: false } }
};

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0
  }).format(val);
};

/**
 * Triggers the amortization PDF generation logic.
 */
const handleDownload = () => {
  if (exportFormat.value === 'PDF') {
    downloadAmortizationPDF(calc.amortizationSchedule.value, props.form.zip);
  } else {
    console.warn(`${exportFormat.value} export not implemented`);
  }
};
</script>

<style scoped>
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
.border-right { border-right: 1px solid rgba(0, 0, 0, 0.08); }
.border-bottom { border-bottom: 1px solid rgba(0, 0, 0, 0.08); }
.download-btn { height: 48px !important; }
.uppercase { text-transform: uppercase; letter-spacing: 0.05em; }
.border-light { border: 1px solid rgba(0, 0, 0, 0.05) !important; }
</style>