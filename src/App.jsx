import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
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

import LandingPage from './views/LandingPage'
import LoginPage from './views/LoginPage'
import SignupPage from './views/SignupPage'
import DashboardView from './views/DashboardView'
import InvoicesView from './views/InvoicesView'
import ClientsView from './views/ClientsView'
import SettingsView from './views/SettingsView'

function App() {
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false)
  const [clients, setClients] = useState(
    MOCK_CLIENTS.map((client, index) => ({
      ...client,
      id: client.id ?? `client-${index + 1}`,
    })),
  )
  const [invoices, setInvoices] = useState(MOCK_INVOICES)

  const handleUpdateClient = (clientId, payload) => {
    setClients((prev) =>
      prev.map((client) =>
        client.id === clientId
          ? {
            ...client,
            ...payload,
          }
          : client,
      ),
    )
  }

  const handleDeleteClient = (clientId) => {
    setClients((prev) => prev.filter((client) => client.id !== clientId))
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
          element={<DashboardLayout onNewInvoice={() => setInvoiceModalOpen(true)} />}
        >
          <Route
            path="/dashboard"
            element={
              <DashboardView
                stats={MOCK_STATS}
                revenue={MOCK_REVENUE}
                clientShare={MOCK_CLIENT_SHARE}
                taxSummary={MOCK_TAX_SUMMARY}
              />
            }
          />
          <Route
            path="/invoices"
            element={
              <InvoicesView
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
                onUpdateClient={handleUpdateClient}
                onDeleteClient={handleDeleteClient}
              />
            }
          />
          <Route path="/settings" element={<SettingsView settings={MOCK_SETTINGS} />} />
        </Route>
      </Routes>

      <InvoiceModal open={invoiceModalOpen} onClose={() => setInvoiceModalOpen(false)} />
    </BrowserRouter>
  )
}

export default App
