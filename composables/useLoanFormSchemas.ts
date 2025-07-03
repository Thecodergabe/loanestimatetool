// composables/useLoanFormSchemas.ts
import { useValidationRules } from '~/composables/useValidationRules'
import { useTooltip } from '~/composables/useTooltip'
import { type LoanModel, LoanType } from '~/models/loanModel'

// Define allowed keys based on LoanModel
export type LoanFieldKey = keyof LoanModel

export interface LoanFieldSchema {
  key: LoanFieldKey
  label: string
  type: 'text' | 'number' | 'currency' | 'percent' | 'select' | 'checkbox'
  tooltip?: string
  rules?: any[]
  options?: string[]
  prefix?: string
  suffix?: string
  maxlength?: number
}

export function useLoanFormSchemas() {
  const { required, positive, percent, zip } = useValidationRules()
  const { getTooltip } = useTooltip()

  const coreFields: LoanFieldSchema[] = [
    {
      key: 'purchasePrice',
      label: 'Purchase Price',
      type: 'currency',
      prefix: '$',
      rules: [required, positive],
      tooltip: getTooltip('purchasePrice'),
    },
    {
      key: 'downPayment',
      label: 'Down Payment (%)',
      type: 'percent',
      suffix: '%',
      rules: [required, percent],
      tooltip: getTooltip('downPayment'),
    },
    {
      key: 'term',
      label: 'Loan Term (years)',
      type: 'number',
      rules: [required, positive],
      tooltip: getTooltip('loanTerm'),
    },
    {
      key: 'rate',
      label: 'Interest Rate (%)',
      type: 'percent',
      suffix: '%',
      rules: [required, percent],
      tooltip: getTooltip('interestRate'),
    },
    {
      key: 'zip',
      label: 'ZIP Code',
      type: 'text',
      maxlength: 5,
      rules: [required, zip],
      tooltip: getTooltip('zipCode'),
    },
    {
      key: 'loanType',
      label: 'Loan Type',
      type: 'select',
      options: Object.values(LoanType),
      rules: [required],
      tooltip: getTooltip('loanType'),
    },
  ]

  const advancedFields: LoanFieldSchema[] = [
    {
      key: 'hoa',
      label: 'Monthly HOA Dues',
      type: 'currency',
      prefix: '$',
      tooltip: getTooltip('hoa'),
    },
    {
      key: 'points',
      label: 'Points Paid',
      type: 'number',
      suffix: 'pts',
      tooltip: getTooltip('points'),
    },
    {
      key: 'includePMI',
      label: 'Include PMI',
      type: 'checkbox',
      tooltip: getTooltip('includePMI'),
    },
    {
      key: 'taxRate',
      label: 'Property Tax Rate',
      type: 'percent',
      suffix: '%',
      tooltip: getTooltip('taxRate'),
    },
    {
      key: 'insurance',
      label: 'Homeowners Insurance',
      type: 'currency',
      prefix: '$',
      tooltip: getTooltip('insurance'),
    },
    {
      key: 'closingCosts',
      label: 'Estimated Closing Costs (%)',
      type: 'percent',
      suffix: '%',
      tooltip: getTooltip('closingCosts'),
    },
  ]

  return { coreFields, advancedFields }
}