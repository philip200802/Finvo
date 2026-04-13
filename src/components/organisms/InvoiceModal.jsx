import { useMemo, useState } from 'react'
import { Plus, X, Trash2 } from 'lucide-react'

function InvoiceModal({ open, onClose }) {
    const [client, setClient] = useState('')
    const [billingDate, setBillingDate] = useState('2026-10-24')
    const [notes, setNotes] = useState('Payment is due within 30 days of receipt...')

    // Form input fields
    const [description, setDescription] = useState('')
    const [quantity, setQuantity] = useState(1)
    const [unitPrice, setUnitPrice] = useState(0)

    // Line items preview (temporary, before submission)
    const [lineItems, setLineItems] = useState([])

    // Finalized rows (after submission)
    const [finalizedRows, setFinalizedRows] = useState([])

    const addLineItem = () => {
        if (!description.trim() || quantity <= 0 || unitPrice <= 0) {
            // alert('Please fill in all fields with valid values')
            return
        }

        const newItem = {
            id: Date.now(),
            description,
            qty: parseInt(quantity),
            unitPrice: parseFloat(unitPrice),
        }

        setLineItems((prev) => [...prev, newItem])
        // Reset form
        setDescription('')
        setQuantity(1)
        setUnitPrice(0)
    }

    const removeLineItem = (id) => {
        setLineItems((prev) => prev.filter((item) => item.id !== id))
    }

    const submitInvoice = () => {
        if (lineItems.length === 0) {
            alert('Add at least one line item before submitting')
            return
        }

        // Finalize the line items
        setFinalizedRows(lineItems)
        // Clear preview
        setLineItems([])
        // Clear form
        setDescription('')
        setQuantity(1)
        setUnitPrice(0)
    }

    const subtotal = useMemo(() => finalizedRows.reduce((acc, row) => acc + row.qty * row.unitPrice, 0), [finalizedRows])
    const tax = subtotal * 0.085
    const total = subtotal + tax

    const formatCurrency = (value) =>
        value.toLocaleString('en-NG', {
            style: 'currency',
            currency: 'NGN',
            maximumFractionDigits: 0,
        })

    return (
        open ? (
            <div className="modal-shell">
                <section className="invoice-modal modal-fade-in">
                    <div className="modal-header-row">
                        <div>
                            <h3 className="page-title mb-1">New Architectural Invoice</h3>
                            <p className="eyebrow mb-0">Invoice ID: #FIN-2026-0082</p>
                        </div>
                        <button className="icon-btn" type="button" onClick={onClose} aria-label="Close modal">
                            <X size={16} />
                        </button>
                    </div>

                    {/* Header Info */}
                    <div className="row g-3 mb-4">
                        <div className="col-md-6">
                            <label className="eyebrow d-block mb-2">Select Client</label>
                            <select className="form-select finvo-input" value={client} onChange={(e) => setClient(e.target.value)}>
                                <option value="">Choose a project or client...</option>
                                <option value="meridian">Meridian Arch</option>
                                <option value="skyline">Skyline Kinetica</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="eyebrow d-block mb-2">Billing Date</label>
                            <input type="date" className="form-control finvo-input" value={billingDate} onChange={(e) => setBillingDate(e.target.value)} />
                        </div>
                    </div>

                    {/* Line Item Form */}
                    <div className="finvo-card mb-4">
                        <p className="eyebrow mb-3">Add Line Items & Services</p>
                        <div className="row g-3 mb-3">
                            <div className="col-lg-4">
                                <label className="eyebrow d-block mb-2">Description</label>
                                <input
                                    type="text"
                                    className="form-control finvo-input"
                                    placeholder="Service name..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            <div className="col-lg-2">
                                <label className="eyebrow d-block mb-2">Quantity</label>
                                <input
                                    type="number"
                                    className="form-control finvo-input"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                />
                            </div>
                            <div className="col-lg-3">
                                <label className="eyebrow d-block mb-2">Unit Price</label>
                                <input
                                    type="number"
                                    className="form-control finvo-input"
                                    min="0"
                                    placeholder="0.00"
                                    value={unitPrice}
                                    onChange={(e) => setUnitPrice(e.target.value)}
                                />
                            </div>
                            <div className="col-lg-3">
                                <label className="eyebrow d-block mb-2">Amount</label>
                                <input
                                    type="text"
                                    className="form-control finvo-input"
                                    disabled
                                    value={formatCurrency(parseInt(quantity) * parseFloat(unitPrice) || 0)}
                                />
                            </div>
                        </div>
                        <button className="btn btn-primary btn-sm" onClick={addLineItem} type="button">
                            <Plus size={14} className="me-1" /> Add Line Item
                        </button>
                    </div>

                    {/* Line Items Preview */}
                    {lineItems.length > 0 && (
                        <div className="mb-4">
                            <p className="eyebrow mb-2">Preview - Unsaved Line Items</p>
                            <div className="table-responsive">
                                <table className="table finvo-table mb-0">
                                    <thead>
                                        <tr>
                                            <th>Description</th>
                                            <th>Quantity</th>
                                            <th>Unit Price</th>
                                            <th>Amount</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {lineItems.map((row) => (
                                            <tr key={row.id} style={{ opacity: 0.7 }}>
                                                <td>{row.description}</td>
                                                <td>{row.qty}</td>
                                                <td>{formatCurrency(row.unitPrice)}</td>
                                                <td className="text-light fw-semibold">{formatCurrency(row.qty * row.unitPrice)}</td>
                                                <td>
                                                    <button
                                                        className="icon-btn"
                                                        type="button"
                                                        onClick={() => removeLineItem(row.id)}
                                                        aria-label="Remove"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Finalized Line Items */}
                    {finalizedRows.length > 0 && (
                        <div className="table-responsive mb-4">
                            <table className="table finvo-table mb-0">
                                <thead>
                                    <tr>
                                        <th>Description</th>
                                        <th>Quantity</th>
                                        <th>Unit Price</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {finalizedRows.map((row, index) => (
                                        <tr key={`${row.id}-${index}`}>
                                            <td>{row.description}</td>
                                            <td>{row.qty}</td>
                                            <td>{formatCurrency(row.unitPrice)}</td>
                                            <td className="text-light fw-semibold">{formatCurrency(row.qty * row.unitPrice)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Notes & Summary */}
                    <div className="row g-3 mb-4">
                        <div className="col-md-6">
                            <label className="eyebrow d-block mb-2">Notes & Payment Terms</label>
                            <textarea
                                className="form-control finvo-input"
                                rows="4"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>
                        <div className="col-md-6">
                            <div className="finvo-card summary-box h-100">
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Subtotal</span>
                                    <strong>{formatCurrency(subtotal)}</strong>
                                </div>
                                <div className="d-flex justify-content-between mb-3">
                                    <span>Tax (8.5%)</span>
                                    <strong>{formatCurrency(tax)}</strong>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between align-items-center mt-3">
                                    <span className="eyebrow mb-0">Grand Total</span>
                                    <h3 className="text-primary mb-0">{formatCurrency(total)}</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="d-flex justify-content-end gap-2">
                        <button className="btn btn-outline-light" type="button" onClick={onClose}>
                            Cancel
                        </button>
                        {lineItems.length > 0 && (
                            <button className="btn btn-secondary" type="button" onClick={submitInvoice}>
                                Submit Line Items
                            </button>
                        )}
                        {finalizedRows.length > 0 && (
                            <>
                                <button className="btn btn-outline-light" type="button">
                                    Save as Draft
                                </button>
                                <button className="btn btn-primary" type="button">
                                    Save & Generate PDF
                                </button>
                            </>
                        )}
                    </div>
                </section>
            </div>
        ) : null
    )
}

export default InvoiceModal
