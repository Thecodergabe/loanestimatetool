export interface LoanModel {
  purchasePrice: number
  downPayment: number
  term: number
  rate: number
  zip: string
  loanType: LoanType
  hoa: number
  points: number
  includePMI: boolean
  taxRate: number
  insurance: number
  closingCosts: number
}

export enum LoanType {
  CONV = 'CONV',
  FHA = 'FHA',
  VA = 'VA',
  USDA = 'USDA',
}
