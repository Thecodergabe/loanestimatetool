export function useAmortizationPDF() {
  function padRow(col1: string, col2: string, col3: string, col4: string): string {
    return [
      col1.padEnd(6),
      col2.padStart(18),
      col3.padStart(18),
      col4.padStart(24)
    ].join(' ')
  }

  function generateAmortizationPDF(schedule: {
    month: number
    principalPaid: number
    interest: number
    balance: number
  }[]): string[] {
    const grouped = new Map<number, { principal: number; interest: number; balance: number }>()
    schedule.forEach(p => {
      const year = Math.ceil(p.month / 12)
      if (!grouped.has(year)) {
        grouped.set(year, { principal: 0, interest: 0, balance: p.balance })
      }
      const entry = grouped.get(year)!
      entry.principal += p.principalPaid
      entry.interest += p.interest
      entry.balance = p.balance
    })

    const lines: string[] = []
    lines.push('Amortization Schedule (Yearly Summary)')
    lines.push('')
    lines.push(padRow('Year', 'Principal Paid', 'Interest Paid', 'Remaining Balance'))
    lines.push('-'.repeat(80))

    for (const [year, entry] of grouped.entries()) {
      lines.push(
        padRow(
          year.toString(),
          `$${entry.principal.toFixed(2)}`,
          `$${entry.interest.toFixed(2)}`,
          `$${entry.balance.toFixed(2)}`
        )
      )
    }

    return lines
  }

  function downloadAmortizationPDF(schedule: {
    month: number
    principalPaid: number
    interest: number
    balance: number
  }[]) {
    const lines = generateAmortizationPDF(schedule)
    const maxLinesPerPage = 45
    const pages: string[] = []

    for (let i = 0; i < lines.length; i += maxLinesPerPage) {
      pages.push(lines.slice(i, i + maxLinesPerPage).join('\n'))
    }

    const objects: string[] = []
    let offset = 0
    const xref: string[] = ['0000000000 65535 f ']
    let pdf = `%PDF-1.3\n`

    objects.push('1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj')
    objects.push(`2 0 obj << /Type /Pages /Kids [${pages.map((_, i) => `${i + 3} 0 R`).join(' ')}] /Count ${pages.length} >> endobj`)

    pages.forEach((text, i) => {
      const content = `BT /F1 10 Tf 50 800 Td (${text.replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/\n/g, ') Tj\n0 -14 Td (')}) Tj ET`
      const contentLength = content.length
      const contentObj = `${i + 3 + pages.length} 0 obj << /Length ${contentLength} >> stream\n${content}\nendstream endobj`

      objects.push(`${i + 3} 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents ${i + 3 + pages.length} 0 R /Resources << >> >> endobj`)
      objects.push(contentObj)
    })

    offset = pdf.length
    objects.forEach(obj => {
      xref.push(offset.toString().padStart(10, '0') + ' 00000 n ')
      pdf += obj + '\n'
      offset = pdf.length
    })

    const xrefOffset = offset
    pdf += `xref\n0 ${objects.length + 1}\n` + xref.join('\n') + '\n'
    pdf += `trailer << /Root 1 0 R /Size ${objects.length + 1} >>\n`
    pdf += `startxref\n${xrefOffset}\n%%EOF`

    const blob = new Blob([pdf], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'amortization_schedule.pdf'
    link.click()
    URL.revokeObjectURL(url)
  }

  return {
    downloadAmortizationPDF
  }
}