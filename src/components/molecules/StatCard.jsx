import { ArrowUpRight, Clock3, Users } from 'lucide-react'

const iconByTrend = {
    up: ArrowUpRight,
    pending: Clock3,
    neutral: Users,
}

function StatCard({ title, value, meta, trend }) {
    const Icon = iconByTrend[trend] ?? Users

    return (
        <div className="finvo-card stat-card h-100">
            <div className="d-flex justify-content-between align-items-start mb-3">
                <p className="eyebrow mb-0">{title}</p>
                <Icon size={18} className={`stat-icon stat-${trend}`} />
            </div>
            <h3 className="stat-value">{value}</h3>
            <p className={`stat-meta stat-${trend}`}>{meta}</p>
        </div>
    )
}

export default StatCard
