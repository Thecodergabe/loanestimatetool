<template>
  <v-form v-model="isValid"
          @submit.prevent="submitForm"
          role="form"
          aria-labelledby="formTitle">
    <v-card class="d-flex flex-column"
            min-width="35vw">
      <v-card-title id="formTitle"
                    class="pa-4">
        Mortgage Calculator
      </v-card-title>

      <v-card-text class="d-flex flex-column">
        <!-- Section: Loan Basics -->
        <div class="text-subtitle-1 font-weight-medium"
             id="loanBasics">Loan Basics</div>

        <div class="d-flex flex-wrap flex-column flex-lg-row form-pair"
             role="group"
             aria-labelledby="loanBasics">
          <v-text-field v-model="loan.purchasePrice"
                        label="Purchase Price"
                        prefix="$"
                        type="number"
                        class="flex-grow-1"
                        hide-details="auto"
                        aria-label="House purchase price"
                        density="default"
                        variant="filled"
                        autocomplete="off" />

          <v-select v-model="loan.term"
                    :items="LOAN_TERMS"
                    label="Loan Term (years)"
                    type="number"
                    hide-details="auto"
                    aria-label="Loan term in years"
                    density="default"
                    variant="filled"
                    autocomplete="off" />
        </div>

        <div role="group"
             aria-labelledby="downPaymentLabel"
             class="px-2">
          <div id="downPaymentLabel"
               class="text-caption text-medium-emphasis">Down Payment (%)</div>
          <percentageSliderField v-model="loan.downPayment"
                                 inputId="down_payment"
                                 label="Down Payment (%)"
                                 :min="0"
                                 :max="100"
                                 :step="1"
                                 :aria-label="'Slider to manage loan downpayment in percentage'"
                                 :caption="`(Estimated down payment amount: ≈ ${formatCurrency(downPaymentAmount)})`" />
        </div>

        <!-- Section: Rate & Type -->
        <div class="text-subtitle-1 font-weight-medium"
             id="rateType">Rate & Type</div>

        <div class="d-flex flex-wrap flex-column flex-lg-row form-pair"
             role="group"
             aria-labelledby="rateType">
          <v-text-field v-model="loan.rate"
                        label="Interest Rate (%)"
                        suffix="%"
                        type="number"
                        variant="filled"
                        hide-details="auto"
                        density="default"
                        aria-label="Interest rate percentage"
                        autocomplete="off" />

          <v-select v-model="loan.loanType"
                    label="Loan Type"
                    :items="loanTypes"
                    density="default"
                    hide-details="auto"
                    variant="filled"
                    aria-label="House purchase loan type"
                    autocomplete="off" />
        </div>

        <!-- Section: Location & Fees -->
        <div class="text-subtitle-1 font-weight-medium"
             id="locationFees">Location & Fees</div>
        <span v-if="!loan.zip.length"
              id="zipHint"
              class="text-caption text-medium-emphasis mt-n2">
          (Enter your zipcode to get localized estimates)
        </span>

        <div class="d-flex flex-wrap flex-column flex-lg-row form-pair"
             role="group"
             aria-labelledby="locationFees">
          <v-text-field v-model="loan.zip"
                        label="ZIP Code"
                        maxlength="5"
                        hide-details="auto"
                        variant="filled"
                        autocomplete="postal-code"
                        density="default"
                        aria-describedby="zipHint" />

          <v-text-field v-model="loan.hoa"
                        label="Monthly HOA Dues"
                        prefix="$"
                        type="number"
                        class="flex-grow-1"
                        hide-details="auto"
                        density="default"
                        aria-label="Monthly hoa dues"
                        variant="filled"
                        autocomplete="off" />
        </div>

        <div role="group"
             aria-labelledby="taxRateLabel"
             class="px-2">
          <div id="taxRateLabel"
               class="text-caption text-medium-emphasis">Property Tax Rate (%)</div>
          <percentageSliderField v-model="loan.taxRate"
                                 inputId="property_tax_rate"
                                 :min="0"
                                 :max="20"
                                 :step=".1"
                                 label="Property Tax Rate (%)"
                                 :aria-label="'Slider to manage loan tax rate in percentage'"
                                 :hint="zipDataFound ? 'Auto-filled from ZIP' : 'Enter your estimated premium'" />
        </div>

        <!-- Section: Insurance & PMI -->
        <div class="text-subtitle-1 font-weight-medium"
             id="insurancePMI">Insurance & PMI</div>

        <div class="d-flex flex-wrap flex-column flex-lg-row form-pair align-center"
             role="group"
             aria-labelledby="insurancePMI">
          <v-text-field v-model="loan.insurance"
                        label="Homeowners Insurance"
                        prefix="$"
                        type="number"
                        hide-details="auto"
                        density="default"
                        aria-label="Home owners insurance coste"
                        variant="filled"
                        autocomplete="off" />

          <v-switch v-model="loan.includePMI"
                    label="Include Private Mortgage Insurance"
                    color="primary"
                    density="compact"
                    hide-details="auto"
                    aria-label="Private mortgaga insurance"
                    class="mt-4 mx-auto" />
        </div>

        <!-- Section: Additional Costs -->
        <div class="text-subtitle-1 font-weight-medium"
             id="additionalCosts">Additional Costs</div>

        <v-text-field v-model="loan.points"
                      label="Points Paid"
                      suffix="pts"
                      type="number"
                      hide-details="auto"
                      density="default"
                      aria-label="Points paid"
                      variant="filled"
                      autocomplete="off" />

        <div role="group"
             aria-labelledby="closingCostsLabel"
             class="px-2">
          <div id="closingCostsLabel"
               class="text-caption text-medium-emphasis">Closing Costs (%)</div>
          <percentageSliderField v-model="loan.closingCosts"
                                 inputId="closing_costs"
                                 :min="0"
                                 :max="10"
                                 :step="1"
                                 :aria-label="'Slider to manage loan closing cost in percentage'"
                                 label="Closing Costs (%)" />
        </div>
      </v-card-text>
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
<style scoped>
.form-pair>* {
  flex-grow: 1;
  flex-basis: 0;
  width: 100%;
  gap: 8px;
}

/* Full width on small screens */
@media screen and (max-width: 768px) {
  .form-pair>* {
    max-width: 100%;
  }
}
</style>
