import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/organisms/Sidebar'
import Topbar from '../components/organisms/Topbar'

const pageMetadata = {
    dashboard: {
        title: 'Finvo Master Dashboard',
        subtitle: 'Real-time architectural fiscal performance and ledger overview.',
    },
    invoices: {
        title: 'Invoice Ledger',
        subtitle: 'Manage and issue invoices with complete payment visibility.',
    },
    clients: {
        title: 'Client Portfolio',
        subtitle: 'Track client accounts, contacts, and billed revenue in one place.',
    },
    settings: {
        title: 'System Settings',
        subtitle: 'Configure profile, billing, and notification engines.',
    },
}

function DashboardLayout({ onNewInvoice }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const location = useLocation()

    const getViewKey = () => {
        const path = location.pathname.split('/').pop()
        return path || 'dashboard'
    }

    const viewKey = getViewKey()
    const page = pageMetadata[viewKey] || pageMetadata.dashboard

    return (
        <div className="app-shell">
            <Sidebar
                activeView={viewKey}
                onViewChange={() => { }}
                open={sidebarOpen}
                onToggle={(value) => setSidebarOpen(typeof value === 'boolean' ? value : !sidebarOpen)}
                onNewInvoice={onNewInvoice}
            />

            <main className="app-main">
                <Topbar title={page.title} subtitle={page.subtitle} onNewInvoice={onNewInvoice} />

                <section className="content-wrap content-fade-in">
                    <Outlet />
                </section>
            </main>
        </div>
    )
}

export default DashboardLayout
