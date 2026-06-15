import { Building2, X } from 'lucide-react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getToken, saveAuthSession } from '../api/auth'
import { useFormik } from 'formik'
import * as Yup from 'yup'

function LoginPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const [signupMessage, setSignupMessage] = useState('')
    const [signupMessageType, setSignupMessageType] = useState('error') // 'success' or 'error'

    // Do not auto-redirect on mount. Navigation to dashboard
    // should only happen after an explicit successful login.



    useEffect(() => {
        if (getToken()) {
            navigate('/dashboard', { replace: true })
            return
        }

        // ✔ Handle signup success from navigation state (FAST PATH)
        if (location.state?.signupSuccess) {
            setSignupMessage(location.state.message || 'Account created successfully. Please sign in.')
            setSignupMessageType('success')
            window.history.replaceState({}, document.title)
            return
        }

        // ✔ Fallback: Check sessionStorage once (only if navigating from error)
        const message = sessionStorage.getItem('finvoSignupError')
        if (message) {
            setSignupMessage(message)
            setSignupMessageType('error')
            sessionStorage.removeItem('finvoSignupError')
        }
    }, [navigate, location])

    function handleSignupClick() {
        navigate('/signup')
    }

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Enter a valid email address').required('Corporate email is required'),
            password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
        }),
        onSubmit: async (values, { setSubmitting, setStatus }) => {
            try {
                const res = await fetch('https://backend-1-rhpy.onrender.com/user/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: values.email, password: values.password }),
                })

                const data = await res.json().catch(() => ({}))

                if (!res.ok) {
                    throw new Error(data?.message || data?.error || 'Login failed')
                }

                if (data?.token) {
                    saveAuthSession(data, values.email)
                    navigate('/dashboard')
                    return
                }

                throw new Error('Login succeeded but no JWT was returned')
            } catch (err) {
                setStatus(err.message || 'Login failed')
            } finally {
                setSubmitting(false)
            }
        },
    })

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

                {signupMessage || formik.status ? (
                    <div className={`finvo-alert ${signupMessage && signupMessageType === 'success' ? 'finvo-alert-success' : 'finvo-alert-error'}`} role="alert">
                        <div className="finvo-alert-icon" aria-hidden="true">{signupMessage && signupMessageType === 'success' ? '✓' : '!'}</div>
                        <div className="finvo-alert-body">
                            <div className="finvo-alert-title">
                                {signupMessage
                                    ? (signupMessageType === 'success' ? 'Registration successful' : 'Registration failed')
                                    : 'Authentication failed'
                                }
                            </div>
                            <div className="finvo-alert-message">{signupMessage || formik.status}</div>
                        </div>
                        <button
                            type="button"
                            className="finvo-alert-close"
                            aria-label="Close"
                            onClick={() => {
                                setSignupMessage('')
                                formik.setStatus(null)
                            }}
                        >
                            <X size={16} />
                        </button>
                    </div>
                ) : null}

                <form onSubmit={formik.handleSubmit} className="d-grid gap-3" noValidate>
                    <div>
                        <label className="eyebrow d-block mb-2">Corporate Email</label>
                        <input
                            className={`form-control finvo-input ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                            placeholder="name@firm.com"
                            type="email"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.email && formik.errors.email ? <div className="invalid-feedback d-block auth-error">{formik.errors.email}</div> : null}
                    </div>
                    <div>
                        <div className="d-flex align-items-center justify-content-between mb-2 auth-label-row">
                            <label className="eyebrow mb-0">Password</label>
                            <button type="button" className="btn btn-link p-0 text-primary auth-forgot-link">Forgot?</button>
                        </div>
                        <input
                            type="password"
                            className={`form-control finvo-input ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                            placeholder="........"
                            name="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.password && formik.errors.password ? <div className="invalid-feedback d-block auth-error">{formik.errors.password}</div> : null}
                    </div>
                    <button className="btn btn-primary btn-lg w-100" type="submit" disabled={formik.isSubmitting}>
                        {formik.isSubmitting ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Signing in...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <p className="text-center text-secondary mt-4 mb-0">
                    New to the Ledger?{' '}
                    <button type="button" className="btn btn-link p-0 text-primary" onClick={handleSignupClick}>
                        Create Account
                    </button>
                </p>
            </section>
        </div>
    )
}

export default LoginPage
