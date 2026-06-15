import { fetchWithAuth, getToken } from '../api/auth'

/**
 * Download a single invoice PDF from backend
 * @param {string} invoiceId - The invoice ID to download
 * @param {string} invoiceNumber - The invoice number for filename (optional)
 */
export const downloadInvoicePdf = async (invoiceId, invoiceNumber = null) => {
    try {
        const token = getToken()
        if (!token) {
            console.error('Not authenticated')
            return
        }

        const response = await fetch(
            `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/invoices/${invoiceId}/pdf`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        )

        if (!response.ok) {
            throw new Error(`Failed to download PDF: ${response.statusText}`)
        }

        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${invoiceNumber || invoiceId}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
    } catch (error) {
        console.error('Error downloading PDF:', error)
        alert('Failed to download invoice PDF')
    }
}

/**
 * Download all invoices as a single PDF
 * @param {Array} invoices - Array of invoice objects
 */
export const downloadAllInvoicesPdf = async (invoices) => {
    try {
        const token = getToken()
        if (!token) {
            console.error('Not authenticated')
            return
        }

        const response = await fetch(
            `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/invoices/pdf/all`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ invoices: invoices.map(inv => inv.id) }),
            }
        )

        if (!response.ok) {
            throw new Error(`Failed to download PDF: ${response.statusText}`)
        }

        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `invoices-${new Date().toISOString().split('T')[0]}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
    } catch (error) {
        console.error('Error downloading invoices PDF:', error)
        alert('Failed to download invoices PDF')
    }
}
