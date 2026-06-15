import { useMemo, useState } from 'react'
import { Edit2, Trash2, X, AlertCircle } from 'lucide-react'
import ClientCard from '../components/molecules/ClientCard'

function ClientsView({
    clients,
    createClientOpen,
    onCancelCreateClient,
    onCreateClient,
    onUpdateClient,
    onDeleteClient,
}) {
    const [createForm, setCreateForm] = useState({
        name: '',
        email: '',
    })

    const [editingId, setEditingId] = useState(null)

    const [form, setForm] = useState({
        name: '',
        email: '',
    })

    const [isCreating, setIsCreating] = useState(false)
    const [isSavingEdit, setIsSavingEdit] = useState(false)
    const [isDeleting, setIsDeleting] = useState(null)

    const [createError, setCreateError] = useState('')
    const [editError, setEditError] = useState('')

    const editingClient = useMemo(
        () => clients.find((client) => client._id === editingId),
        [clients, editingId]
    )

    const handleStartEdit = (client) => {
        setEditingId(client._id)

        setForm({
            name: client.name || '',
            email: client.email || '',
        })
    }

    const handleCancelEdit = () => {
        setEditingId(null)
        setForm({
            name: '',
            email: '',
        })
    }

    const handleCreateSubmit = async (event) => {
        event.preventDefault()

        setIsCreating(true)
        setCreateError('')

        try {
            await onCreateClient({
                name: createForm.name,
                email: createForm.email,
            })

            setCreateForm({
                name: '',
                email: '',
            })
        } catch (error) {
            setCreateError(
                error.message || 'Failed to create customer. Please try again.'
            )
            console.error('[CLIENTS_VIEW] Error creating client:', error)
        } finally {
            setIsCreating(false)
        }
    }

    const handleSaveEdit = async (event) => {
        event.preventDefault()

        if (!editingId) {
            return
        }

        setIsSavingEdit(true)
        setEditError('')

        try {
            console.log('Editing ID:', editingId)

            await onUpdateClient(editingId, {
                name: form.name,
                email: form.email,
            })

            handleCancelEdit()
        } catch (error) {
            setEditError(
                error.message || 'Failed to update customer. Please try again.'
            )
            console.error('[CLIENTS_VIEW] Error updating client:', error)
        } finally {
            setIsSavingEdit(false)
        }
    }

    const handleDelete = async (clientId) => {
        setIsDeleting(clientId)

        try {
            await onDeleteClient(clientId)

            if (editingId === clientId) {
                handleCancelEdit()
            }
        } catch (error) {
            console.error('[CLIENTS_VIEW] Error deleting client:', error)
            alert(`Failed to delete customer: ${error.message}`)
        } finally {
            setIsDeleting(null)
        }
    }

    return (
        <div className="row g-3 g-lg-4">
            {createClientOpen && (
                <div className="col-12">
                    <section className="finvo-card">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h3 className="card-title mb-0">
                                Create New Client
                            </h3>

                            <button
                                className="btn btn-outline-light btn-sm"
                                type="button"
                                onClick={onCancelCreateClient}
                                disabled={isCreating}
                            >
                                <X size={14} className="me-1" />
                                Close
                            </button>
                        </div>

                        {createError && (
                            <div
                                className="alert alert-danger d-flex align-items-center mb-3"
                                role="alert"
                            >
                                <AlertCircle
                                    size={18}
                                    className="me-2"
                                />
                                <span>{createError}</span>
                            </div>
                        )}

                        <form
                            className="row g-3"
                            onSubmit={handleCreateSubmit}
                        >
                            <div className="col-md-6">
                                <label className="eyebrow d-block mb-2">
                                    Name
                                </label>

                                <input
                                    className="form-control finvo-input"
                                    value={createForm.name}
                                    onChange={(event) =>
                                        setCreateForm((prev) => ({
                                            ...prev,
                                            name: event.target.value,
                                        }))
                                    }
                                    placeholder="Client name"
                                    required
                                    disabled={isCreating}
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="eyebrow d-block mb-2">
                                    Email
                                </label>

                                <input
                                    className="form-control finvo-input"
                                    type="email"
                                    value={createForm.email}
                                    onChange={(event) =>
                                        setCreateForm((prev) => ({
                                            ...prev,
                                            email: event.target.value,
                                        }))
                                    }
                                    placeholder="name@company.com"
                                    required
                                    disabled={isCreating}
                                />
                            </div>

                            <div className="col-12 d-flex justify-content-end">
                                <button
                                    className="btn btn-primary"
                                    type="submit"
                                    disabled={isCreating}
                                >
                                    {isCreating ? 'Adding...' : 'Add Client'}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}

            {editingId && (
                <div className="col-12">
                    <section className="finvo-card">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h3 className="card-title mb-0">
                                Edit Client
                            </h3>

                            <button
                                className="btn btn-outline-light btn-sm"
                                type="button"
                                onClick={handleCancelEdit}
                                disabled={isSavingEdit}
                            >
                                <X size={14} className="me-1" />
                                Cancel
                            </button>
                        </div>

                        {editError && (
                            <div
                                className="alert alert-danger d-flex align-items-center mb-3"
                                role="alert"
                            >
                                <AlertCircle
                                    size={18}
                                    className="me-2"
                                />
                                <span>{editError}</span>
                            </div>
                        )}

                        <form
                            className="row g-3"
                            onSubmit={handleSaveEdit}
                        >
                            <div className="col-md-6">
                                <label className="eyebrow d-block mb-2">
                                    Name
                                </label>

                                <input
                                    className="form-control finvo-input"
                                    value={form.name}
                                    onChange={(event) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            name: event.target.value,
                                        }))
                                    }
                                    required
                                    disabled={isSavingEdit}
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="eyebrow d-block mb-2">
                                    Email
                                </label>

                                <input
                                    className="form-control finvo-input"
                                    type="email"
                                    value={form.email}
                                    onChange={(event) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            email: event.target.value,
                                        }))
                                    }
                                    required
                                    disabled={isSavingEdit}
                                />
                            </div>

                            <div className="col-12 d-flex justify-content-end">
                                <button
                                    className="btn btn-primary"
                                    type="submit"
                                    disabled={isSavingEdit}
                                >
                                    {isSavingEdit
                                        ? 'Saving...'
                                        : 'Save Changes'}
                                </button>
                            </div>
                        </form>

                        {!editingClient && (
                            <p className="text-secondary mt-3 mb-0">
                                This client no longer exists.
                            </p>
                        )}
                    </section>
                </div>
            )}

            {clients.map((client) => (
                <div
                    className="col-lg-3 col-md-6 col-12"
                    key={client._id}
                >
                    <ClientCard client={client}>
                        <div className="d-flex gap-2 mt-3">
                            <button
                                className="btn btn-sm btn-outline-light flex-grow-1"
                                type="button"
                                onClick={() =>
                                    handleStartEdit(client)
                                }
                                disabled={
                                    isSavingEdit ||
                                    isDeleting
                                }
                            >
                                <Edit2
                                    size={14}
                                    className="me-1"
                                />
                                Edit
                            </button>

                            <button
                                className="btn btn-sm btn-outline-danger flex-grow-1"
                                type="button"
                                onClick={() =>
                                    handleDelete(client._id)
                                }
                                disabled={
                                    isDeleting === client._id
                                }
                            >
                                <Trash2
                                    size={14}
                                    className="me-1"
                                />
                                {isDeleting === client._id
                                    ? 'Deleting...'
                                    : 'Delete'}
                            </button>
                        </div>
                    </ClientCard>
                </div>
            ))}

            {clients.length === 0 && (
                <div className="col-12">
                    <section className="finvo-card">
                        <p className="text-secondary mb-0">
                            No clients available.
                        </p>
                    </section>
                </div>
            )}
        </div>
    )
}

export default ClientsView