import { Building2, X } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'

function SignupPage() {
    const navigate = useNavigate()
    const REGISTER_URL = 'https://backend-1-rhpy.onrender.com/user/register'

    // Do not auto-redirect on mount. Navigation to dashboard
    // should only happen after an explicit successful signup.

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            firstName: Yup.string().min(2, 'First name must be at least 2 characters').required('First name is required'),
            lastName: Yup.string().min(2, 'Last name must be at least 2 characters').required('Last name is required'),
            email: Yup.string().email('Enter a valid email address').required('Corporate email is required'),
            password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password')], 'Passwords must match')
                .required('Please confirm your password'),
        }),
        onSubmit: async (values, { setSubmitting, setStatus }) => {
            setStatus(null)

            try {
                const payload = {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    password: values.password,
                }

                console.log('[SIGNUP] Payload being sent:', payload)

                const res = await fetch(REGISTER_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                })

                const data = await res.json().catch(() => ({}))

                if (!res.ok) {
                    throw new Error(data?.message || data?.error || 'Signup failed')
                }

                // ✔ SAVE SUCCESS STATE
                sessionStorage.removeItem('finvoSignupError')

                // ✔ ONLY NAVIGATE AFTER SUCCESS
                navigate('/login', {
                    replace: true,
                    state: {
                        signupSuccess: true,
                        message: 'Account created successfully. Please check your email and sign in.'
                    },
                })

            } catch (err) {
                console.error('[SIGNUP] Error:', err.message)
                setStatus(err.message || 'Signup failed')
                sessionStorage.setItem('finvoSignupError', err.message)
            } finally {
                setSubmitting(false)
            }
        },
    })

    function handleSignInNav() {
        navigate('/login')
    }

    return (
        <div className="auth-brand text-center mb-4">
            <div className="brand-mark mx-auto mb-3">
                <Building2 size={18} />
            </div>
            <h1 className="brand-title mb-1">Finvo</h1>
            <p className="brand-subtitle mb-0">Architectural Ledger</p>

            <section className="finvo-card auth-card signup-auth-card mt-4">
                <h2 className="page-title mb-2">Create Account</h2>
                <p className="text-secondary mb-4">Start managing your architectural invoices today.</p>

                {formik.status ? (
                    <div className="finvo-alert finvo-alert-error" role="alert" aria-live="polite">
                        <div className="finvo-alert-icon" aria-hidden="true">!</div>
                        <div className="finvo-alert-body">
                            <div className="finvo-alert-title">Registration failed</div>
                            <div className="finvo-alert-message">{formik.status}</div>
                        </div>
                        <button type="button" className="finvo-alert-close" aria-label="Close" onClick={() => formik.setStatus(null)}><X size={16} /></button>
                    </div>
                ) : null}

                <form onSubmit={formik.handleSubmit} className="d-grid gap-3" noValidate>
                    <div className="row g-2">
                        <div className="col-6">
                            <label className="eyebrow d-block mb-2">First Name</label>
                            <input
                                className={`form-control finvo-input ${formik.touched.firstName && formik.errors.firstName ? 'is-invalid' : ''}`}
                                placeholder="First"
                                type="text"
                                name="firstName"
                                value={formik.values.firstName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.firstName && formik.errors.firstName ? <div className="invalid-feedback d-block auth-error">{formik.errors.firstName}</div> : null}
                        </div>
                        <div className="col-6">
                            <label className="eyebrow d-block mb-2">Last Name</label>
                            <input
                                className={`form-control finvo-input ${formik.touched.lastName && formik.errors.lastName ? 'is-invalid' : ''}`}
                                placeholder="Last"
                                type="text"
                                name="lastName"
                                value={formik.values.lastName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.lastName && formik.errors.lastName ? <div className="invalid-feedback d-block auth-error">{formik.errors.lastName}</div> : null}
                        </div>
                    </div>
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
                        <label className="eyebrow d-block mb-2">Password</label>
                        <input
                            type="password"
                            className={`form-control finvo-input ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                            placeholder="Create a password"
                            name="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.password && formik.errors.password ? <div className="invalid-feedback d-block auth-error">{formik.errors.password}</div> : null}
                    </div>
                    <div>
                        <label className="eyebrow d-block mb-2">Confirm Password</label>
                        <input
                            type="password"
                            className={`form-control finvo-input ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'is-invalid' : ''}`}
                            placeholder="Confirm password"
                            name="confirmPassword"
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.confirmPassword && formik.errors.confirmPassword ? <div className="invalid-feedback d-block auth-error">{formik.errors.confirmPassword}</div> : null}
                    </div>
                    <button className="btn btn-primary btn-lg w-100" type="submit" disabled={formik.isSubmitting}>
                        {formik.isSubmitting ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Creating account...
                            </>
                        ) : (
                            'Create Account'
                        )}
                    </button>

                </form>

                <p className="text-center text-secondary mt-4 mb-0">
                    Already have an account?{' '}
                    <button type="button" className="btn btn-link p-0 text-primary" onClick={handleSignInNav}>
                        Sign In
                    </button>
                </p>
            </section>
        </div>
    )
}

export default SignupPage
