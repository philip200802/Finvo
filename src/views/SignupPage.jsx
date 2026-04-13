import { Building2 } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'

function SignupPage() {
    const navigate = useNavigate()

    // Controlled inputs: these values become the request payload for signup.
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const handleSignUp = async (e) => {
        e.preventDefault()

        // Frontend guard before calling backend.
        // Optional: replace this with backend validation message handling if preferred.
        if (password !== confirmPassword) {
            return
        }

        // This object is the exact shape you can send to your signup API.
        const signupPayload = {
            fullName,
            email,
            password,
        }

        // Backend integration point:
        // 1) POST signupPayload to your auth endpoint.
        // 2) Handle API errors (email exists, weak password, network issues).
        // 3) On success, optionally store token/user data then navigate.
        void signupPayload

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
                <h2 className="page-title mb-2">Create Account</h2>
                <p className="text-secondary mb-4">Start managing your architectural invoices today.</p>

                <form onSubmit={handleSignUp} className="d-grid gap-3">
                    <div>
                        <label className="eyebrow d-block mb-2">Full Name</label>
                        <input className="form-control finvo-input" placeholder="Your Name" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                    </div>
                    <div>
                        <label className="eyebrow d-block mb-2">Corporate Email</label>
                        <input className="form-control finvo-input" placeholder="name@firm.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div>
                        <label className="eyebrow d-block mb-2">Password</label>
                        <input type="password" className="form-control finvo-input" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div>
                        <label className="eyebrow d-block mb-2">Confirm Password</label>
                        <input type="password" className="form-control finvo-input" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>
                    <button className="btn btn-primary btn-lg w-100" type="submit">
                        Create Account
                    </button>
                </form>

                <p className="text-center text-secondary mt-4 mb-0">
                    Already have an account? <Link to="/login" className="btn btn-link p-0 text-primary">Sign In</Link>
                </p>
            </section>
        </div>
    )
}

export default SignupPage
