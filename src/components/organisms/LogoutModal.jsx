import { LogOut } from 'lucide-react'

function LogoutModal({ open, onConfirm, onCancel }) {
    if (!open) return null

    return (
        <>
            <div className="modal-backdrop show" onClick={onCancel} />
            <div className="logout-modal">
                <div className="logout-modal-content">
                    <div className="modal-icon">
                        <LogOut size={32} />
                    </div>
                    <h2 className="modal-title">Logout</h2>
                    <p className="modal-message">Are you sure you want to logout? You'll need to log back in to access your account.</p>
                    <div className="modal-actions">
                        <button className="btn btn-outline-secondary" onClick={onCancel} type="button">
                            Cancel
                        </button>
                        <button className="btn btn-danger" onClick={onConfirm} type="button">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LogoutModal
