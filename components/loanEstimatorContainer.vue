<template>
  <v-container id="calculator-top" fluid class="pa-4 pa-sm-8 pa-md-12 landing-wrapper">
    
    <!-- Hero Header -->
    <v-row justify="center" class="mb-6 mb-md-12">
      <v-col cols="12" sm="10" md="8" class="text-center">
        <v-chip
          :color="zipDataFound ? 'success' : 'primary'"
          variant="tonal"
          size="small"
          class="mb-4 font-weight-bold"
          :class="{ 'pulse-success': zipDataFound }"
          rounded="lg"
        >
          <v-icon start :icon="zipDataFound ? 'mdi-check-decagram' : 'mdi-shield-search'" />
          {{ zipDataFound ? 'Verified Localized Estimates' : 'Waiting for ZIP Code' }}
        </v-chip>
        
        <h1 class="text-h4 text-sm-h3 text-md-h2 font-weight-black mb-4 tracking-tighter">
          Mortgage Planning <span class="text-primary">Redefined</span>
        </h1>
        
        <p class="text-body-1 text-sm-h6 text-medium-emphasis px-2">
          Enter your details below to see localized estimates for taxes, insurance, and monthly payments.
        </p>
      </v-col>
    </v-row>

    <!-- App Content -->
    <v-row class="mt-2 mt-md-6" justify="center">
      
      <!-- Inputs Column -->
      <v-col cols="12" lg="6" xl="5" class="order-inputs">
        <v-card 
          variant="flat" 
          class="rounded-xl pa-5 pa-sm-8 border-light shadow-sm bg-card"
        >
          <div class="mb-8">
            <h2 class="text-h5 font-weight-black">Loan Customization</h2>
            <p class="text-body-2 text-medium-emphasis mt-1">
              Adjust the parameters below to calculate your estimated monthly obligation.
            </p>
            <v-divider class="mt-4" />
          </div>

          <loan-form 
            v-model="loanData" 
            v-model:active-panel="activePanel"
            :zip-data-found="zipDataFound"
            @update:zip="handleZipChange" 
          />
        </v-card>
      </v-col>

      <!-- Visualization Column -->
      <v-col cols="12" lg="5" xl="4" class="order-results mb-6 mb-lg-0">
        <div class="sticky-results-wrapper">
          <loan-results-chart :form="loanData" />
        </div>
      </v-col>

    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { LoanType, type LoanModel } from '../models/loanModel.js';

const emit = defineEmits(['update:monthly-total']);

const activePanel = ref<number | null>(null);
const zipDataFound = ref(false);

const loanData = ref<LoanModel>({
  purchasePrice: 450000,
  downPayment: 20,
  term: 30,
  rate: 6.5,
  zip: "",
  loanType: LoanType.CONV,
  hoa: 100,
  points: 0,
  includePMI: false,
  taxRate: 1.2,
  insurance: 1200,
  closingCosts: 3,
});

/**
 * MORTGAGE MATH ENGINE
 * Calculates the monthly PITI (Principal, Interest, Taxes, Insurance)
 */
const monthlyPayment = computed(() => {
  const p = loanData.value.purchasePrice * (1 - loanData.value.downPayment / 100);
  const r = (loanData.value.rate / 100) / 12;
  const n = loanData.value.term * 12;
  
  // Principal & Interest Formula: P [ r(1 + r)^n ] / [ (1 + r)^n – 1 ]
  const pi = p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  
  // Taxes & Insurance
  const monthlyTaxes = (loanData.value.purchasePrice * (loanData.value.taxRate / 100)) / 12;
  const monthlyInsurance = loanData.value.insurance / 12;
  const monthlyHOA = loanData.value.hoa;

  return Math.round(pi + monthlyTaxes + monthlyInsurance + monthlyHOA);
});

/**
 * Sync with global app state for the Mobile Result Bar
 */
watch(monthlyPayment, (newVal) => {
  emit('update:monthly-total', newVal);
}, { immediate: true });

defineExpose({
  triggerZipFocus: () => {
    const el = document.getElementById('calculator-top');
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    activePanel.value = 0;
    setTimeout(() => {
      const input = document.querySelector('.zip-input-field input') as HTMLElement;
      input?.focus();
    }, 500);
  }
});

const handleZipChange = (zip: string) => {
  if (zip.length === 5) {
    zipDataFound.value = true;
  } else {
    zipDataFound.value = false;
  }
};
</script>

<style scoped>
/* Styles remain same as your previous version */
.landing-wrapper {
  background: radial-gradient(circle at top right, rgba(var(--v-theme-primary), 0.05), transparent),
              radial-gradient(circle at bottom left, rgba(var(--v-theme-primary), 0.03), transparent);
  min-height: 100vh;
}
.bg-card {
  background-color: rgba(var(--v-theme-surface), 0.7) !important;
  backdrop-filter: blur(10px);
}
.tracking-tighter {
  letter-spacing: -0.05em !important;
  line-height: 1.1;
}
.border-light {
  border: 1px solid rgba(var(--v-border-color), 0.1) !important;
}
.shadow-sm {
  box-shadow: 0 10px 40px -20px rgba(0, 0, 0, 0.1) !important;
}
.pulse-success {
  animation: pulse-animation 2s infinite;
}
@keyframes pulse-animation {
  0% { box-shadow: 0 0 0 0px rgba(var(--v-theme-success), 0.4); }
  100% { box-shadow: 0 0 0 10px rgba(var(--v-theme-success), 0); }
}
@media (max-width: 1279px) {
  .order-inputs { order: 1 !important; }
  .order-results { order: 2 !important; }
}
@media (min-width: 1280px) {
  .sticky-results-wrapper {
    position: sticky;
    top: 100px;
  }
  .order-inputs { order: 1; }
  .order-results { order: 2; }
}
</style>