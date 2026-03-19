/**
 * @file models/loanModel.ts
 * @description Core data structures for the mortgage engine.
 * Ensures consistent data types across the calculator's UI and logic.
 */

export enum LoanType {
  CONV = 'CONV',
  FHA = 'FHA',
  VA = 'VA',
  USDA = 'USDA',
}

/**
 * Interface representing the user's loan input parameters.
 */
export interface LoanModel {
  purchasePrice: number;
  downPayment: number; // Percentage (e.g., 20)
  term: number;        // Years (e.g., 30)
  rate: number;        // Annual Interest (e.g., 6.5)
  zip: string;
  loanType: LoanType;
  hoa: number;         // Monthly cost
  points: number;      // Discount points
  includePMI: boolean;
  taxRate: number;     // Annual rate (e.g., 1.2)
  insurance: number;   // Annual premium
  closingCosts: number; // Percentage
}

/**
 * Represents a single month in the amortization table.
 */
export interface AmortizationEntry {
  month: number;
  principalPaid: number;
  interest: number;
  balance: number;
}