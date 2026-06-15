// Minimal auth helper: get/set token and fetch helper that attaches Authorization header
const TOKEN_KEY = 'finvoToken'
const USERNAME_KEY = 'auth_username'
const EMAIL_KEY = 'auth_email'

export function getToken() {
    try {
        return localStorage.getItem(TOKEN_KEY)
    } catch (e) {
        return null
    }
}

export function setToken(token) {
    try {
        if (token) localStorage.setItem(TOKEN_KEY, token)
        else localStorage.removeItem(TOKEN_KEY)
    } catch (e) {
        // ignore storage errors
    }
}

export function setUsername(name) {
    try {
        if (name) localStorage.setItem(USERNAME_KEY, name)
        else localStorage.removeItem(USERNAME_KEY)
    } catch (e) {
        // ignore storage errors
    }
}

export function getUsername() {
    try {
        return localStorage.getItem(USERNAME_KEY)
    } catch (e) {
        return null
    }
}

export function setEmail(email) {
    try {
        if (email) localStorage.setItem(EMAIL_KEY, email)
        else localStorage.removeItem(EMAIL_KEY)
    } catch (e) {
        // ignore storage errors
    }
}

export function getEmail() {
    try {
        return localStorage.getItem(EMAIL_KEY)
    } catch (e) {
        return null
    }
}

function deriveUsername(payload, fallbackEmail) {
    const user = payload?.user || {}
    const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim()

    return (
        user?.username ||
        user?.name ||
        fullName ||
        payload?.username ||
        payload?.name ||
        (typeof fallbackEmail === 'string' ? fallbackEmail.split('@')[0] : '') ||
        ''
    )
}

export function saveAuthSession(payload, fallbackEmail = '') {
    const token = payload?.token
    if (token) setToken(token)

    const email = payload?.user?.email || payload?.email || fallbackEmail || ''
    if (email) setEmail(email)

    const username = deriveUsername(payload, fallbackEmail)
    if (username) setUsername(username)
}

export function clearToken() {
    try {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USERNAME_KEY)
        localStorage.removeItem(EMAIL_KEY)
    } catch (e) { }
}

export async function fetchWithAuth(url, opts = {}) {
    const token = getToken()
    const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) }
    if (token) headers.Authorization = `Bearer ${token}`
    const res = await fetch(url, { ...opts, headers })
    return res
}

export async function createCustomer(customerData) {
    try {
        console.log('[CUSTOMER] Creating customer with data:', customerData)
        console.log('[CUSTOMER] Token present:', !!getToken())

        const response = await fetchWithAuth(
            'https://backend-1-rhpy.onrender.com/customer/create',
            {
                method: 'POST',
                body: JSON.stringify(customerData),
            }
        )

        console.log('[CUSTOMER] Response status:', response.status, response.statusText)

        const data = await response.json().catch(() => ({}))
        console.log('[CUSTOMER] Raw response:', JSON.stringify(data))

        if (!response.ok) {
            console.error('[CUSTOMER] Backend error (status', response.status + '):', data)
            throw new Error(data.message || `Customer creation failed (${response.status})`)
        }

        // Backend returns: { message: "...", customer: { _id or owner, name, email, ... } }
        // Map to frontend format: { id, name, email, revenue }
        const customerResponse = data.customer || data
        const mappedCustomer = {
            id: customerResponse._id || customerResponse.owner || customerResponse.id,
            name: customerResponse.name,
            email: customerResponse.email,
            revenue: customerResponse.revenue || customerData.revenue || 0,
        }

        console.log('[CUSTOMER] ✓ Mapped customer:', mappedCustomer)
        return mappedCustomer
    } catch (error) {
        console.error('[CUSTOMER] ✗ Error creating customer:', error.message)
        throw error
    }
}

export async function getAllCustomers() {
    try {
        const response = await fetchWithAuth(
            'https://backend-1-rhpy.onrender.com/customer/all',
            {
                method: 'GET',
            }
        )

        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
            console.error('[CUSTOMER] Error fetching customers:', data)
            return []
        }

        // Get array from response
        const customers = Array.isArray(data) ? data : data.customers || data.data || []
        console.log('[CUSTOMER] Fetched customers:', customers.length)

        // Map each customer to ensure fields are correctly named
        const mappedCustomers = customers.map((customer) => ({
            id: customer._id || customer.owner || customer.id,
            name: customer.name,
            email: customer.email,
            revenue: customer.revenue || 0,
        }))

        return mappedCustomers
    } catch (error) {
        console.error('[CUSTOMER] Error fetching customers:', error.message)
        return []
    }
}

export async function updateCustomer(customerId, customerData) {
    try {
        console.log('[CUSTOMER] Updating customer:', { customerId, customerData })

        const response = await fetchWithAuth(
            `https://backend-1-rhpy.onrender.com/customer/${customerId}`,
            {
                method: 'PUT',
                body: JSON.stringify(customerData),
            }
        )

        const data = await response.json().catch(() => ({}))
        console.log('[CUSTOMER] Update response status:', response.status)
        console.log('[CUSTOMER] Update response data:', JSON.stringify(data))

        if (!response.ok) {
            console.error('[CUSTOMER] Backend error:', data)
            throw new Error(data.message || 'Customer update failed')
        }

        // Handle different response formats from backend
        // Format 1: {message: "...", customer: {...}}
        // Format 2: {success: true, customer: {...}} or {customer: {...}}
        // Format 3: Direct customer object

        let customerResponse = data
        if (data.customer) {
            customerResponse = data.customer
            console.log('[CUSTOMER] Extracted from data.customer')
        } else if (data._id || data.owner || data.name) {
            // Already a customer object
            console.log('[CUSTOMER] Response is direct customer object')
        }

        const mappedCustomer = {
            id: customerResponse._id || customerResponse.owner || customerResponse.id,
            name: customerResponse.name,
            email: customerResponse.email,
            revenue: customerResponse.revenue || 0,
        }

        console.log('[CUSTOMER] ✓ Mapped customer:', mappedCustomer)
        return mappedCustomer
    } catch (error) {
        console.error('[CUSTOMER] Error updating customer:', error.message)
        throw error
    }
}

export async function deleteCustomer(customerId) {
    try {
        const response = await fetchWithAuth(
            `https://backend-1-rhpy.onrender.com/customer/${customerId}`,
            {
                method: 'DELETE',
            }
        )

        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
            console.error('[CUSTOMER] Backend error:', data)
            throw new Error(data.message || 'Customer deletion failed')
        }

        console.log('[CUSTOMER] Customer deleted successfully:', data)
        return data
    } catch (error) {
        console.error('[CUSTOMER] Error deleting customer:', error.message)
        throw error
    }
}

export default {
    getToken,
    setToken,
    setUsername,
    setEmail,
    getUsername,
    getEmail,
    saveAuthSession,
    clearToken,
    fetchWithAuth,
    createCustomer,
    getAllCustomers,
    updateCustomer,      // ← Add this
    deleteCustomer,
}
