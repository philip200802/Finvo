import InvoiceTable from '../components/molecules/InvoiceTable'

function InvoicesView({ invoices }) {
    return (
        <section className="finvo-card">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="card-title mb-0">Invoice Ledger</h3>
            </div>
            {/* invoices should be the normalized response from your invoices list endpoint. */}
            <InvoiceTable invoices={invoices} />
        </section>
    )
}

export default InvoicesView
