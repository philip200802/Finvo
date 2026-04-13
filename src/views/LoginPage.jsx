import { Building2 } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'

function LoginPage() {
    const navigate = useNavigate()

    // Controlled inputs used to build login request payload.
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSignIn = async (e) => {
        e.preventDefault()

        // This object is the exact data you can send to your login API.
        const loginPayload = {
            email,
            password,
        }

        // Backend integration point:
        // 1) POST loginPayload to your auth endpoint.
        // 2) Handle invalid credentials / network errors.
        // 3) On success, store token/session and redirect.
        void loginPayload

        navigate('/dashboard')
    }

    return (
        <div className="auth-brand text-center mb-4">
            <div className="brand-mark mx-auto mb-3">
                <Building2 size={18} />
            </div>
            <h1 className="brand-title mb-1">Finvo</h1>
            <p className="brand-subtitle mb-0">Architectural Ledger</p>

            <section className="finvo-card auth-card mt-4">
                <h2 className="page-title mb-2">Welcome back</h2>
                <p className="text-secondary mb-4">Secure access to your architectural assets.</p>

                <form onSubmit={handleSignIn} className="d-grid gap-3">
                    <div>
                        <label className="eyebrow d-block mb-2">Corporate Email</label>
                        <input className="form-control finvo-input" placeholder="name@firm.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div>
                        <div className="d-flex justify-content-between mb-2">
                            <label className="eyebrow mb-0">Password</label>
                            <span className="eyebrow text-primary cursor-pointer">Forgot?</span>
                        </div>
                        <input type="password" className="form-control finvo-input" placeholder="........" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button className="btn btn-primary btn-lg w-100" type="submit">
                        Sign In
                    </button>
                </form>

                <p className="text-center text-secondary mt-4 mb-0">
                    New to the Ledger? <Link to="/signup" className="btn btn-link p-0 text-primary">Create Account</Link>
                </p>
            </section>
        </div>
    )
}

export default LoginPage
