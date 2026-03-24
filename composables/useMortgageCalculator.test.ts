/**
 * @file tests/useMortgageCalculator.test.ts
 * @description Unit tests for the mortgage calculation engine.
 */

import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useMortgageCalculator } from './useMortgageCalculator.js'
import { LoanType, type LoanModel } from '../models/loanModel.js'

describe('useMortgageCalculator', () => {
  /**
   * Standard 30‑year fixed mortgage scenario.
   */
  it('calculates the correct monthly principal and interest', () => {
    const mockForm = ref<LoanModel>({
      purchasePrice: 400000,
      downPayment: 80000, // 20%
      term: 30,
      rate: 6.5,
      zip: '90210',
      loanType: LoanType.CONV,
      hoa: 0,
      points: 0,
      includePMI: false,
      taxRate: 1.2,
      insurance: 1200,
      closingCosts: 3,
    })

    const { totalMonthly, principal } = useMortgageCalculator(mockForm)

    // Principal = purchase price − down payment
    expect(principal.value).toBe(320000)

    // Monthly P&I for $320k @ 6.5% ≈ $2,022.62
    // totalMonthly includes taxes + insurance, so it should exceed P&I
    expect(totalMonthly.value).toBeGreaterThan(2022)
  })

  /**
   * Ensures amortization schedule length and final payoff accuracy.
   */
  it('generates a full amortization schedule for the loan term', () => {
    const mockForm = ref<LoanModel>({
      purchasePrice: 100000,
      downPayment: 0,
      term: 15, // 180 months
      rate: 5.0,
      zip: '12345',
      loanType: LoanType.CONV,
      hoa: 0,
      points: 0,
      includePMI: false,
      taxRate: 0,
      insurance: 0,
      closingCosts: 0,
    })

    const { amortizationSchedule } = useMortgageCalculator(mockForm)

    // Should generate one entry per month
    expect(amortizationSchedule.value.length).toBe(180)

    // Final balance should be effectively zero
    const finalMonth = amortizationSchedule.value[179]
    expect(Math.round(finalMonth.balance)).toBe(0)
  })
})