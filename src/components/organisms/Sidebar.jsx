import { Building2, CircleHelp, FileText, LayoutDashboard, LogOut, Menu, Settings, Users, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import LogoutModal from './LogoutModal'

const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { key: 'invoices', label: 'Invoices', icon: FileText, path: '/invoices' },
    { key: 'clients', label: 'Clients', icon: Users, path: '/clients' },
    { key: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
]

function Sidebar({ open, onToggle, onNewInvoice, onLogout }) {
    const [logoutModalOpen, setLogoutModalOpen] = useState(false)
    const location = useLocation()

    const isActive = (path) => location.pathname === path

    return (
        <>
            <button type="button" className="mobile-menu-btn d-lg-none" onClick={onToggle} aria-label="Toggle navigation">
                <Menu size={20} />
            </button>
            <div className={`sidebar-backdrop ${open ? 'show' : ''}`} onClick={onToggle} aria-hidden="true" />
            <aside className={`finvo-sidebar ${open ? 'show' : ''}`}>
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <div className="d-flex align-items-center gap-2">
                        <div className="brand-mark">
                            <Building2 size={18} />
                        </div>
                        <div>
                            <h1 className="brand-title mb-0">Finvo</h1>
                            <p className="brand-subtitle mb-0">Architectural Ledger</p>
                        </div>
                    </div>
                    <button type="button" className="icon-btn d-lg-none" onClick={onToggle} aria-label="Close navigation">
                        <X size={15} />
                    </button>
                </div>

                <nav className="sidebar-nav flex-grow-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon
                        return (
                            <Link
                                key={item.key}
                                to={item.path}
                                className={`side-link ${isActive(item.path) ? 'active' : ''}`}
                                onClick={() => onToggle(false)}
                            >
                                <Icon size={18} />
                                <span>{item.label}</span>
                            </Link>
                        )
                    })}
                </nav>

                <button type="button" className="btn btn-primary w-100 mt-3" onClick={onNewInvoice}>
                    + Create Invoice
                </button>

                <div className="sidebar-footer mt-3 pt-3">
                    <Link
                        to="/support"
                        className="side-link side-link-utility w-100"
                        onClick={() => onToggle(false)}
                    >
                        <CircleHelp size={18} />
                        <span>Support</span>
                    </Link>
                    <button
                        type="button"
                        className="side-link side-link-utility w-100"
                        onClick={() => setLogoutModalOpen(true)}
                    >
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <LogoutModal
                open={logoutModalOpen}
                onConfirm={() => {
                    setLogoutModalOpen(false)
                    onToggle(false)
                    onLogout()
                }}
                onCancel={() => setLogoutModalOpen(false)}
            />
        </>
    )
}

export default Sidebar
