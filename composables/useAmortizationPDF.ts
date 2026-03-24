/**
 * @file composables/useAmortizationPDF.ts
 * @description PDF generator for amortization schedules using jsPDF and autoTable.
 * Dynamic imports keep bundle size small and ensure compatibility in SSR and
 * library environments.
 */

import type { AmortizationEntry } from '../models/loanModel.js'

export const useAmortizationPDF = () => {
  /**
   * Generates and downloads a formatted amortization schedule PDF.
   * @param schedule - Array of monthly amortization entries.
   * @param zip - Optional ZIP code for file naming and header metadata.
   */
  const downloadAmortizationPDF = async (
    schedule: AmortizationEntry[],
    zip: string = ''
  ) => {
    // Only execute in a browser environment
    if (typeof window === 'undefined') return

    try {
      // Dynamic imports for optimal performance and environment safety
      const { jsPDF } = await import('jspdf')
      const autoTableModule = await import('jspdf-autotable')

      // Handle both default and named exports
      const autoTable = (autoTableModule.default || autoTableModule) as any

      const doc = new jsPDF()
      const timestamp = new Date().toLocaleDateString()

      // Header
      doc.setFontSize(20)
      doc.setTextColor(24, 103, 192)
      doc.text('Amortization Schedule', 14, 22)

      doc.setFontSize(10)
      doc.setTextColor(100)
      doc.text(`Generated on: ${timestamp}`, 14, 30)
      if (zip) doc.text(`Property Location: ${zip}`, 14, 35)

      // Table rows
      const tableRows = schedule.map(row => [
        String(row.month),
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(row.principalPaid),
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(row.interest),
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(row.balance),
      ])

      // Table
      autoTable(doc, {
        startY: 40,
        head: [['Month', 'Principal Paid', 'Interest Paid', 'Remaining Balance']],
        body: tableRows,
        theme: 'striped',
        headStyles: {
          fillColor: [24, 103, 192],
          fontSize: 10,
          fontStyle: 'bold',
          halign: 'center',
        },
        columnStyles: {
          0: { halign: 'center' },
          1: { halign: 'right' },
          2: { halign: 'right' },
          3: { halign: 'right' },
        },
        styles: { fontSize: 9 },
        margin: { top: 40 },
      })

      // Download
      const fileName = zip
        ? `Amortization_Report_${zip}.pdf`
        : 'Amortization_Report.pdf'

      doc.save(fileName)
    } catch (error) {
      console.error('PDF generation failed:', error)
      throw new Error(
        'Could not generate PDF. Ensure jsPDF and jspdf-autotable are installed.'
      )
    }
  }

  return { downloadAmortizationPDF }
}