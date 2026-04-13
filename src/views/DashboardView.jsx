import { Bar, Doughnut } from 'react-chartjs-2'
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

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)

function DashboardView({ stats, revenue, clientShare, taxSummary }) {
    // ChartJS data is built from API-backed props.
    // Keep this mapping layer so backend field names can change without touching UI markup.
    const barData = {
        labels: revenue.labels,
        datasets: [
            {
                label: 'Revenue',
                data: revenue.revenue,
                backgroundColor: '#2563eb',
                borderRadius: 8,
            },
            {
                label: 'Expenses',
                data: revenue.expenses,
                backgroundColor: '#334155',
                borderRadius: 8,
            },
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
            {/* Dashboard KPI numbers (cards) come from stats[].value and stats[].meta from backend. */}
            {stats.map((stat) => (
                <div className="col-lg-4 col-md-6 col-12" key={stat.title}>
                    <StatCard {...stat} />
                </div>
            ))}

            <div className="col-lg-8 col-12">
                <ChartContainer title="Revenue vs Expenses" subtitle="Fiscal Year 2026">
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
