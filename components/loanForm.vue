<template>
  <v-form v-model="isValid" @submit.prevent="submitForm">
    <v-card class="d-flex flex-column gap-4"
            :width="mobile ? '100vw' : '35vw'"
            max-width="800px">
      <v-card-title class="pa-4">Mortgage Calculator</v-card-title>

      <v-card-text>
        <!-- Purchase Price -->
        <div class="d-flex flex-column">
          <div class="d-flex align-center">
            <v-text-field
              v-model="props.modelValue.purchasePrice"
              label="Purchase Price"
              prefix="$"
              type="number"
              density="default"
            />
          </div>
        </div>
        <PercentageSliderFeild v-model="props.modelValue.downPayment" :min="0" :max="100"/>
        <div class="text-caption text-medium-emphasis mt-n4 mb-2 ms-1">
          ≈ {{ formatCurrency(downPaymentAmount) }}
        </div>

        <!-- Loan Term -->
        <div class="d-flex flex-column">
          <div class="d-flex align-center">
            <v-text-field
              v-model="props.modelValue.term"
              label="Loan Term (years)"
              type="number"
              density="default"
            />
          </div>
        </div>

        <!-- Interest Rate -->
        <div class="d-flex flex-column">
          <div class="d-flex align-center">
            <v-text-field
              v-model="props.modelValue.rate"
              label="Interest Rate (%)"
              suffix="%"
              type="number"
              density="default"
            />
          </div>
        </div>

        <!-- ZIP Code -->
        <div class="d-flex flex-column">
          <div class="d-flex align-center">
            <v-text-field
              v-model="props.modelValue.zip"
              label="ZIP Code"
              maxlength="5"
              density="default"
            />
          </div>
        </div>

        <!-- Loan Type -->
        <div class="d-flex flex-column">
          <div class="d-flex align-center">
            <v-select
              v-model="props.modelValue.loanType"
              label="Loan Type"
              :items="loanTypes"
              density="default"
            />
          </div>
        </div>

        <!-- Monthly HOA Dues -->
        <div class="d-flex flex-column">
          <div class="d-flex align-center">
            <v-text-field
              v-model="props.modelValue.hoa"
              label="Monthly HOA Dues"
              prefix="$"
              type="number"
              density="default"
            />
          </div>
        </div>

        <!-- Points Paid -->
        <div class="d-flex flex-column">
          <div class="d-flex align-center">
            <v-text-field
              v-model="props.modelValue.points"
              label="Points Paid"
              suffix="pts"
              type="number"
              density="default"
            />
          </div>
        </div>

        <!-- Include PMI -->
        <div class="d-flex flex-column">
          <div class="d-flex align-center">
            <v-switch
              v-model="props.modelValue.includePMI"
              label="Include PMI"
              color="primary"
            />
          </div>
        </div>

        <!-- Property Tax Rate -->
        <div class="d-flex flex-column">
          <div class="d-flex align-center">
            <v-text-field
              v-model="props.modelValue.taxRate"
              label="Property Tax Rate"
              suffix="%"
              type="number"
              density="default"
            />
          </div>
        </div>

        <!-- Homeowners Insurance -->
        <div class="d-flex flex-column">
          <div class="d-flex align-center">
            <v-text-field
              v-model="props.modelValue.insurance"
              label="Homeowners Insurance"
              prefix="$"
              type="number"
              density="default"
            />
          </div>
        </div>

        <!-- Estimated Closing Costs -->
        <div class="d-flex flex-column">
          <div class="d-flex align-center">
            <v-text-field
              v-model="props.modelValue.closingCosts"
              label="Estimated Closing Costs (%)"
              suffix="%"
              type="number"
              density="default"
            />
          </div>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-btn type="submit"
               variant="elevated"
               color="primary"
               block>
          See Estimate
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDisplay } from 'vuetify'
import { LoanType, type LoanModel } from '~/models/loanModel'

const { mobile } = useDisplay()
const props = defineProps<{ modelValue: LoanModel }>()
const emit = defineEmits(['update:modelValue', 'seeResults'])

const isValid = ref(false)

const loanTypes = Object.values(LoanType)

const downPaymentAmount = computed(() => {
  return (props.modelValue.purchasePrice * props.modelValue.downPayment) / 100
})

const formatCurrency = (value: number): string =>
  value.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

const submitForm = () => {
  emit('seeResults')
}
</script>