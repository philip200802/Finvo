import { Bar, Doughnut } from 'react-chartjs-2'
import { Download, X } from 'lucide-react'
import { useState } from 'react'
import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Tooltip,
} from 'chart.js'
import StatCard from '../components/molecules/StatCard'
import ChartContainer from '../components/molecules/ChartContainer'
import TaxSummaryTable from '../components/molecules/TaxSummaryTable'
import { usePWAInstall } from '../hooks/usePWAInstall'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)

function DashboardView({ stats, revenue, clientShare, taxSummary, invoices = [] }) {
    const { canInstall, handleInstall, isIOS } = usePWAInstall()
    const [showInstallPrompt, setShowInstallPrompt] = useState(false)
    // Calculate stats from invoices
    const calculatedStats = invoices && invoices.length > 0 ? (() => {
        const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0)
        const totalPaid = invoices.reduce((sum, inv) => sum + (inv.amountPaid || 0), 0)
        const pendingCount = invoices.filter(inv => inv.status === 'Pending').length
        const activeClients = new Set(invoices.map(inv => inv.clientName)).size

        return [
            {
                title: 'Total Revenue',
                value: `₦${(totalRevenue / 1000000).toFixed(1)}M`,
                meta: '12.5% from last month',
                icon: '📈',
            },
            {
                title: 'Amount Paid',
                value: `₦${(totalPaid / 1000000).toFixed(1)}M`,
                meta: `From ${invoices.filter(inv => inv.amountPaid > 0).length} invoices`,
                icon: '✓',
            },
            {
                title: 'Pending Invoices',
                value: pendingCount,
                meta: `${pendingCount} invoices awaiting payment`,
                icon: '⏳',
            },
            {
                title: 'Active Clients',
                value: activeClients,
                meta: `${invoices.length} total invoices`,
                icon: '👥',
            },
        ]
    })() : stats
    const barData = {
        labels: revenue.labels,
        datasets: [
            {
                label: 'Revenue',
                data: revenue.revenue,
                backgroundColor: '#2563eb',
                borderRadius: 8,
            }
        ],
    }

    const barOptions = {
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#cbd5e1' } } },
        scales: {
            x: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } },
            y: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } },
        },
    }

    const donutData = {
        labels: clientShare.labels,
        datasets: [
            {
                data: clientShare.values,
                backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#64748b'],
                borderColor: '#0f172a',
            },
        ],
    }

    return (
        <div className="row g-3 g-lg-4">
            {/* PWA Install Prompt */}
            {(canInstall || isIOS) && showInstallPrompt && (
                <div className="col-12">
                    <div className="alert alert-info d-flex align-items-center justify-content-between" role="alert">
                        <div className="d-flex align-items-center">
                            <Download size={20} className="me-2" />
                            <div>
                                <strong>Install Finvo</strong>
                                <p className="mb-0 text-secondary small">
                                    {isIOS
                                        ? 'Tap Share and select "Add to Home Screen" to install Finvo'
                                        : 'Install Finvo as an app on your device for offline access and faster performance'}
                                </p>
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            {!isIOS && (
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => {
                                        handleInstall()
                                        setShowInstallPrompt(false)
                                    }}
                                >
                                    Install
                                </button>
                            )}
                            <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => setShowInstallPrompt(false)}
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Download Button (always visible) */}
            {(canInstall || isIOS) && !showInstallPrompt && (
                <div className="col-12">
                    <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => setShowInstallPrompt(true)}
                    >
                        <Download size={16} className="me-2" /> Download App
                    </button>
                </div>
            )}

            {/* Dashboard KPI numbers (cards) come from calculated or mock stats */}
            {calculatedStats.map((stat) => (
                <div className="col-lg-4 col-md-6 col-12" key={stat.title}>
                    <StatCard {...stat} />
                </div>
            ))}

            <div className="col-lg-8 col-12">
                <ChartContainer title="Revenue Analytics" subtitle="Fiscal Year 2026">
                    <div className="chart-wrap">
                        <Bar data={barData} options={barOptions} />
                    </div>
                </ChartContainer>
            </div>

            <div className="col-lg-4 col-12">
                <ChartContainer title="Revenue by Client" subtitle="Current Allocation">
                    <div className="chart-wrap chart-donut">
                        <Doughnut
                            data={donutData}
                            options={{
                                plugins: {
                                    legend: {
                                        position: 'bottom',
                                        labels: {
                                            color: '#cbd5e1',
                                            boxWidth: 10,
                                        },
                                    },
                                },
                            }}
                        />
                    </div>
                </ChartContainer>
            </div>

            <div className="col-12">
                <section className="finvo-card">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h3 className="card-title mb-0">Quarterly Tax Compliance Summary</h3>
                    </div>
                    {/* taxSummary should map to a backend tax/compliance endpoint response. */}
                    <TaxSummaryTable rows={taxSummary} />
                </section>
            </div>
        </div>
    )
}

export default DashboardView
