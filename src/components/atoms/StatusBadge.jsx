const statusStyles = {
    Paid: 'status-paid',
    Processing: 'status-processing',
    Pending: 'status-pending',
    Overdue: 'status-overdue',
    Canceled: 'status-canceled',
    Cancelled: 'status-cancelled',
    Canclled: 'status-cancelled',
    Filed: 'status-paid',
    Draft: 'status-draft',
}

function StatusBadge({ status }) {
    return <span className={`status-badge ${statusStyles[status] ?? 'status-draft'}`}>{status}</span>
}

export default StatusBadge
