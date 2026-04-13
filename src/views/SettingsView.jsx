import { Building2, Upload } from 'lucide-react'
import profileImage from '../../uiux design/unnamed (8).png'

function SettingsView({ settings }) {
    return (
        <div className="settings-container">
            {/* Header Section */}
            <div className="mb-5">
                <h2 className="page-title mb-2">System Settings</h2>
                <p className="text-secondary">Manage your architectural financial ledger and account preferences.</p>
            </div>

            {/* Top Row: Profile Configuration & Business Details */}
            <div className="row g-4 mb-4">
                {/* Profile Configuration */}
                <div className="col-lg-6">
                    <div className="settings-section">
                        <h3 className="eyebrow mb-4">Profile Configuration</h3>
                        <div className="text-center mb-4">
                            <div className="profile-avatar-large mx-auto mb-3">
                                <img src={profileImage} alt="Profile" className="rounded" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                <button className="edit-profile-btn" type="button" aria-label="Edit profile">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M11.13 1.7l2.17 2.17a1.5 1.5 0 010 2.12L4.38 14.17H1.5V11.3l8.63-8.63a1.5 1.5 0 012.12 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="eyebrow d-block mb-2">Full Name</label>
                            <input className="form-control finvo-input" defaultValue="Alexander Sterling" />
                        </div>
                        <div className="mb-3">
                            <label className="eyebrow d-block mb-2">Email Address</label>
                            <input className="form-control finvo-input" defaultValue="alex@finvo.pro" />
                        </div>
                    </div>
                </div>

                {/* Business Details */}
                <div className="col-lg-6">
                    <div className="settings-section">
                        <h3 className="eyebrow mb-4">Business Details</h3>
                        <div className="mb-3">
                            <label className="eyebrow d-block mb-2">Entity Name</label>
                            <input className="form-control finvo-input" defaultValue="Sterling Architecture Ltd." />
                        </div>
                        <div className="mb-3">
                            <label className="eyebrow d-block mb-2">Operational Currency</label>
                            <select className="form-control finvo-input">
                                <option>Nigerian Naira (₦)</option>
                                <option>US Dollar ($)</option>
                                <option>Euro (€)</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="eyebrow d-block mb-2">Tax Identification Number</label>
                            <input className="form-control finvo-input" defaultValue="NG-092033481-001" placeholder="TIN / VAT" />
                        </div>
                        <div className="mb-3">
                            <label className="eyebrow d-block mb-2">Business Logo</label>
                            <div className="d-flex gap-2">
                                <div className="logo-preview rounded" style={{ width: '44px', height: '44px', background: '#0f172a', border: '1px solid var(--finvo-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Building2 size={20} className="text-muted" />
                                </div>
                                <button className="btn btn-outline-secondary" type="button">
                                    <Upload size={16} className="me-2" /> Upload Logo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Notification Engine & Billing */}
            <div className="row g-4">
                {/* Notification Engine */}
                <div className="col-lg-6">
                    <div className="settings-section">
                        <h3 className="eyebrow mb-3">Notification Engine</h3>
                        {/* settings should be loaded from backend and PATCHed when toggles change. */}
                        <div className="d-grid gap-3">
                            {settings.map((item) => (
                                <label className="toggle-row" key={item.key}>
                                    <div className="toggle-label">
                                        {item.icon && <span className="me-2">{item.icon}</span>}
                                        <div>
                                            <span className="d-block">{item.label}</span>
                                            {item.description && <span className="small text-secondary">{item.description}</span>}
                                        </div>
                                    </div>
                                    <input type="checkbox" defaultChecked={item.enabled} />
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Billing & Subscription */}
                <div className="col-lg-6">
                    <div className="settings-section">
                        <h3 className="eyebrow mb-3">Billing & Subscription</h3>
                        <div className="billing-card p-3 rounded mb-3" style={{ background: '#0a1c3d', border: '1px solid var(--finvo-primary)' }}>
                            <div className="d-flex align-items-start justify-content-between">
                                <div>
                                    <div className="d-flex align-items-center mb-2">
                                        <span className="badge badge-primary me-2">Current Plan</span>
                                    </div>
                                    <p className="card-title mb-1">Enterprise Plan Active</p>
                                    <p className="small text-secondary mb-0">Next renewal: Oct 12, 2024 (Annual Cycle)</p>
                                </div>
                            </div>
                        </div>
                        <div className="payment-method p-3 rounded" style={{ background: 'transparent', border: '1px solid var(--finvo-border)' }}>
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div className="d-flex align-items-center">
                                    <span className="small text-muted me-2">VISA</span>
                                    <span className="text-muted">•••• 8829</span>
                                </div>
                                <a href="#" className="small text-primary">Manage Cards</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex justify-content-end gap-3 mt-5">
                <button className="btn btn-outline-secondary" type="button">Discard Changes</button>
                <button className="btn btn-primary" type="button">Commit Updates</button>
            </div>
        </div>
    )
}

export default SettingsView
