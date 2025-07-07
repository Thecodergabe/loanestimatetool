// types/loan.ts

export interface AmortizationEntry {
  month: number
  principalPaid: number
  interest: number
  balance: number
}
