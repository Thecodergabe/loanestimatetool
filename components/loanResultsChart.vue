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
      <v-select
        v-model="exportFormat"
        :items="['CSV', 'PDF', 'XLSX']"
        label="Export Format"
        variant="outlined"
        density="compact"
        rounded="lg"
        hide-details
        class="mb-3 custom-select"
      />
      <v-btn
        color="primary"
        block
        size="large"
        class="text-none font-weight-bold download-btn"
        rounded="lg"
        elevation="4"
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
 * @description Interactive visualization component supporting donut/line views.
 * Restored: useMortgageCalculator reactivity and Intl constructor fix.
 */
import { ref, computed } from 'vue';
import { useTheme } from 'vuetify';
import { 
  Chart as ChartJS, ArcElement, Tooltip, Legend, 
  CategoryScale, LinearScale, PointElement, LineElement, Filler 
} from 'chart.js';
import { Doughnut, Line } from 'vue-chartjs';
import type { LoanModel } from '../models/loanModel.js';
import { useMortgageCalculator } from '../composables/useMortgageCalculator.js';
import { useAmortizationPDF } from '../composables/useAmortizationPDF.js';

ChartJS.register(
  ArcElement, Tooltip, Legend, CategoryScale, 
  LinearScale, PointElement, LineElement, Filler
);

const props = defineProps<{ form: LoanModel }>();
const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);

const exportFormat = ref('PDF');
const activeChart = ref<'donut' | 'line'>('donut');

const calc = useMortgageCalculator(computed(() => props.form));
const { downloadAmortizationPDF } = useAmortizationPDF();

/**
 * Contrast Utility Classes for 2026 aesthetics
 */
const labelClass = computed(() => 
  isDark.value ? 'text-slate-400 font-weight-bold text-caption' : 'text-slate-500 font-weight-bold text-caption'
);
const valueClass = computed(() => 
  isDark.value ? 'text-slate-100 text-subtitle-1 font-weight-black' : 'text-slate-900 text-subtitle-1 font-weight-black'
);
const mainValueClass = computed(() => 
  isDark.value ? 'text-white' : 'text-slate-900'
);

const totalInterest = computed(() => 
  calc.amortizationSchedule.value.reduce((sum, month) => sum + month.interest, 0)
);

const totalLoanCost = computed(() => 
  calc.principal.value + totalInterest.value
);

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
    y: { 
      beginAtZero: true, 
      grid: { color: () => isDark.value ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
      ticks: { 
        color: () => isDark.value ? '#94A3B8' : '#64748B',
        callback: (val: any) => '$' + val.toLocaleString() 
      } 
    },
    x: {
      grid: { display: false },
      ticks: { color: () => isDark.value ? '#94A3B8' : '#64748B' }
    }
  },
  plugins: { legend: { display: false } }
};

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0
  }).format(val);
};

const handleDownload = () => {
  if (exportFormat.value === 'PDF') {
    downloadAmortizationPDF(calc.amortizationSchedule.value, props.form.zip);
  }
};
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

.download-btn { height: 48px !important; }

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