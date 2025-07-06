import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useMortgageCalculator } from './useMortgageCalculator'
import type { LoanModel } from '../models/loanModel'
import { LoanType } from '../models/loanModel'

describe('useMortgageCalculator (unit)', () => {
  it('calculates principal and monthly payment for conventional loan', () => {
    const form = ref<LoanModel>({
      purchasePrice: 500000,
      downPayment: 20,
      term: 30,
      rate: 6.5,
      zip: '97229',
      loanType: LoanType.Conventional,
      hoa: 120,
      points: 0,
      includePMI: false,
      taxRate: 1.25,
      insurance: 1500,
      closingCosts: 3,
    })

    const { principal, monthlyPayment } = useMortgageCalculator(form)
    expect(principal.value).toBeCloseTo(400000, 1)
    expect(monthlyPayment.value).toBeGreaterThan(1900)
  })

  it('reduces effective rate based on points', () => {
    const form = ref<LoanModel>({
      purchasePrice: 480000,
      downPayment: 20,
      term: 30,
      rate: 6.0,
      zip: '30303',
      loanType: LoanType.Conventional,
      hoa: 80,
      points: 2,
      includePMI: false,
      taxRate: 1.0,
      insurance: 1100,
      closingCosts: 2.5,
    })

    const { effectiveRate } = useMortgageCalculator(form)
    expect(effectiveRate.value).toBe(5.5)
  })

  it('calculates PMI correctly when enabled', () => {
    const form = ref<LoanModel>({
      purchasePrice: 400000,
      downPayment: 10,
      term: 30,
      rate: 5.5,
      zip: '33101',
      loanType: LoanType.FHA,
      hoa: 150,
      points: 1,
      includePMI: true,
      taxRate: 1.4,
      insurance: 1300,
      closingCosts: 3.5,
    })

    const { pmi } = useMortgageCalculator(form)
    const expectedPrincipal = 400000 * 0.9
    const expectedPMI = (0.005 * expectedPrincipal) / 12
    expect(pmi.value).toBeCloseTo(expectedPMI, 2)
  })

  it('computes monthly taxes and insurance values', () => {
    const form = ref<LoanModel>({
      purchasePrice: 600000,
      downPayment: 20,
      term: 30,
      rate: 6.25,
      zip: '90210',
      loanType: LoanType.Conventional,
      hoa: 200,
      points: 0,
      includePMI: false,
      taxRate: 1.5,
      insurance: 1800,
      closingCosts: 2,
    })

    const { taxes, insurance } = useMortgageCalculator(form)
    expect(taxes.value).toBeCloseTo((600000 * 1.5) / 100 / 12, 2)
    expect(insurance.value).toBeCloseTo(150, 2)
  })

  it('calculates closing costs based on purchase price', () => {
    const form = ref<LoanModel>({
      purchasePrice: 525000,
      downPayment: 15,
      term: 30,
      rate: 5.75,
      zip: '60614',
      loanType: LoanType.Conventional,
      hoa: 90,
      points: 1,
      includePMI: false,
      taxRate: 1.1,
      insurance: 1600,
      closingCosts: 2.5,
    })

    const { closingCosts } = useMortgageCalculator(form)
    expect(closingCosts.value).toBeCloseTo(13125, 2) // 2.5% of 525k
  })

  it('calculates total monthly cost accurately with all components', () => {
    const form = ref<LoanModel>({
      purchasePrice: 475000,
      downPayment: 15,
      term: 30,
      rate: 6.0,
      zip: '85001',
      loanType: LoanType.Conventional,
      hoa: 100,
      points: 0,
      includePMI: true,
      taxRate: 1.3,
      insurance: 1400,
      closingCosts: 3,
    })

    const {
      monthlyPayment,
      taxes,
      insurance,
      pmi,
      hoa,
      totalMonthly,
    } = useMortgageCalculator(form)

    const expectedTotal = monthlyPayment.value + taxes.value + insurance.value + pmi.value + hoa.value
    expect(totalMonthly.value).toBeCloseTo(expectedTotal, 2)
  })

  it('calculates upfront cost including down payment and closing costs', () => {
    const form = ref<LoanModel>({
      purchasePrice: 550000,
      downPayment: 25,
      term: 30,
      rate: 5.25,
      zip: '98101',
      loanType: LoanType.USDA,
      hoa: 150,
      points: 1,
      includePMI: false,
      taxRate: 1.3,
      insurance: 1600,
      closingCosts: 2.5,
    })

    const { upfrontCost } = useMortgageCalculator(form)
    const expected = (550000 * 0.25) + (550000 * 0.025)
    expect(upfrontCost.value).toBeCloseTo(expected, 2)
  })

  it('clamps effective rate to zero if points over-discount', () => {
    const form = ref<LoanModel>({
      purchasePrice: 400000,
      downPayment: 20,
      term: 30,
      rate: 0.25,
      zip: '60614',
      loanType: LoanType.Conventional,
      hoa: 90,
      points: 2,
      includePMI: false,
      taxRate: 1.1,
      insurance: 1000,
      closingCosts: 3,
    })

    const { effectiveRate } = useMortgageCalculator(form)
    expect(effectiveRate.value).toBe(0)
  })

  it('handles zero-interest amortization correctly', () => {
    const form = ref<LoanModel>({
      purchasePrice: 300000,
      downPayment: 15,
      term: 30,
      rate: 0,
      zip: '90210',
      loanType: LoanType.VA,
      hoa: 0,
      points: 0,
      includePMI: false,
      taxRate: 1.0,
      insurance: 900,
      closingCosts: 2,
    })

    const { monthlyPayment } = useMortgageCalculator(form)
    const expected = (300000 * 0.85) / (30 * 12)
    expect(monthlyPayment.value).toBeCloseTo(expected, 2)
  })
})
