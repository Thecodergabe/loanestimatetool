<template>
  <v-form v-model="isValid"
          @submit.prevent="submitForm">
    <v-card class="d-flex flex-column gap-4">
      <v-card-title class="pa-4">Mortgage Calculator</v-card-title>
      <v-card-text>

        <!-- 🔷 Core Fields -->
        <div v-for="field in coreFields"
             :key="field.key"
             class="d-flex align-center gap-2">
          <component
                    v-model="form[field.key]" 
                    :is="getFieldRenderConfig(field).component"
                     v-bind="getFieldRenderConfig(field).props" />
          <v-tooltip v-if="field.tooltip"
                     location="top">
            <template #activator="{ props }">
              <v-icon v-bind="props"
                      class="ms-1 mb-4"
                      size="20"
                      color="primary">
                mdi-help-circle-outline
              </v-icon>
            </template>
            <span>{{ field.tooltip }}</span>
          </v-tooltip>
        </div>

        <!-- Advanced Toggle -->
        <v-divider class="my-4" />
        <v-btn variant="text"
               color="primary"
               class="text-caption font-weight-medium"
               @click="showAdvanced = !showAdvanced">
          <v-icon class="me-2"
                  size="18"
                  :class="{ 'rotate-180': showAdvanced }"
                  transition="rotate-transition">
            mdi-chevron-down
          </v-icon>
          {{ showAdvanced ? 'Hide' : 'Show' }} Advanced Fields
        </v-btn>

        <!-- 🧩 Advanced Fields -->
        <v-expand-transition>
          <div v-if="showAdvanced"
               class="d-flex flex-column gap-4 mt-4">
            <div v-for="field in advancedFields"
                 :key="field.key"
                 class="d-flex align-center gap-2">
              <component :is="getFieldRenderConfig(field).component"
                          v-model="form[field.key]"
                         v-bind="getFieldRenderConfig(field).props" />
              <v-tooltip v-if="field.tooltip"
                         location="top">
                <template #activator="{ props }">
                  <v-icon v-bind="props"
                          class="ms-1 mb-4"
                          size="20"
                          color="primary">
                    mdi-help-circle-outline
                  </v-icon>
                </template>
                <span>{{ field.tooltip }}</span>
              </v-tooltip>
            </div>
          </div>
        </v-expand-transition>

      </v-card-text>
      <v-card-actions>
        <v-btn type="submit"
               variant="elevated"
               color="primary"
               block>
          Calculate Estimate
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { type LoanModel, LoanType } from '~/models/loanModel'
import { useLoanFormSchemas } from '~/composables/useLoanFormSchemas'
import { getFieldRenderConfig } from '~/utilities/renderField'
const { coreFields, advancedFields } = useLoanFormSchemas()

const isValid = ref(false)

const form = ref<LoanModel>({
  purchasePrice: 350000,
  downPayment: 20,           // percent
  term: 30,                  // years
  rate: 6.5,                 // APR %
  zip: '97229',
  loanType: LoanType.Conventional,

  // Optional (but prepopulated for valid submission)
  hoa: 0,
  points: 0,
  includePMI: false,
  taxRate: 1.2,              // Percent (e.g. 1.2%)
  insurance: 1200,           // Annual $
  closingCosts: 3            // Percent of purchasePrice
})
const showAdvanced = ref(false)

const submitForm = () => {
  console.log('Submitted:', form.value)
  // Placeholder: emit to parent or navigate to results
}
</script>