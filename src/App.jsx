import { useState, useRef, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import InvoiceModal from './components/organisms/InvoiceModal'
import {
  MOCK_CLIENTS,
  MOCK_CLIENT_SHARE,
  MOCK_INVOICES,
  MOCK_REVENUE,
  MOCK_SETTINGS,
  MOCK_STATS,
  MOCK_TAX_SUMMARY,
} from './data/mockData'

import PublicLayout from './layouts/PublicLayout'
import AuthLayout from './layouts/AuthLayout'
import DashboardLayout from './layouts/DashboardLayout'

import { clearToken, getToken, createCustomer, getAllCustomers, updateCustomer, deleteCustomer } from './api/auth'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './views/LandingPage'
import LoginPage from './views/LoginPage'
import SignupPage from './views/SignupPage'
import NotFound from './views/NotFound'
import DashboardView from './views/DashboardView'
import InvoicesView from './views/InvoicesView'
import ClientsView from './views/ClientsView'
import SettingsView from './views/SettingsView'
import SupportView from './views/SupportView'

function App() {
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false)
  const [clientCreateOpen, setClientCreateOpen] = useState(false)
  const invoicesViewRef = useRef(null)

  const [clients, setClients] = useState([])
  const [invoices, setInvoices] = useState(MOCK_INVOICES)

  const fetchClients = async () => {
    const token = getToken()
    if (!token) return

    try {
      const customerList = await getAllCustomers()
      setClients(customerList)
      console.log('[APP] Customers fetched:', customerList.length)
    } catch (err) {
      console.error('[APP] Error fetching customers:', err.message)
    }
  }

  const fetchInvoices = async () => {
    const token = getToken()
    if (!token) return

    try {
      const response = await fetch(
        'https://backend-oxom.onrender.com/invoice/list',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json().catch(() => ({}))

      if (response.ok) {
        const invoiceList = Array.isArray(data) ? data : data.invoices || data.data || []
        setInvoices(invoiceList)
        console.log('Dashboard invoices updated:', invoiceList.length)
      }
    } catch (err) {
      console.error('Error fetching invoices:', err.message)
    }
  }

  // Fetch customers and invoices on mount
  useEffect(() => {
    fetchClients()
    fetchInvoices()
  }, [])

  const handleInvoiceCreated = () => {
    // Refresh both dashboard and invoice list
    fetchInvoices()
    if (invoicesViewRef.current) {
      invoicesViewRef.current.refreshInvoices()
    }
  }

  const handleUpdateClient = async (clientId, payload) => {
    try {
      console.log('[CLIENT] handleUpdateClient called with:', { clientId, payload })

      // Call the backend API to update customer
      const response = await updateCustomer(clientId, payload)
      console.log('[CLIENT] Raw response from API:', response)

      // Build the update with all fields
      const mappedUpdate = {
        id: clientId, // Use the provided clientId as ID
        name: response.name || payload.name,
        email: response.email || payload.email,
        revenue: response.revenue !== undefined ? response.revenue : (payload.revenue || 0),
      }

      console.log('[CLIENT] Mapped update object:', mappedUpdate)

      // Update local state with mapped response
      setClients((prev) => {
        const updated = prev.map((client) =>
          client.id === clientId ? { ...client, ...mappedUpdate } : client,
        )
        console.log('[CLIENT] New clients state after update:', updated.find(c => c.id === clientId))
        return updated
      })

      console.log('[CLIENT] ✓ Customer updated successfully')
    } catch (error) {
      console.error('[CLIENT] ✗ Error updating client:', error.message)
      throw error
    }
  }

  const handleCreateClient = async (payload) => {
    try {
      console.log('[CLIENT] handleCreateClient called with:', payload)

      // Call the backend API to create customer
      const response = await createCustomer(payload)
      console.log('[CLIENT] Response from API:', response)

      // Add the created customer to local state with response data
      setClients((prev) => {
        const nextClient = {
          id: response.id || `client-${Date.now()}`,
          name: response.name || payload.name,
          email: response.email || payload.email,
          revenue: response.revenue || payload.revenue,
        }
        console.log('[CLIENT] Adding customer to state:', nextClient)
        console.log('[CLIENT] Total clients after add:', prev.length + 1)
        return [...prev, nextClient]
      })

      setClientCreateOpen(false)
      console.log('[CLIENT] ✓ Customer created and modal closed')
      return response
    } catch (error) {
      console.error('[CLIENT] ✗ Error creating client:', error.message)
      throw error
    }
  }

  const handleDeleteClient = async (clientId) => {
    try {
      console.log('[CLIENT] handleDeleteClient called with:', clientId)

      // Call the backend API to delete customer
      await deleteCustomer(clientId)
      console.log('[CLIENT] Backend deletion successful')

      // Remove from local state
      setClients((prev) => prev.filter((client) => client.id !== clientId))
      console.log('[CLIENT] ✓ Customer deleted successfully')
    } catch (error) {
      console.error('[CLIENT] ✗ Error deleting client:', error.message)
      throw error
    }
  }

  const handleInvoiceStatusChange = (invoiceId, status) => {
    setInvoices((prev) =>
      prev.map((invoice) =>
        invoice.id === invoiceId
          ? {
            ...invoice,
            status,
          }
          : invoice,
      ),
    )
  }

  const handleLogout = () => {
    clearToken()
    window.location.href = '/login'
  }

  // Integration note:
  // Replace MOCK_* props with data fetched from your backend (REST/GraphQL).
  // Recommended flow: fetch once after login, store in state/context, then pass to views.

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout
                onNewInvoice={() => setInvoiceModalOpen(true)}
                onAddClient={() => setClientCreateOpen((prev) => !prev)}
                onLogout={handleLogout}
              />
            </ProtectedRoute>
          }
        >
          <Route
            path="/dashboard"
            element={
              <DashboardView
                stats={MOCK_STATS}
                revenue={MOCK_REVENUE}
                clientShare={MOCK_CLIENT_SHARE}
                taxSummary={MOCK_TAX_SUMMARY}
                invoices={invoices}
              />
            }
          />
          <Route
            path="/invoices"
            element={
              <InvoicesView
                ref={invoicesViewRef}
                invoices={invoices}
                onStatusChange={handleInvoiceStatusChange}
              />
            }
          />
          <Route
            path="/clients"
            element={
              <ClientsView
                clients={clients}
                createClientOpen={clientCreateOpen}
                onCancelCreateClient={() => setClientCreateOpen(false)}
                onCreateClient={handleCreateClient}
                onUpdateClient={handleUpdateClient}
                onDeleteClient={handleDeleteClient}
              />
            }
          />
          <Route path="/settings" element={<SettingsView settings={MOCK_SETTINGS} />} />
          <Route path="/support" element={<SupportView />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      <InvoiceModal
        open={invoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
        onInvoiceCreated={handleInvoiceCreated}
        clients={clients}
      />
    </BrowserRouter>
  )
}

export default App
