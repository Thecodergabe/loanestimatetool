export const useTooltip = () => {
  const tooltips = {
    purchasePrice: 'The total contracted price of the home being purchased, before closing costs or fees.',
    downPayment: 'Percentage of the purchase price paid upfront. Affects monthly payments and PMI requirements.',
    loanTerm: 'Length of time over which the mortgage will be repaid. Common terms are 15, 20, or 30 years.',
    interestRate: 'The annual fixed rate used to calculate mortgage interest payments.',
    zipCode: 'Used to determine local property tax rates and fees based on the location of the property.',
    loanType: 'Select the financing program applicable to your loan. Each has unique qualification criteria.',

    hoa: 'Monthly fee required by a Homeowners Association for property upkeep and shared amenities.',
    points: 'Optional fees paid at closing to reduce the loan\'s interest rate over time.',
    includePMI: 'Private Mortgage Insurance is typically required when the down payment is less than 20%.',
    taxRate: 'The annual property tax rate in your area, used to calculate estimated escrow payments.',
    insurance: 'An annual estimate of your home insurance premium—commonly required by lenders.',
    closingCosts: 'Anticipated one-time costs at settlement, typically 2–5% of the home purchase price.',
  }

  const getTooltip = (key: keyof typeof tooltips) => tooltips[key] || ''

  return { getTooltip }
}
