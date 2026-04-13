// Temporary UI seed data.
// Replace each MOCK_* export with backend response mapping once APIs are ready.

export const MOCK_STATS = [
    {
        title: 'Total Revenue',
        value: 'NaN',
        meta: '12.5% from last month',
        trend: 'up',
    },
    {
        title: 'Pending Invoices',
        value: 'NaN',
        meta: '8 invoices awaiting payment',
        trend: 'pending',
    },
    {
        title: 'Active Clients',
        value: '24',
        meta: '3 new contracts this week',
        trend: 'neutral',
    },
]

export const MOCK_REVENUE = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    revenue: [1200000, 1600000, 1900000, 2100000, 2450000, 2800000],
    expenses: [800000, 1050000, 1100000, 1300000, 1520000, 1660000],
}

export const MOCK_CLIENT_SHARE = {
    labels: ['Meridian Arch', 'Skyline Kinetica', 'Oasis Estates', 'Gridworks'],
    values: [32, 26, 22, 20],
}

export const MOCK_TAX_SUMMARY = [
    { quarter: 'Q1 2026', taxableIncome: 'NaN', vat: 'NaN', status: 'Filed' },
    { quarter: 'Q2 2026', taxableIncome: 'NaN', vat: 'NaN', status: 'Pending' },
    { quarter: 'Q3 2026', taxableIncome: 'NaN', vat: 'NaN', status: 'Draft' },
]

export const MOCK_INVOICES = [
    {
        client: 'Meridian Arch',
        project: 'Residential Concept',
        id: 'INV-2026-089',
        issueDate: 'Oct 12, 2026',
        amount: 'NaN',
        status: 'Paid',
    },
    {
        client: 'Skyline Kinetica',
        project: 'Urban Planning Phase II',
        id: 'INV-2026-091',
        issueDate: 'Oct 14, 2026',
        amount: 'NaN',
        status: 'Pending',
    },
    {
        client: 'Oasis Estates',
        project: 'Landscape Design',
        id: 'INV-2026-093',
        issueDate: 'Oct 15, 2026',
        amount: 'NaN',
        status: 'Overdue',
    },
]

export const MOCK_CLIENTS = [
    {
        name: 'StructArch',
        email: 'accounts@structarch.com',
        revenue: 'NaN',
    },
    {
        name: 'Monoform',
        email: 'finance@monoform.io',
        revenue: 'NaN',
    },
    {
        name: 'Void Studios',
        email: 'billing@voidstudios.com',
        revenue: 'NaN',
    },
    {
        name: 'Gridworks',
        email: 'payables@gridworks.com',
        revenue: 'NaN',
    },
]

export const MOCK_SETTINGS = [
    { key: 'paymentReceipts', label: 'Payment Receipts', description: 'Send PDF copies of all settled invoices.', enabled: true },
    { key: 'overdueAlerts', label: 'Overdue Alerts', description: 'Immediate notification for 24h past due.', enabled: false },
]
