<template>
  <v-form v-model="isValid"
          @submit.prevent="submitForm">
    <v-card class="d-flex flex-column gap-4"
            min-width="35vw">
      <v-card-title class="pa-4">Mortgage Calculator</v-card-title>

      <v-card-text>
        <!-- Purchase Price -->
        <div class="d-flex flex-column">
          <div class="d-flex align-center">
            <v-text-field v-model="props.modelValue.purchasePrice"
                          label="Purchase Price"
                          prefix="$"
                          type="number"
                          density="default"
                          variant="solo" />
          </div>
        </div>
        <PercentageSliderFeild v-model="props.modelValue.downPayment"
                               :min="0"
                               :max="100"
                               :step="1"
                               label="Down Payment (%}"
                               :display-result="`≈ ${formatCurrency(downPaymentAmount)}`" />

        <!-- Loan Term -->
        <div class="d-flex flex-column">
          <div class="d-flex align-center">
            <v-select v-model="props.modelValue.term"
                      :items="LOAN_TERMS"
                      label="Loan Term (years)"
                      type="number"
                      density="default"
                      variant="solo" />
          </div>
        </div>

        <!-- Interest Rate -->
        <div class="d-flex flex-column">
          <div class="d-flex align-center">
            <v-text-field v-model="props.modelValue.rate"
                          label="Interest Rate (%)"
                          suffix="%"
                          type="number"
                          variant="solo"
                          density="default" />
          </div>
        </div>

        <!-- ZIP Code -->
        <div class="d-flex flex-column">
          <div class="d-flex align-center">
            <v-text-field v-model="props.modelValue.zip"
                          label="ZIP Code"
                          maxlength="5"
                          variant="solo"
                          :persistent-hint="!props.modelValue.zip.length"
                          hint="Enter your zipcode to get localized estimates for insurance and tax rates"
                          density="default" />
          </div>
        </div>

        <!-- Loan Type -->
        <div class="d-flex flex-column">
          <div class="d-flex align-center">
            <v-select v-model="props.modelValue.loanType"
                      label="Loan Type"
                      :items="loanTypes"
                      density="default"
                      variant="solo" />
          </div>
        </div>

        <!-- Monthly HOA Dues -->
        <div class="d-flex flex-column">
          <div class="d-flex align-center">
            <v-text-field v-model="props.modelValue.hoa"
                          label="Monthly HOA Dues"
                          prefix="$"
                          type="number"
                          density="default"
                          variant="solo" />
          </div>
        </div>

        <!-- Points Paid -->
        <div class="d-flex flex-column">
          <div class="d-flex align-center">
            <v-text-field v-model="props.modelValue.points"
                          label="Points Paid"
                          suffix="pts"
                          type="number"
                          density="default"
                          variant="solo" />
          </div>
        </div>

        <!-- Include PMI -->
        <div class="d-flex flex-column">
          <div class="d-flex align-center">
            <v-switch v-model="props.modelValue.includePMI"
                      label="Include PMI"
                      color="primary"
                      density="compact" />
          </div>
        </div>

        <!-- Homeowners Insurance -->
        <div class="d-flex flex-column">
          <div class="d-flex align-center">
            <v-text-field v-model="props.modelValue.insurance"
                          label="Homeowners Insurance"
                          prefix="$"
                          type="number"
                          density="default"
                          variant="solo" />
          </div>
        </div>

        <!-- Property Tax Rate -->
        <div class="d-flex flex-column">
          <PercentageSliderFeild v-model="props.modelValue.taxRate"
                                 :min="0"
                                 :max="20"
                                 :step="1"
                                 :hint="zipDataFound ? 'Auto-filled from ZIP' : 'Enter your estimated premium'"
                                 label="Property Tax Rate (%)"
                                 :display-result="`${props.modelValue.taxRate}%`" />
        </div>

        <!-- Estimated Closing Costs -->
        <div class="d-flex flex-column">
          <PercentageSliderFeild v-model="props.modelValue.closingCosts"
                                 :min="0"
                                 :max="10"
                                 :step="1"
                                 label="Closing Costs (%)"
                                 :display-result="`${props.modelValue.closingCosts}%`" />
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
import { LoanType, type LoanModel } from '../models/loanModel'

const props = defineProps<{ modelValue: LoanModel, zipDataFound: boolean }>()
const emit = defineEmits(['update:modelValue', 'seeResults'])

const isValid = ref(false)

const loanTypes = Object.values(LoanType)
const LOAN_TERMS = [10, 15, 20, 25, 30, 40]
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