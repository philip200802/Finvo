import { Building2 } from 'lucide-react'

function AuthView({ onEnter }) {
    return (
        <main className="auth-screen">
            <div className="auth-brand text-center mb-4">
                <div className="brand-mark mx-auto mb-3">
                    <Building2 size={18} />
                </div>
                <h1 className="brand-title mb-1">Finvo</h1>
                <p className="brand-subtitle mb-0">Architectural Ledger</p>
            </div>

            <section className="finvo-card auth-card">
                <h2 className="page-title mb-2">Welcome back</h2>
                <p className="text-secondary mb-4">Secure access to your architectural assets.</p>

                <div className="d-grid gap-2 mb-4">
                    {/* Replace with OAuth redirect handlers from your auth provider/backend. */}
                    <button className="btn btn-light" type="button">Continue with Google</button>
                    <button className="btn btn-dark border" type="button">Continue with GitHub</button>
                </div>

                <p className="eyebrow text-center mb-3">Or Email</p>
                <div className="d-grid gap-3">
                    {/* Convert these fields to controlled state and submit to login endpoint if this page is used. */}
                    <div>
                        <label className="eyebrow d-block mb-2">Corporate Email</label>
                        <input className="form-control finvo-input" placeholder="name@firm.com" />
                    </div>
                    <div>
                        <div className="d-flex justify-content-between mb-2">
                            <label className="eyebrow mb-0">Password</label>
                            <span className="eyebrow text-primary">Forgot?</span>
                        </div>
                        <input type="password" className="form-control finvo-input" placeholder="........" />
                    </div>
                    <button className="btn btn-primary btn-lg w-100" type="button" onClick={onEnter}>
                        Sign In
                    </button>
                </div>

                <p className="text-center text-secondary mt-4 mb-0">
                    New to the Ledger? <button className="btn btn-link p-0 text-primary">Create Account</button>
                </p>
            </section>
        </main>
    )
}

export default AuthView
