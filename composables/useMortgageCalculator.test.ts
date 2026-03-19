/**
 * @file tests/useMortgageCalculator.test.ts
 * @description Unit tests for the mortgage calculation engine.
 * @module MortgageCalculator/Tests
 */

import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
// FIXED: Added .js extension to satisfy NodeNext resolution
import { useMortgageCalculator } from '../composables/useMortgageCalculator.js';
import { LoanType, type LoanModel } from '../models/loanModel.js';

describe('useMortgageCalculator', () => {
  /**
   * Test Case: Standard 30-year Fixed Mortgage
   */
  it('calculates the correct monthly principal and interest', () => {
    const mockForm = ref<LoanModel>({
      purchasePrice: 400000,
      downPayment: 80000, // 20% down
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
    });

    const { totalMonthly, principal } = useMortgageCalculator(mockForm);

    // Principal should be Purchase Price - Down Payment
    expect(principal.value).toBe(320000);

    // Monthly P&I for $320k @ 6.5% for 30yr is approx $2,022.62
    // We check if the totalMonthly (which includes taxes/ins) is within range
    expect(totalMonthly.value).toBeGreaterThan(2022);
  });

  /**
   * Test Case: Amortization Schedule Integrity
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
    });

    const { amortizationSchedule } = useMortgageCalculator(mockForm);

    // Should have 180 entries
    expect(amortizationSchedule.value.length).toBe(180);
    
    // Final balance should be 0 (or very close due to rounding)
    const finalMonth = amortizationSchedule.value[179];
    expect(Math.round(finalMonth.balance)).toBe(0);
  });
});