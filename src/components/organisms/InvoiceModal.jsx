import { useMemo, useState } from 'react'
import { Plus, X, Trash2 } from 'lucide-react'
import { getToken } from '../../api/auth'
import ResultModal from './ResultModal'

function InvoiceModal({ open, onClose, onInvoiceCreated, clients = [] }) {
    const [client, setClient] = useState('')
    const [billingDate, setBillingDate] = useState('2026-10-24')
    const [notes, setNotes] = useState('Payment is due within 30 days of receipt...')

    const [description, setDescription] = useState('')
    const [quantity, setQuantity] = useState(1)
    const [unitPrice, setUnitPrice] = useState(0)

    const [lineItems, setLineItems] = useState([])
    const [finalizedRows, setFinalizedRows] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [resultModal, setResultModal] = useState({ open: false, type: 'success', title: '', message: '' })

    const addLineItem = () => {
        if (!description.trim() || quantity <= 0 || unitPrice <= 0) {
            return
        }

        const newItem = {
            id: Date.now(),
            description,
            qty: parseInt(quantity, 10),
            unitPrice: parseFloat(unitPrice),
        }

        setLineItems((prev) => [...prev, newItem])
        setDescription('')
        setQuantity(1)
        setUnitPrice(0)
    }

    const removeLineItem = (id) => {
        setLineItems((prev) => prev.filter((item) => item.id !== id))
    }

    const submitInvoice = async () => {
        const token = getToken()

        if (!token) {
            setResultModal({
                open: true,
                type: 'error',
                title: 'Session Expired',
                message: 'Please login again to continue.',
            })
            return
        }

        if (!client) {
            setResultModal({
                open: true,
                type: 'error',
                title: 'Client Required',
                message: 'Please select a client before creating an invoice.',
            })
            return
        }

        if (lineItems.length === 0) {
            setResultModal({
                open: true,
                type: 'error',
                title: 'Add Line Items',
                message: 'Please add at least one line item to the invoice.',
            })
            return
        }

        setIsSubmitting(true)

        try {
            const subtotal = lineItems.reduce(
                (acc, item) => acc + item.qty * item.unitPrice,
                0
            )

            // Parse client data from selection
            let clientData
            try {
                clientData = JSON.parse(client)
            } catch (e) {
                setResultModal({
                    open: true,
                    type: 'error',
                    title: 'Invalid Client',
                    message: 'Please select a valid client.',
                })
                setIsSubmitting(false)
                return
            }

            // Build payload with all required fields including client email
            const payload = {
                clientName: clientData.name,
                clientEmail: clientData.email,
                amount: subtotal,
                status: "Pending",
                dueDate: billingDate,
                description: notes,
                items: lineItems
            }
            console.log("[INVOICE] Sending payload:", JSON.stringify(payload, null, 2))

            const response = await fetch(
                "https://backend-1-rhpy.onrender.com/invoice/create",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                }
            )

            const data = await response.json().catch(() => ({}))

            if (!response.ok) {
                console.error("[INVOICE] Backend error:", data)
                throw new Error(data.message || "Invoice creation failed")
            }

            console.log("[INVOICE] Invoice created successfully")

            // Show success modal - DO NOT mention email
            setResultModal({
                open: true,
                type: 'success',
                title: 'Invoice Created Successfully',
                message: `Invoice for ${clientData.name} created and sent. It will appear in your invoice list in a moment.`,
            })

            // Reset form
            setLineItems([])
            setFinalizedRows([])
            setClient('')
            setBillingDate('2026-10-24')
            setNotes('Payment is due within 30 days of receipt...')
            setDescription('')
            setQuantity(1)
            setUnitPrice(0)

            // Call callback to refresh list
            if (onInvoiceCreated) {
                onInvoiceCreated()
            }

        } catch (err) {
            console.error("[INVOICE] Error creating invoice:", err.message)
            // Show backend error message or generic error
            const errorMessage = err.message || 'An unexpected error occurred. Please try again.'
            setResultModal({
                open: true,
                type: 'error',
                title: 'Invoice Creation Failed',
                message: errorMessage,
            })
        } finally {
            setIsSubmitting(false)
        }
    }
    const subtotal = useMemo(() => lineItems.reduce((acc, row) => acc + row.qty * row.unitPrice, 0), [lineItems])
    const tax = useMemo(() => subtotal * 0.085, [subtotal])
    const total = useMemo(() => subtotal + tax, [subtotal, tax])
    const formAmount = useMemo(() => (parseFloat(quantity) || 0) * (parseFloat(unitPrice) || 0), [quantity, unitPrice])

    const formatCurrency = (value) =>
        value.toLocaleString('en-NG', {
            style: 'currency',
            currency: 'NGN',
            maximumFractionDigits: 0,
        })

    const handleResultModalClose = () => {
        setResultModal({ ...resultModal, open: false })
        if (resultModal.type === 'success') {
            onClose()
        }
    }

    const invoiceModal = open ? (
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

                <div className="row g-3 mb-4">
                    <div className="col-md-6">
                        <label className="eyebrow d-block mb-2">Select Client</label>
                        <select className="form-select finvo-input" value={client} onChange={(e) => setClient(e.target.value)} required>
                            <option value="">Choose a client...</option>
                            {clients.map((clientItem) => (
                                <option key={clientItem.id} value={JSON.stringify({ id: clientItem.id, name: clientItem.name, email: clientItem.email })}>
                                    {clientItem.name}
                                </option>
                            ))}
                        </select>
                        {!client && <small className="text-danger d-block mt-1">Client is required</small>}
                    </div>
                    <div className="col-md-6">
                        <label className="eyebrow d-block mb-2">Billing Date</label>
                        <input type="date" className="form-control finvo-input" value={billingDate} onChange={(e) => setBillingDate(e.target.value)} />
                    </div>
                </div>

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
                                value={formatCurrency(formAmount)}
                            />
                        </div>
                    </div>
                    <button className="btn btn-primary btn-sm" onClick={addLineItem} type="button">
                        <Plus size={14} className="me-1" /> Add Line Item
                    </button>
                </div>

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
                                                <button className="icon-btn" type="button" onClick={() => removeLineItem(row.id)} aria-label="Remove">
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

                <div className="row g-3 mb-4">
                    <div className="col-md-6">
                        <label className="eyebrow d-block mb-2">Notes & Payment Terms</label>
                        <textarea className="form-control finvo-input" rows="4" value={notes} onChange={(e) => setNotes(e.target.value)} />
                    </div>
                    <div className="col-md-6">
                        <div className="finvo-card summary-box h-100">
                            <div className="d-flex justify-content-between mb-2">
                                <span>Subtotal</span>
                                <strong>{formatCurrency(subtotal)}</strong>
                            </div>
                            {/* <div className="d-flex justify-content-between mb-3">
                                <span>Tax (8.5%)</span>
                                <strong>{formatCurrency(tax)}</strong>
                            </div> */}
                            <hr />
                            <div className="d-flex justify-content-between align-items-center mt-3">
                                <span className="eyebrow mb-0">Grand Total</span>
                                <h3 className="text-primary mb-0">{formatCurrency(total)}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="d-flex justify-content-end gap-2">
                    <button className="btn btn-outline-light" type="button" onClick={onClose}>
                        Cancel
                    </button>
                    {lineItems.length > 0 && (
                        <button className="btn btn-secondary" type="button" onClick={submitInvoice} disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Creating Invoice...
                                </>
                            ) : (
                                'Create Invoice'
                            )}
                        </button>
                    )}
                </div>
            </section>
        </div>
    ) : null

    return (
        <>
            {invoiceModal}
            <ResultModal
                open={resultModal.open}
                type={resultModal.type}
                title={resultModal.title}
                message={resultModal.message}
                onClose={handleResultModalClose}
            />
        </>
    )
}

export default InvoiceModal
