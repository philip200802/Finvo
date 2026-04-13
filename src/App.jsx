import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import InvoiceModal from './components/organisms/InvoiceModal'
import {
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
import SettingsView from './views/SettingsView'

function App() {
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false)

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
          <Route path="/invoices" element={<InvoicesView invoices={MOCK_INVOICES} />} />
          <Route path="/settings" element={<SettingsView settings={MOCK_SETTINGS} />} />
        </Route>
      </Routes>

      <InvoiceModal open={invoiceModalOpen} onClose={() => setInvoiceModalOpen(false)} />
    </BrowserRouter>
  )
}

export default App
