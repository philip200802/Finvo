import { useRef, forwardRef, useImperativeHandle } from 'react'
import { Download } from 'lucide-react'
import InvoiceList from '../components/organisms/InvoiceList'
import { downloadAllInvoicesPdf } from '../utils/pdfDownload'

const InvoicesViewBase = forwardRef((props, ref) => {
    const invoiceListRef = useRef(null)

    // Expose refresh method to parent
    useImperativeHandle(ref, () => ({
        refreshInvoices: () => {
            if (invoiceListRef.current) {
                invoiceListRef.current.refreshInvoices()
            }
        },
    }))

    const handleDownloadAllSelected = () => {
        const { invoices } = props
        if (invoices && invoices.length > 0) {
            downloadAllInvoicesPdf(invoices)
        } else {
            alert('No invoices to download')
        }
    }

    const handleRefresh = () => {
        if (invoiceListRef.current) {
            invoiceListRef.current.refreshInvoices()
        }
    }

    return (
        <section className="finvo-card">
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <h3 className="card-title mb-0">Invoice Ledger</h3>
                <div className="d-flex gap-2">
                    <button className="btn btn-outline-light btn-sm" onClick={handleRefresh}>
                        ↻ Refresh
                    </button>
                    <button className="btn btn-outline-light d-flex align-items-center gap-2" onClick={handleDownloadAllSelected}>
                        <Download size={16} />
                        <span>Download PDF</span>
                    </button>
                </div>
            </div>
            {/* Use new InvoiceList that fetches from backend */}
            <InvoiceList ref={invoiceListRef} />
        </section>
    )
})

InvoicesViewBase.displayName = 'InvoicesView'
export default InvoicesViewBase
