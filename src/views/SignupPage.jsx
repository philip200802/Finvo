import { Building2 } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'

function SignupPage() {
    const navigate = useNavigate()

    const formik = useFormik({
        initialValues: {
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            fullName: Yup.string().min(2, 'Full name must be at least 2 characters').required('Full name is required'),
            email: Yup.string().email('Enter a valid email address').required('Corporate email is required'),
            password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password')], 'Passwords must match')
                .required('Please confirm your password'),
        }),
        onSubmit: (values) => {
            // This object is the exact shape you can send to your signup API.
            const signupPayload = {
                fullName: values.fullName,
                email: values.email,
                password: values.password,
            }

            // Backend integration point:
            // 1) POST signupPayload to your auth endpoint.
            // 2) Handle API errors (email exists, weak password, network issues).
            // 3) On success, optionally store token/user data then navigate.
            void signupPayload

            navigate('/dashboard')
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
                <h2 className="page-title mb-2">Create Account</h2>
                <p className="text-secondary mb-4">Start managing your architectural invoices today.</p>

                <form onSubmit={formik.handleSubmit} className="d-grid gap-3" noValidate>
                    <div>
                        <label className="eyebrow d-block mb-2">Full Name</label>
                        <input
                            className={`form-control finvo-input ${formik.touched.fullName && formik.errors.fullName ? 'is-invalid' : ''}`}
                            placeholder="Your Name"
                            type="text"
                            name="fullName"
                            value={formik.values.fullName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.fullName && formik.errors.fullName ? <div className="invalid-feedback d-block auth-error">{formik.errors.fullName}</div> : null}
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
