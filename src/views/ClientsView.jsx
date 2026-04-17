import { useMemo, useState } from 'react'
import { Edit2, Trash2, X } from 'lucide-react'
import ClientCard from '../components/molecules/ClientCard'

function ClientsView({ clients, onUpdateClient, onDeleteClient }) {
    const [editingId, setEditingId] = useState(null)
    const [form, setForm] = useState({ name: '', email: '', revenue: '' })

    const editingClient = useMemo(
        () => clients.find((client) => client.id === editingId),
        [clients, editingId],
    )

    const handleStartEdit = (client) => {
        setEditingId(client.id)
        setForm({
            name: client.name,
            email: client.email,
            revenue: client.revenue,
        })
    }

    const handleCancelEdit = () => {
        setEditingId(null)
        setForm({ name: '', email: '', revenue: '' })
    }

    const handleSaveEdit = (event) => {
        event.preventDefault()
        if (!editingId) {
            return
        }

        onUpdateClient(editingId, {
            name: form.name,
            email: form.email,
            revenue: form.revenue,
        })
        handleCancelEdit()
    }

    const handleDelete = (clientId) => {
        onDeleteClient(clientId)
        if (editingId === clientId) {
            handleCancelEdit()
        }
    }

    return (
        <div className="row g-3 g-lg-4">
            {editingId && (
                <div className="col-12">
                    <section className="finvo-card">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h3 className="card-title mb-0">Edit Client</h3>
                            <button className="btn btn-outline-light btn-sm" type="button" onClick={handleCancelEdit}>
                                <X size={14} className="me-1" /> Cancel
                            </button>
                        </div>

                        <form className="row g-3" onSubmit={handleSaveEdit}>
                            <div className="col-md-4">
                                <label className="eyebrow d-block mb-2">Name</label>
                                <input
                                    className="form-control finvo-input"
                                    value={form.name}
                                    onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                                    required
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="eyebrow d-block mb-2">Email</label>
                                <input
                                    className="form-control finvo-input"
                                    type="email"
                                    value={form.email}
                                    onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                                    required
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="eyebrow d-block mb-2">Revenue</label>
                                <input
                                    className="form-control finvo-input"
                                    value={form.revenue}
                                    onChange={(event) => setForm((prev) => ({ ...prev, revenue: event.target.value }))}
                                />
                            </div>
                            <div className="col-12 d-flex justify-content-end">
                                <button className="btn btn-primary" type="submit">Save Changes</button>
                            </div>
                        </form>

                        {!editingClient && (
                            <p className="text-secondary mt-3 mb-0">This client no longer exists.</p>
                        )}
                    </section>
                </div>
            )}

            {/* clients should come from your clients endpoint and include stable unique IDs. */}
            {clients.map((client) => (
                <div className="col-lg-3 col-md-6 col-12" key={client.id}>
                    <ClientCard client={client}>
                        <div className="d-flex gap-2 mt-3">
                            <button className="btn btn-sm btn-outline-light flex-grow-1" type="button" onClick={() => handleStartEdit(client)}>
                                <Edit2 size={14} className="me-1" /> Edit
                            </button>
                            <button className="btn btn-sm btn-outline-danger flex-grow-1" type="button" onClick={() => handleDelete(client.id)}>
                                <Trash2 size={14} className="me-1" /> Delete
                            </button>
                        </div>
                    </ClientCard>
                </div>
            ))}

            {clients.length === 0 && (
                <div className="col-12">
                    <section className="finvo-card">
                        <p className="text-secondary mb-0">No clients available.</p>
                    </section>
                </div>
            )}
        </div>
    )
}

export default ClientsView
