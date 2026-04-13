import ClientCard from '../components/molecules/ClientCard'

function ClientsView({ clients }) {
    return (
        <div className="row g-3 g-lg-4">
            {/* clients should come from your clients endpoint and include stable unique IDs. */}
            {clients.map((client) => (
                <div className="col-lg-3 col-md-6 col-12" key={client.name}>
                    <ClientCard client={client} />
                </div>
            ))}
        </div>
    )
}

export default ClientsView
