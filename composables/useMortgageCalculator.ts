import { computed } from 'vue'
import type { Ref } from 'vue'
import type { LoanModel } from '../models/loanModel.js'

export const useMortgageCalculator = (form: Ref<LoanModel>) => {
  const principal = computed(() =>
    form.value.purchasePrice * (1 - form.value.downPayment / 100),
  )

  const effectiveRate = computed(() =>
    Math.max(form.value.rate - form.value.points * 0.25, 0),
  )

  const monthlyRate = computed(() => effectiveRate.value / 100 / 12)

  const monthlyPayment = computed(() => {
    const months = form.value.term * 12
    const r = monthlyRate.value
    return r > 0
      ? (principal.value * r) / (1 - Math.pow(1 + r, -months))
      : principal.value / months
  })

  const pmi = computed(() =>
    form.value.includePMI ? (0.005 * principal.value) / 12 : 0,
  )

  const taxes = computed(() =>
    (form.value.taxRate / 100) * form.value.purchasePrice / 12,
  )

  const insurance = computed(() => form.value.insurance / 12)

  const hoa = computed(() => form.value.hoa)

  const totalMonthly = computed(() =>
    monthlyPayment.value + taxes.value + insurance.value + pmi.value + hoa.value,
  )

  const closingCosts = computed(() =>
    (form.value.closingCosts / 100) * form.value.purchasePrice,
  )

  const upfrontCost = computed(() =>
    (form.value.downPayment / 100) * form.value.purchasePrice + closingCosts.value,
  )

  return {
    principal,
    effectiveRate,
    monthlyRate,
    monthlyPayment,
    taxes,
    insurance,
    hoa,
    pmi,
    closingCosts,
    totalMonthly,
    upfrontCost,
  }
}
