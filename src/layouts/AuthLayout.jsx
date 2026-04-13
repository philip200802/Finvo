import { Outlet } from 'react-router-dom'

function AuthLayout() {
    return (
        <main className="auth-screen">
            <Outlet />
        </main>
    )
}

export default AuthLayout
