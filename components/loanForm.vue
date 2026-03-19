<template>
  <v-form>
    <div class="mb-6">
      <div class="d-flex align-center mb-4">
        <v-icon color="primary" class="me-2" size="22">mdi-home-analytics</v-icon>
        <h3 class="text-subtitle-1 font-weight-bold text-primary uppercase tracking-wider">
          Loan Basics
        </h3>
      </div>
      
      <v-row dense>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model.number="loan.purchasePrice"
            label="Purchase Price"
            prefix="$"
            variant="filled"
            hide-details="auto"
            persistent-placeholder
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model.number="loan.rate"
            label="Interest Rate"
            suffix="%"
            variant="filled"
            hide-details="auto"
            persistent-placeholder
          />
        </v-col>
        <v-col cols="12" sm="6" class="mt-2">
          <v-select
            v-model="loan.term"
            :items="[15, 20, 30]"
            label="Loan Term (years)"
            variant="filled"
            hide-details
          />
        </v-col>
        <v-col cols="12" sm="6" class="mt-2">
          <v-select
            v-model="loan.loanType"
            :items="['CONV', 'FHA', 'VA', 'USDA']"
            label="Loan Type"
            variant="filled"
            hide-details
          />
        </v-col>
        
        <v-col cols="12" class="mt-4">
          <div class="d-flex justify-space-between align-center mb-1">
            <label class="text-caption font-weight-bold">Down Payment (%)</label>
            <span class="text-caption text-medium-emphasis">
              Amount: {{ formatCurrency(loan.purchasePrice * (loan.downPayment / 100)) }}
            </span>
          </div>
          <div class="d-flex align-center">
            <v-slider
              v-model="loan.downPayment"
              min="0"
              max="100"
              step="1"
              color="primary"
              hide-details
              class="me-4"
            />
            <v-text-field
              v-model.number="loan.downPayment"
              suffix="%"
              variant="filled"
              density="compact"
              hide-details
              style="width: 80px"
            />
          </div>
        </v-col>
      </v-row>
    </div>

    <v-expansion-panels v-model="panelState" variant="accordion">
      
      <v-expansion-panel :value="0" elevation="0">
        <v-expansion-panel-title class="px-0 font-weight-bold text-primary">
          <v-icon start :color="zipDataFound ? 'success' : 'primary'">
            {{ zipDataFound ? 'mdi-map-marker-check' : 'mdi-map-marker' }}
          </v-icon>
          Location & Taxes
        </v-expansion-panel-title>
        
        <v-expansion-panel-text class="px-0">
          <v-row dense>
            <v-col cols="12">
              <v-menu
                v-model="showZipHelper"
                :activator="'.zip-input-field'"
                location="top center"
                offset="10"
                transition="slide-y-transition"
                :open-on-click="false"
                :close-on-content-click="false"
              >
                <v-card max-width="300" class="rounded-lg border-primary-thin pa-3 shadow-lg bg-surface">
                  <div class="d-flex align-center ga-2 mb-1">
                    <v-icon color="primary" size="18">mdi-information-outline</v-icon>
                    <span class="text-caption font-weight-black text-uppercase">Localization Active</span>
                  </div>
                  <p class="text-caption text-medium-emphasis">
                    Enter your 5-digit ZIP code to pull 2026 property tax rates and insurance averages for your neighborhood.
                  </p>
                </v-card>
              </v-menu>

              <v-text-field
                v-model="loan.zip"
                label="ZIP Code"
                prepend-inner-icon="mdi-map-marker"
                variant="filled"
                hide-details
                class="zip-input-field"
                @focus="showZipHelper = true"
                @blur="showZipHelper = false"
                @update:model-value="onZipInput"
              />
            </v-col>
            
            <v-col cols="12" class="mt-4">
              <div class="d-flex justify-space-between mb-1">
                <label class="text-caption font-weight-bold">Property Tax Rate</label>
                <span class="text-caption font-weight-bold text-primary">{{ loan.taxRate }}%</span>
              </div>
              <v-slider
                v-model="loan.taxRate"
                min="0"
                max="5"
                step="0.01"
                color="primary"
                hide-details
              />
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel :value="1" elevation="0">
        <v-expansion-panel-title class="px-0 font-weight-bold text-primary">
          <v-icon start color="primary">mdi-shield-home</v-icon>
          Insurance & Additional Costs
        </v-expansion-panel-title>
        
        <v-expansion-panel-text class="px-0">
          <v-row dense>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model.number="loan.insurance"
                label="Annual Insurance"
                prefix="$"
                variant="filled"
                hide-details
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model.number="loan.hoa"
                label="Monthly HOA"
                prefix="$"
                variant="filled"
                hide-details
              />
            </v-col>
            <v-col cols="12" class="pt-4">
              <v-switch
                v-model="loan.includePMI"
                label="Include PMI"
                color="primary"
                hide-details
                inset
              />
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-form>
</template>

<script setup lang="ts">
/**
 * @file components/loan-form.vue
 * @description Mortgage parameter input engine. Supports programmatic focus/expansion
 * for "Get Started" flows and localization triggers.
 * * @property {LoanModel} modelValue - Reactive loan configuration object.
 * @property {boolean} zipDataFound - Boolean flag indicating if external ZIP scraping was successful.
 * @property {number|null} activePanel - Controlled expansion panel index (0 for Location, 1 for Insurance).
 * * @emits update:modelValue - Syncs the loan data object.
 * @emits update:activePanel - Syncs the current expansion state.
 * @emits update:zip - Notifies parent to trigger localization logic on 5-digit entry.
 */
import { ref, computed } from 'vue';
import type { LoanModel } from '../models/loanModel.js';

const props = defineProps<{
  modelValue: LoanModel;
  zipDataFound: boolean;
  activePanel: number | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: LoanModel): void;
  (e: 'update:activePanel', value: number | null): void;
  (e: 'update:zip', zip: string): void;
}>();

const showZipHelper = ref(false);

/**
 * Proxy for parent modelValue to allow local v-model usage with auto-sync.
 */
const loan = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

/**
 * Synchronizes the expansion panel state with parent orchestration logic.
 */
const panelState = computed({
  get: () => props.activePanel,
  set: (val) => emit('update:activePanel', val)
});

/**
 * Evaluates ZIP input and emits update once character threshold is met.
 * Automatically closes helper tooltip on successful entry.
 */
const onZipInput = (val: string) => {
  if (val?.length === 5) {
    showZipHelper.value = false;
    emit('update:zip', val);
  }
};

/**
 * Utility: Standard USD currency formatter for template labels.
 */
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
};
</script>

<style scoped>
/* Reset Vuetify expansion padding for a "flush" professional look */
.v-expansion-panel-text :deep(.v-expansion-panel-text__wrapper) {
  padding: 16px 0;
}

.uppercase {
  text-transform: uppercase;
}

.tracking-wider {
  letter-spacing: 0.1em;
}

.border-primary-thin {
  border: 1px solid rgba(var(--v-theme-primary), 0.2) !important;
}

.shadow-lg {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1) !important;
}

/* Enhances the focus state of the primary action field */
.zip-input-field :deep(.v-field--focused) {
  border-color: rgb(var(--v-theme-primary)) !important;
}
</style>