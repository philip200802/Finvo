import { CheckCircle, AlertCircle, X } from 'lucide-react'

function ResultModal({ open, type, title, message, onClose }) {
    // type: 'success' or 'error'

    return open ? (
        <div className="modal-shell">
            <section className="invoice-modal modal-fade-in">
                <div className="modal-header-row">
                    <div className="d-flex align-items-center gap-2">
                        {type === 'success' ? (
                            <CheckCircle size={28} className="text-success" />
                        ) : (
                            <AlertCircle size={28} className="text-danger" />
                        )}
                        <h3 className="page-title mb-0">{title}</h3>
                    </div>
                    <button className="icon-btn" type="button" onClick={onClose} aria-label="Close modal">
                        <X size={16} />
                    </button>
                </div>

                <div className="mt-4 mb-4">
                    <p className="text-muted">{message}</p>
                </div>

                <div className="d-flex justify-content-end gap-2">
                    <button className="btn btn-primary" type="button" onClick={onClose}>
                        {type === 'success' ? 'Continue' : 'Try Again'}
                    </button>
                </div>
            </section>
        </div>
    ) : null
}

export default ResultModal
