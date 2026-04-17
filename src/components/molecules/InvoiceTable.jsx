import { useEffect, useState } from 'react'
import { MoreVertical, Download } from 'lucide-react'
import StatusBadge from '../atoms/StatusBadge'

function InvoiceTable({ invoices, onStatusChange }) {
    const [rows, setRows] = useState(invoices)
    const [openMenuId, setOpenMenuId] = useState(null)

    useEffect(() => {
        setRows(invoices)
    }, [invoices])

    const setInvoiceStatus = (invoiceId, status) => {
        onStatusChange(invoiceId, status)
        setOpenMenuId(null)
    }

    const toggleMenu = (invoiceId) => {
        setOpenMenuId((prev) => (prev === invoiceId ? null : invoiceId))
    }

    const handleEditInvoice = (invoiceId) => {
        console.log('Edit invoice', invoiceId)
        setOpenMenuId(null)
    }

    const handleDeleteInvoice = (invoiceId) => {
        console.log('Delete invoice', invoiceId)
        setOpenMenuId(null)
    }

    const handleDownloadPdf = (invoiceId) => {
        console.log('Download PDF', invoiceId)
        setOpenMenuId(null)
    }

    return (
        <>
            <div className="table-responsive invoice-table-wrap d-none d-md-block">
                <table className="table finvo-table align-middle mb-0">
                    <thead>
                        <tr>
                            <th>Client / Project</th>
                            <th>Invoice ID</th>
                            <th>Issue Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th className="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((invoice) => (
                            <tr key={invoice.id}>
                                <td>
                                    <strong className="d-block text-light">{invoice.client}</strong>
                                    <small className="text-secondary">{invoice.project}</small>
                                </td>
                                <td>{invoice.id}</td>
                                <td>{invoice.issueDate}</td>
                                <td className="text-light fw-semibold">{invoice.amount}</td>
                                <td>
                                    <StatusBadge status={invoice.status} />
                                </td>
                                <td className="text-end">
                                    <div className="invoice-action-wrap">
                                        <button
                                            className="icon-btn"
                                            type="button"
                                            aria-label="Invoice actions"
                                            onClick={() => toggleMenu(invoice.id)}
                                        >
                                            <MoreVertical size={15} />
                                        </button>
                                        {openMenuId === invoice.id && (
                                            <div className="invoice-action-menu">
                                                <button className="invoice-action-item" type="button" onClick={() => handleEditInvoice(invoice.id)}>
                                                    Edit
                                                </button>
                                                <button className="invoice-action-item" type="button" onClick={() => handleDeleteInvoice(invoice.id)}>
                                                    Delete
                                                </button>
                                                <div className="invoice-action-divider" />
                                                <button className="invoice-action-item" type="button" onClick={() => setInvoiceStatus(invoice.id, 'Paid')}>
                                                    Mark as Paid
                                                </button>
                                                <button className="invoice-action-item" type="button" onClick={() => setInvoiceStatus(invoice.id, 'Pending')}>
                                                    Mark as Pending
                                                </button>
                                                <button className="invoice-action-item" type="button" onClick={() => setInvoiceStatus(invoice.id, 'Cancelled')}>
                                                    Mark as Cancelled
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="d-md-none d-grid gap-3">
                {rows.map((invoice) => (
                    <article className="finvo-card p-3" key={`card-${invoice.id}`}>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                                <strong className="d-block text-light">{invoice.client}</strong>
                                <small className="text-secondary">{invoice.project}</small>
                            </div>
                            <StatusBadge status={invoice.status} />
                        </div>
                        <p className="mb-1 text-secondary">{invoice.id}</p>
                        <p className="mb-1 text-secondary">{invoice.issueDate}</p>
                        <p className="mb-3 text-light fw-semibold fs-5">{invoice.amount}</p>
                        <div className="invoice-action-wrap ms-auto">
                            <button
                                className="icon-btn"
                                type="button"
                                aria-label="Invoice actions"
                                onClick={() => toggleMenu(invoice.id)}
                            >
                                <MoreVertical size={15} />
                            </button>
                            {openMenuId === invoice.id && (
                                <div className="invoice-action-menu">
                                    <button className="invoice-action-item" type="button" onClick={() => handleEditInvoice(invoice.id)}>
                                        Edit
                                    </button>
                                    <button className="invoice-action-item" type="button" onClick={() => handleDeleteInvoice(invoice.id)}>
                                        Delete
                                    </button>
                                    <div className="invoice-action-divider" />
                                    <button className="invoice-action-item" type="button" onClick={() => setInvoiceStatus(invoice.id, 'Paid')}>
                                        Mark as Paid
                                    </button>
                                    <button className="invoice-action-item" type="button" onClick={() => setInvoiceStatus(invoice.id, 'Pending')}>
                                        Mark as Pending
                                    </button>
                                    <button className="invoice-action-item" type="button" onClick={() => setInvoiceStatus(invoice.id, 'Cancelled')}>
                                        Mark as Cancelled
                                    </button>
                                </div>
                            )}
                        </div>
                    </article>
                ))}
            </div >
        </>
    )
}

export default InvoiceTable
