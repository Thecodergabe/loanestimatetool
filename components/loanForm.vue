<template>
  <v-form
    v-model="isValid"
    @submit.prevent="submitForm"
  >
    <v-card
      class="d-flex flex-column gap-4"
      min-width="35vw"
    >
      <v-card-title class="pa-4">
        Mortgage Calculator
      </v-card-title>

      <v-card-text>
        <!-- Purchase Price -->
        <v-text-field
          v-model="loan.purchasePrice"
          label="Purchase Price"
          prefix="$"
          type="number"
          density="default"
          variant="solo"
        />

        <!-- Down Payment -->
        <PercentageSliderFeild
          v-model="loan.downPayment"
          :min="0"
          :max="100"
          :step="1"
          label="Down Payment (%)"
          :display-result="`≈ ${formatCurrency(downPaymentAmount)}`"
        />

        <!-- Loan Term -->
        <v-select
          v-model="loan.term"
          :items="LOAN_TERMS"
          label="Loan Term (years)"
          type="number"
          density="default"
          variant="solo"
        />

        <!-- Interest Rate -->
        <v-text-field
          v-model="loan.rate"
          label="Interest Rate (%)"
          suffix="%"
          type="number"
          variant="solo"
          density="default"
        />

        <!-- ZIP Code -->
        <v-text-field
          v-model="loan.zip"
          label="ZIP Code"
          maxlength="5"
          variant="solo"
          :persistent-hint="!loan.zip.length"
          hint="Enter your zipcode to get localized estimates for insurance and tax rates"
          density="default"
        />

        <!-- Loan Type -->
        <v-select
          v-model="loan.loanType"
          label="Loan Type"
          :items="loanTypes"
          density="default"
          variant="solo"
        />

        <!-- Monthly HOA Dues -->
        <v-text-field
          v-model="loan.hoa"
          label="Monthly HOA Dues"
          prefix="$"
          type="number"
          density="default"
          variant="solo"
        />

        <!-- Points Paid -->
        <v-text-field
          v-model="loan.points"
          label="Points Paid"
          suffix="pts"
          type="number"
          density="default"
          variant="solo"
        />

        <!-- Include PMI -->
        <v-switch
          v-model="loan.includePMI"
          label="Include PMI"
          color="primary"
          density="compact"
        />

        <!-- Homeowners Insurance -->
        <v-text-field
          v-model="loan.insurance"
          label="Homeowners Insurance"
          prefix="$"
          type="number"
          density="default"
          variant="solo"
        />

        <!-- Property Tax Rate -->
        <PercentageSliderFeild
          v-model="loan.taxRate"
          :min="0"
          :max="20"
          :step="1"
          :hint="zipDataFound ? 'Auto-filled from ZIP' : 'Enter your estimated premium'"
          label="Property Tax Rate (%)"
          :display-result="`${loan.taxRate}%`"
        />

        <!-- Estimated Closing Costs -->
        <PercentageSliderFeild
          v-model="loan.closingCosts"
          :min="0"
          :max="10"
          :step="1"
          label="Closing Costs (%)"
          :display-result="`${loan.closingCosts}%`"
        />
      </v-card-text>

      <v-card-actions>
        <v-btn
          type="submit"
          variant="elevated"
          color="primary"
          block
        >
          See Estimate
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { LoanType } from '../models/loanModel'
import type { LoanModel } from '../models/loanModel'

const props = defineProps<{ modelValue: LoanModel, zipDataFound: boolean }>()
const emit = defineEmits(['update:modelValue', 'seeResults'])

const isValid = ref(false)

const loan = computed({
  get: () => props.modelValue,
  set: (val: LoanModel) => emit('update:modelValue', val),
})

const loanTypes = Object.values(LoanType)
const LOAN_TERMS = [10, 15, 20, 25, 30, 40]

const downPaymentAmount = computed(() => {
  return (loan.value.purchasePrice * loan.value.downPayment) / 100
})

const formatCurrency = (value: number): string =>
  value.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

const submitForm = () => {
  emit('seeResults')
}
</script>
