import { useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import { ChevronDown, ChevronUp, CheckCircle, AlertCircle, Loader, MoreVertical, Edit2, Trash2 } from 'lucide-react'
import StatusBadge from '../atoms/StatusBadge'
import { getToken } from '../../api/auth'

function InvoiceListBase(props, ref) {
    const [invoices, setInvoices] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [expandedInvoiceId, setExpandedInvoiceId] = useState(null)
    const [paymentInProgress, setPaymentInProgress] = useState({})
    const [paymentAmounts, setPaymentAmounts] = useState({})
    const [statusFilter, setStatusFilter] = useState('all') // all, Pending, Paid, Overdue
    const [successMessage, setSuccessMessage] = useState(null)
    const [deleteConfirm, setDeleteConfirm] = useState(null)
    const [menuOpenId, setMenuOpenId] = useState(null)

    // Fetch invoices on mount
    useEffect(() => {
        fetchInvoices()
    }, [])

    // Clear success message after 3 seconds
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(null), 3000)
            return () => clearTimeout(timer)
        }
    }, [successMessage])

    // Expose refresh method to parent
    useImperativeHandle(ref, () => ({
        refreshInvoices: fetchInvoices,
    }))

    const fetchInvoices = async () => {
        const token = getToken()

        if (!token) {
            setError('Session expired. Please login again.')
            setLoading(false)
            return
        }

        try {
            setLoading(true)
            setError(null)

            console.log('[FETCH] Fetching invoices from backend...')

            const response = await fetch(
                'https://backend-1-rhpy.onrender.com/invoice/all',
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const data = await response.json().catch(() => ({}))

            if (!response.ok) {
                console.error('[FETCH] Backend error:', data)
                throw new Error(data.message || 'Failed to fetch invoices')
            }

            // Handle both array and object responses
            const invoiceList = Array.isArray(data) ? data : data.invoices || data.data || []
            setInvoices(invoiceList)
            console.log('[FETCH] Invoices loaded successfully:', invoiceList.length)
        } catch (err) {
            console.error('[FETCH] Error fetching invoices:', err.message)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleMarkAsPaid = async (invoiceId, amountPaid) => {
        const token = getToken()

        if (!token) {
            setError('Session expired. Please login again.')
            return
        }

        if (!amountPaid || amountPaid <= 0) {
            setError('Please enter a valid payment amount')
            return
        }

        setPaymentInProgress((prev) => ({ ...prev, [invoiceId]: true }))

        try {
            const paymentPayload = {
                amountPaid: parseFloat(amountPaid),
                paymentMethod: 'transfer',
                notes: `Payment recorded on ${new Date().toLocaleDateString()}`,
            }

            console.log('[PAYMENT] Processing payment:', paymentPayload)

            const response = await fetch(
                `https://backend-1-rhpy.onrender.com/invoice/pay/${invoiceId}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(paymentPayload),
                }
            )

            const data = await response.json().catch(() => ({}))

            if (!response.ok) {
                console.error('[PAYMENT] Backend error:', data)
                throw new Error(data.message || 'Payment failed')
            }

            console.log('[PAYMENT] Payment successful')

            // Update invoice in state
            setInvoices((prev) =>
                prev.map((inv) =>
                    inv.id === invoiceId
                        ? {
                            ...inv,
                            amountPaid: (inv.amountPaid || 0) + parseFloat(amountPaid),
                            status: data.status || inv.status,
                        }
                        : inv
                )
            )

            setSuccessMessage(`Payment of ₦${parseFloat(amountPaid).toLocaleString()} recorded successfully`)
            setPaymentAmounts((prev) => ({ ...prev, [invoiceId]: '' }))
        } catch (err) {
            console.error('Error processing payment:', err.message)
            setError(err.message)
        } finally {
            setPaymentInProgress((prev) => ({ ...prev, [invoiceId]: false }))
        }
    }

    const handleDeleteInvoice = async (invoiceId) => {
        const token = getToken()

        if (!token) {
            setError('Session expired. Please login again.')
            return
        }

        console.log('[DELETE] Attempting to delete invoice:', invoiceId)

        try {
            const response = await fetch(
                `https://backend-1-rhpy.onrender.com/invoice/delete/${invoiceId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            if (!response.ok) {
                const data = await response.json().catch(() => ({}))
                console.error('[DELETE] Backend error:', data)
                throw new Error(data.message || 'Failed to delete invoice')
            }

            console.log('[DELETE] Invoice deleted successfully')

            // Remove from state
            setInvoices((prev) => prev.filter((inv) => inv.id !== invoiceId))
            setSuccessMessage('Invoice deleted successfully')
            setDeleteConfirm(null)
        } catch (err) {
            console.error('[DELETE] Error deleting invoice:', err.message)
            setError(err.message)
        }
    }

    const handleMarkAsOverdue = async (invoiceId) => {
        const token = getToken()

        if (!token) {
            setError('Session expired. Please login again.')
            return
        }

        console.log('[STATUS] Marking invoice as overdue:', invoiceId)

        try {
            const response = await fetch(
                `https://backend-1-rhpy.onrender.com/invoice/status/${invoiceId}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ status: 'Overdue' }),
                }
            )

            const data = await response.json().catch(() => ({}))

            if (!response.ok) {
                console.error('[STATUS] Backend error:', data)
                throw new Error(data.message || 'Failed to update status')
            }

            console.log('[STATUS] Invoice marked as overdue')

            // Update in state
            setInvoices((prev) =>
                prev.map((inv) =>
                    inv.id === invoiceId ? { ...inv, status: 'Overdue' } : inv
                )
            )

            setSuccessMessage('Invoice marked as overdue')
        } catch (err) {
            console.error('[STATUS] Error updating status:', err.message)
            setError(err.message)
        }
    }

    const formatCurrency = (value) => {
        if (!value) return '₦0'
        return `₦${parseFloat(value).toLocaleString('en-NG', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        })}`
    }

    const toggleInvoiceExpand = (invoiceId) => {
        setExpandedInvoiceId((prev) => (prev === invoiceId ? null : invoiceId))
    }

    const getFilteredInvoices = () => {
        if (statusFilter === 'all') return invoices
        return invoices.filter((inv) => inv.status === statusFilter)
    }

    const filteredInvoices = getFilteredInvoices()

    // LOADING STATE
    if (loading) {
        return (
            <div className="finvo-card text-center py-5">
                <Loader size={40} className="mx-auto mb-3 text-primary animate-spin" />
                <p className="text-muted">Loading invoices...</p>
            </div>
        )
    }

    // ERROR STATE
    if (error) {
        return (
            <div className="finvo-card">
                <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
                    <AlertCircle size={20} />
                    <div>
                        <strong>Error:</strong> {error}
                    </div>
                </div>
                <button className="btn btn-primary" onClick={fetchInvoices}>
                    Retry
                </button>
            </div>
        )
    }

    // EMPTY STATE
    if (filteredInvoices.length === 0) {
        return (
            <div className="finvo-card text-center py-5">
                <AlertCircle size={48} className="mx-auto mb-3 text-muted" />
                <h5>No Invoices Found</h5>
                <p className="text-muted mb-3">
                    {statusFilter === 'all'
                        ? 'You haven\'t created any invoices yet.'
                        : `No ${statusFilter} invoices at the moment.`}
                </p>
                <button className="btn btn-primary" onClick={fetchInvoices}>
                    Refresh
                </button>
            </div>
        )
    }

    return (
        <div className="finvo-card">
            {/* SUCCESS MESSAGE */}
            {successMessage && (
                <div className="alert alert-success d-flex align-items-center gap-2 mb-3" role="alert">
                    <CheckCircle size={20} />
                    {successMessage}
                </div>
            )}

            {/* FILTERS */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <h3 className="card-title mb-0">Invoices</h3>
                <div className="btn-group" role="group">
                    {['all', 'Pending', 'Paid', 'Overdue'].map((status) => (
                        <button
                            key={status}
                            className={`btn btn-sm ${statusFilter === status ? 'btn-primary' : 'btn-outline-light'
                                }`}
                            onClick={() => setStatusFilter(status)}
                        >
                            {status === 'all' ? 'All' : status}
                        </button>
                    ))}
                </div>
            </div>

            {/* INVOICES LIST */}
            <div className="invoices-list">
                {filteredInvoices.map((invoice) => (
                    <div key={invoice.id} className="mb-3">
                        {/* INVOICE HEADER */}
                        <div
                            className="invoice-header p-3 rounded d-flex justify-content-between align-items-center"
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                cursor: 'pointer',
                            }}
                        >
                            <div className="d-flex align-items-center gap-3 flex-grow-1" onClick={() => toggleInvoiceExpand(invoice.id)}>
                                {expandedInvoiceId === invoice.id ? (
                                    <ChevronUp size={20} />
                                ) : (
                                    <ChevronDown size={20} />
                                )}
                                <div>
                                    <p className="mb-1">
                                        <strong>{invoice.clientName || 'Unknown Client'}</strong>
                                    </p>
                                    <small className="text-muted">
                                        ID: {invoice.id} • Due: {invoice.dueDate || 'N/A'}
                                    </small>
                                </div>
                            </div>

                            <div className="d-flex align-items-center gap-3 justify-content-end" style={{ minWidth: '350px' }}>
                                <div className="text-end" style={{ minWidth: '120px' }}>
                                    <p className="mb-1 fw-semibold">{formatCurrency(invoice.amount)}</p>
                                    <StatusBadge status={invoice.status} />
                                </div>

                                {/* ACTION BUTTON */}
                                <div className="position-relative">
                                    <button
                                        className="btn btn-sm btn-outline-light"
                                        onClick={() => setMenuOpenId(menuOpenId === invoice.id ? null : invoice.id)}
                                    >
                                        <MoreVertical size={18} />
                                    </button>

                                    {/* ACTION MENU */}
                                    {menuOpenId === invoice.id && (
                                        <div
                                            className="position-absolute bg-dark border border-secondary rounded mt-1 p-2"
                                            style={{
                                                right: 0,
                                                zIndex: 100,
                                                minWidth: '160px',
                                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                                            }}
                                        >
                                            <button
                                                className="btn btn-sm btn-link text-light d-flex align-items-center gap-2 w-100 text-start mb-1"
                                                onClick={() => {
                                                    console.log('Edit invoice:', invoice.id)
                                                    setMenuOpenId(null)
                                                }}
                                            >
                                                <Edit2 size={16} /> Edit
                                            </button>

                                            {invoice.status !== 'Overdue' && invoice.status !== 'Paid' && (
                                                <button
                                                    className="btn btn-sm btn-link text-warning d-flex align-items-center gap-2 w-100 text-start mb-1"
                                                    onClick={() => {
                                                        handleMarkAsOverdue(invoice.id)
                                                        setMenuOpenId(null)
                                                    }}
                                                >
                                                    ⚠️ Mark Overdue
                                                </button>
                                            )}

                                            <button
                                                className="btn btn-sm btn-link text-danger d-flex align-items-center gap-2 w-100 text-start"
                                                onClick={() => {
                                                    setDeleteConfirm(invoice.id)
                                                    setMenuOpenId(null)
                                                }}
                                            >
                                                <Trash2 size={16} /> Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* DELETE CONFIRMATION */}
                        {deleteConfirm === invoice.id && (
                            <div className="alert alert-danger mt-2 d-flex justify-content-between align-items-center">
                                <span>Are you sure you want to delete this invoice?</span>
                                <div className="gap-2 d-flex">
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDeleteInvoice(invoice.id)}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-light"
                                        onClick={() => setDeleteConfirm(null)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* EXPANDED CONTENT */}
                        {expandedInvoiceId === invoice.id && (
                            <div className="p-3 border-top" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
                                {/* LINE ITEMS */}
                                {invoice.items && invoice.items.length > 0 && (
                                    <div className="mb-4">
                                        <h6 className="mb-3">Line Items</h6>
                                        <div className="table-responsive">
                                            <table className="table finvo-table mb-0" style={{ fontSize: '0.875rem' }}>
                                                <thead>
                                                    <tr>
                                                        <th>Description</th>
                                                        <th>Quantity</th>
                                                        <th>Unit Price</th>
                                                        <th className="text-end">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {invoice.items.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>{item.description}</td>
                                                            <td>{item.qty || item.quantity || 1}</td>
                                                            <td>{formatCurrency(item.unitPrice)}</td>
                                                            <td className="text-end fw-semibold">
                                                                {formatCurrency(
                                                                    (item.qty || item.quantity || 1) * item.unitPrice
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {/* PAYMENT SUMMARY */}
                                <div className="row g-3 mb-4">
                                    <div className="col-md-6">
                                        <div className="finvo-card p-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="text-muted">Amount</span>
                                                <strong>{formatCurrency(invoice.amount)}</strong>
                                            </div>
                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="text-muted">Amount Paid</span>
                                                <strong>{formatCurrency(invoice.amountPaid || 0)}</strong>
                                            </div>
                                            <hr />
                                            <div className="d-flex justify-content-between">
                                                <span className="text-muted">Amount Due</span>
                                                <strong className="text-primary">
                                                    {formatCurrency(
                                                        (invoice.amount || 0) - (invoice.amountPaid || 0)
                                                    )}
                                                </strong>
                                            </div>
                                        </div>
                                    </div>

                                    {/* PAYMENT FORM */}
                                    {invoice.status !== 'Paid' && (
                                        <div className="col-md-6">
                                            <div className="finvo-card p-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                                                <label className="eyebrow d-block mb-2">Record Payment</label>
                                                <div className="input-group mb-2">
                                                    <span className="input-group-text">₦</span>
                                                    <input
                                                        type="number"
                                                        className="form-control finvo-input"
                                                        placeholder="Amount"
                                                        min="0"
                                                        value={paymentAmounts[invoice.id] || ''}
                                                        onChange={(e) =>
                                                            setPaymentAmounts((prev) => ({
                                                                ...prev,
                                                                [invoice.id]: e.target.value,
                                                            }))
                                                        }
                                                        disabled={paymentInProgress[invoice.id]}
                                                    />
                                                </div>
                                                <button
                                                    className="btn btn-primary w-100 btn-sm"
                                                    onClick={() =>
                                                        handleMarkAsPaid(invoice.id, paymentAmounts[invoice.id])
                                                    }
                                                    disabled={paymentInProgress[invoice.id]}
                                                >
                                                    {paymentInProgress[invoice.id] ? (
                                                        <>
                                                            <Loader size={14} className="me-2 animate-spin" />
                                                            Processing...
                                                        </>
                                                    ) : (
                                                        'Record Payment'
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* NOTES */}
                                {invoice.description && (
                                    <div className="mb-4">
                                        <h6 className="mb-2">Notes</h6>
                                        <p className="text-muted small mb-0">{invoice.description}</p>
                                    </div>
                                )}

                                {/* ACTION BUTTONS */}
                                <div className="d-flex gap-2 pt-3 border-top">
                                    {invoice.status === 'Paid' ? (
                                        <div className="alert alert-success mb-0 w-100">
                                            <CheckCircle size={16} className="me-2" />
                                            Invoice fully paid
                                        </div>
                                    ) : (
                                        <>
                                            <button
                                                className="btn btn-success btn-sm"
                                                onClick={() => {
                                                    const fullAmount = (invoice.amount || 0) - (invoice.amountPaid || 0)
                                                    setPaymentAmounts((prev) => ({
                                                        ...prev,
                                                        [invoice.id]: fullAmount.toString(),
                                                    }))
                                                }}
                                            >
                                                Pay Full Amount
                                            </button>
                                            {invoice.status !== 'Overdue' && (
                                                <button
                                                    className="btn btn-outline-warning btn-sm"
                                                    onClick={() => handleMarkAsOverdue(invoice.id)}
                                                >
                                                    Mark Overdue
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default forwardRef(InvoiceListBase)
