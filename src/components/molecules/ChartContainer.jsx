function ChartContainer({ title, subtitle, actions, children }) {
    return (
        <section className="finvo-card chart-card h-100">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                <div>
                    <h3 className="card-title mb-1">{title}</h3>
                    <p className="eyebrow mb-0">{subtitle}</p>
                </div>
                {actions ? <div>{actions}</div> : null}
            </div>
            <div>{children}</div>
        </section>
    )
}

export default ChartContainer
