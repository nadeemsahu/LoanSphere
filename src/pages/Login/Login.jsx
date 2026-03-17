import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import GoogleAuthButton from '../../components/GoogleAuthButton/GoogleAuthButton';
import './Login.css';

const Login = () => {
    const { login, googleLogin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Prevent recursive redirect trap: ensure we always default away from /login on success
    const from = location.state?.from?.pathname === '/login' ? '/' : (location.state?.from?.pathname || '/');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [error, setError] = useState('');
    const { theme, toggleTheme } = useTheme();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        const result = login(email, password);
        if (result.success) {
            const role = result.user?.role;
            const targetDashboard = `/${role}`;

            // Determine if the 'from' path is valid for this user's role
            // If from is /, or if from belongs to a DIFFERENT role's path, go to current role's dashboard
            const isInvalidPath = from === '/' || !from.startsWith(targetDashboard);

            if (!isInvalidPath) {
                navigate(from, { replace: true });
            } else {
                navigate(targetDashboard, { replace: true });
            }
        } else {
            setError(result.message);
        }
    };

    const handleGoogleSuccess = (response) => {
        googleLogin(response.credential).then(res => {
            if (res.success && res.needsRegistration) {
                navigate('/register', { state: { googleData: res.googleData } });
            } else if (res.success) {
                const role = res.user?.role || 'borrower';
                const targetDashboard = `/${role}`;
                const isInvalidPath = from === '/' || !from.startsWith(targetDashboard);
                if (!isInvalidPath) {
                    navigate(from, { replace: true });
                } else {
                    navigate(targetDashboard, { replace: true });
                }
            } else {
                setError(res.message);
            }
        });
    };

    const handleRoleSelect = (e) => {
        const role = e.target.value;
        setSelectedRole(role);
        switch (role) {
            case 'borrower':
                setEmail('borrower@loansphere.com');
                setPassword('password');
                break;
            case 'lender':
                setEmail('lender@loansphere.com');
                setPassword('password');
                break;
            case 'analyst':
                setEmail('analyst@loansphere.com');
                setPassword('password');
                break;
            case 'admin':
                setEmail('admin@loansphere.com');
                setPassword('password');
                break;
            default:
                setEmail('');
                setPassword('');
                break;
        }
    };

    return (
        <div className="login-container">
            <button
                type="button"
                onClick={toggleTheme}
                className="auth-theme-toggle"
                aria-label="Toggle theme"
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
                {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <h2 className="login-title">Welcome Back</h2>
            <p className="login-subtitle">Enter your credentials to access your account</p>

            {error && (
                <div className="login-error" role="alert">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {error}
                </div>
            )}

            <div className="google-auth-wrapper" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <GoogleAuthButton onSuccess={handleGoogleSuccess} text="continue_with" />
            </div>

            <div className="login-divider" style={{ textAlign: 'center', margin: '1rem 0', color: 'var(--text-muted)' }}>
                <span>or sign in with email</span>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label htmlFor="sandbox-role">Select Role</label>
                    <select
                        id="sandbox-role"
                        name="sandbox-role"
                        className="form-input"
                        onChange={handleRoleSelect}
                        value={selectedRole}
                        autoComplete="off"
                        aria-label="Select your role to login"
                    >
                        <option value="" disabled>Select a role...</option>
                        <option value="borrower">Borrower</option>
                        <option value="lender">Lender</option>
                        <option value="analyst">Financial Analyst</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="form-input"
                        autoComplete="email"
                        aria-describedby={error ? 'login-error' : undefined}
                        aria-invalid={!!error}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="form-input"
                        autoComplete="current-password"
                        aria-describedby={error ? 'login-error' : undefined}
                        aria-invalid={!!error}
                        required
                    />
                </div>

                <button type="submit" className="btn-primary btn-full">
                    Sign In
                </button>
            </form>

            <p className="login-register-link">
                New to LoanSphere?{' '}
                <Link to="/register">Create an account</Link>
            </p>
        </div>
    );
};

export default Login;

