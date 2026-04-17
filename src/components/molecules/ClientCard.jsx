function ClientCard({ client, children }) {
    return (
        <article className="finvo-card client-card h-100">
            <div className="client-avatar">{client.name.slice(0, 2).toUpperCase()}</div>
            <h3 className="card-title mt-3 mb-1">{client.name}</h3>
            <p className="text-secondary mb-3">{client.email}</p>
            <p className="eyebrow mb-1">Lifetime Revenue</p>
            <p className="text-light fw-semibold fs-5 mb-0">{client.revenue}</p>
            {children}
        </article>
    )
}

export default ClientCard
