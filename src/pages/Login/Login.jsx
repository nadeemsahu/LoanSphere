import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

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

    const handleRoleSelect = (e) => {
        const role = e.target.value;
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
        <div className="login-form-container">
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

            {error && <div className="error-message" role="alert" id="login-error" aria-live="assertive">{error}</div>}

            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label htmlFor="sandbox-role">Select Role</label>
                    <select
                        id="sandbox-role"
                        name="sandbox-role"
                        className="form-input"
                        onChange={handleRoleSelect}
                        defaultValue=""
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

