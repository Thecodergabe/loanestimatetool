/**
 * @file composables/useMortgageCalculator.ts
 * @description Core mortgage calculation engine optimized for reactive updates.
 */
import { computed, type Ref } from 'vue'
import { type LoanModel, type AmortizationEntry } from '../models/loanModel.js'

export const useMortgageCalculator = (form: Ref<LoanModel>) => {
  const principal = computed(() => {
    const downPayment = form.value.downPayment || 0

    // Supports both percentage (0–100) and flat dollar amounts
    return downPayment <= 100
      ? form.value.purchasePrice * (1 - downPayment / 100)
      : form.value.purchasePrice - downPayment
  })

  const monthlyRate = computed(() => form.value.rate / 100 / 12)
  const numberOfPayments = computed(() => form.value.term * 12)

  /**
   * Standard principal & interest monthly payment formula.
   */
  const monthlyPayment = computed(() => {
    const p = principal.value
    const r = monthlyRate.value
    const n = numberOfPayments.value

    if (r === 0) return p / n
    return (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
  })

  /**
   * Generates the full amortization schedule for the loan term.
   */
  const amortizationSchedule = computed<AmortizationEntry[]>(() => {
    const schedule: AmortizationEntry[] = []
    let remainingBalance = principal.value
    const payment = monthlyPayment.value
    const r = monthlyRate.value

    for (let i = 1; i <= numberOfPayments.value; i++) {
      const interestPayment = remainingBalance * r
      const principalPayment = payment - interestPayment
      remainingBalance -= principalPayment

      schedule.push({
        month: i,
        principalPaid: Math.max(0, principalPayment),
        interest: Math.max(0, interestPayment),
        balance: Math.max(0, remainingBalance),
      })
    }

    return schedule
  })

  const totalMonthly = computed(() => {
    const taxes = (form.value.purchasePrice * (form.value.taxRate / 100)) / 12
    const insurance = (form.value.insurance || 0) / 12
    return monthlyPayment.value + taxes + insurance + (form.value.hoa || 0)
  })

  return {
    principal,
    monthlyPayment,
    totalMonthly,
    amortizationSchedule,
    monthlyRate,
    numberOfPayments,
  }
}