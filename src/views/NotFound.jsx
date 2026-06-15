import { useNavigate } from 'react-router-dom'
import { getToken } from '../api/auth'

function NotFound() {
    const navigate = useNavigate()
    const isAuthenticated = !!getToken()

    const handleNavigate = () => {
        navigate(isAuthenticated ? '/dashboard' : '/login', { replace: true })
    }

    return (
        <div className="auth-screen text-center" style={{ paddingBottom: '2rem' }}>
            <div className="mb-4">
                <h1 className="page-title" style={{ fontSize: '5rem', marginBottom: '0.5rem', color: '#cbd5e1' }}>
                    404
                </h1>
                <p className="text-secondary" style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                    Page Not Found
                </p>
                <p className="text-secondary" style={{ fontSize: '0.95rem', opacity: 0.8 }}>
                    The page you're looking for doesn't exist or has been moved.
                </p>
            </div>

            <button
                className="btn btn-primary btn-lg"
                onClick={handleNavigate}
                style={{ marginTop: '1.5rem' }}
            >
                {isAuthenticated ? 'Go to Dashboard' : 'Go to Login'}
            </button>
        </div>
    )
}

export default NotFound
