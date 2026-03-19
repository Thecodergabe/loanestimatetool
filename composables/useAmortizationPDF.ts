/**
 * @file composables/useAmortizationPDF.ts
 * @description Professional PDF generation service for loan amortization schedules.
 * Utilizes dynamic imports for jsPDF and autoTable to ensure compatibility 
 * in library/NPM environments and minimize bundle size.
 */

import type { AmortizationEntry } from '../models/loanModel.js';

export const useAmortizationPDF = () => {
  /**
   * Generates and downloads a formatted PDF report of the amortization schedule.
   * * @param schedule - Array of monthly payment breakdowns.
   * @param zip - Optional ZIP code to include in the file name and header.
   */
  const downloadAmortizationPDF = async (schedule: AmortizationEntry[], zip: string = '') => {
    // Ensure we are in a browser environment
    if (typeof window === 'undefined') return;

    try {
      // Dynamic imports for library-agnostic performance
      const { jsPDF } = await import('jspdf');
      const autoTableModule = await import('jspdf-autotable');
      
      // Access the callable function from the module (handles various export types)
      const autoTable = (autoTableModule.default || autoTableModule) as any;

      const doc = new jsPDF();
      const timestamp = new Date().toLocaleDateString();

      // Header Configuration
      doc.setFontSize(20);
      doc.setTextColor(24, 103, 192); // Primary Blue
      doc.text('Amortization Schedule', 14, 22);

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${timestamp}`, 14, 30);
      if (zip) {
        doc.text(`Property Location: ${zip}`, 14, 35);
      }

      // Transform schedule data for table consumption
      const tableRows = schedule.map(row => [
        String(row.month),
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(row.principalPaid),
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(row.interest),
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(row.balance)
      ]);

      // Execute Table Generation
      autoTable(doc, {
        startY: 40,
        head: [['Month', 'Principal Paid', 'Interest Paid', 'Remaining Balance']],
        body: tableRows,
        theme: 'striped',
        headStyles: { 
          fillColor: [24, 103, 192],
          fontSize: 10,
          fontStyle: 'bold',
          halign: 'center'
        },
        columnStyles: {
          0: { halign: 'center' },
          1: { halign: 'right' },
          2: { halign: 'right' },
          3: { halign: 'right' }
        },
        styles: { fontSize: 9 },
        margin: { top: 40 }
      });

      // Trigger Download
      const fileName = zip ? `Amortization_Report_${zip}.pdf` : 'Amortization_Report.pdf';
      doc.save(fileName);

    } catch (error) {
      console.error('PDF Export Generation Failed:', error);
      throw new Error('Could not generate PDF. Please ensure jsPDF and jspdf-autotable are installed.');
    }
  };

  return { downloadAmortizationPDF };
};