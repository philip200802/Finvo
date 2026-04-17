import { Download } from 'lucide-react'
import InvoiceTable from '../components/molecules/InvoiceTable'

function InvoicesView({ invoices, onStatusChange }) {
    const handleDownloadAllSelected = () => {
        console.log('Download Invoice Summary PDF')
    }

    return (
        <section className="finvo-card">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="card-title mb-0">Invoice Ledger</h3>
                <button className="btn btn-outline-light d-flex align-items-center gap-2" onClick={handleDownloadAllSelected}>
                    <Download size={16} />
                    <span>Download PDF</span>
                </button>
            </div>
            {/* invoices should be the normalized response from your invoices list endpoint. */}
            <InvoiceTable invoices={invoices} onStatusChange={onStatusChange} />
        </section>
    )
}

export default InvoicesView
