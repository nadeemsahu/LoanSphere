import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import './Register.css';

const Register = () => {
    const { register, googleLogin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const googleButtonRef = useRef(null);

    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'borrower' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const { theme, toggleTheme } = useTheme();

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        const { name, email, password, confirm, role } = form;

        if (!name.trim() || !email.trim() || !password || !confirm || !role) {
            setError('All fields are required.');
            return;
        }
        if (name.trim().length < 2) {
            setError('Full name must be at least 2 characters.');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Enter a valid email address.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        if (password !== confirm) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        const result = register(name, email, password, role);
        setLoading(false);

        if (result.success) {
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2200);
        } else {
            setError(result.message);
        }
    };

    useEffect(() => {
        if (!window.google) return;

        window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
            callback: (response) => {
                googleLogin(response.credential).then(res => {
                    if (res.success) {
                        const userRole = res.user?.role || 'borrower';
                        const targetDashboard = `/${userRole}`;
                        // Redirect straight to dashboard
                        navigate(targetDashboard, { replace: true });
                    } else {
                        setError(res.message);
                    }
                });
            }
        });

        if (googleButtonRef.current) {
            window.google.accounts.id.renderButton(
                googleButtonRef.current,
                { theme: theme === 'dark' ? 'filled_black' : 'outline', size: 'large', width: '100%', text: 'continue_with' }
            );
        }
    }, [theme, googleLogin, navigate]);

    return (
        <div className="register-container">
            <div className="register-card">
                {/* Header */}
                <div className="register-header">
                    <div className="register-logo-row">
                        <Link to="/home" className="register-logo">
                            <span className="register-logo-icon">▲</span>
                            <span className="register-logo-text">LoanSphere</span>
                        </Link>
                        <div className="register-top-actions">
                            <button
                                type="button"
                                onClick={toggleTheme}
                                className="auth-theme-toggle"
                                aria-label="Toggle theme"
                                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                            >
                                {theme === 'dark' ? '☀️' : '🌙'}
                            </button>
                            <Link to="/home" className="register-home-link">← Home</Link>
                        </div>
                    </div>
                    <h1 className="register-title">Create an account</h1>
                    <p className="register-subtitle">Join as a borrower or lender — free to start.</p>
                </div>


                {/* Success state */}
                {success ? (
                    <div className="register-success" role="alert">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        <div>
                            <strong>Account created!</strong>
                            <span> Redirecting you to login…</span>
                        </div>
                    </div>
                ) : (
                    <form className="register-form" onSubmit={handleSubmit} noValidate>
                        {/* Error */}
                        {error && (
                            <div className="register-error" role="alert">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <div className="google-auth-wrapper" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            <div ref={googleButtonRef} id="google-register-btn"></div>
                        </div>

                        <div className="login-divider" style={{ textAlign: 'center', margin: '1rem 0', color: 'var(--text-muted)' }}>
                            <span>or register with email</span>
                        </div>

                        {/* Role selector */}
                        <div className="register-role-tabs" role="group" aria-label="Select account type">
                            {['borrower', 'lender'].map(r => (
                                <button
                                    key={r}
                                    type="button"
                                    className={`role-tab${form.role === r ? ' active' : ''}`}
                                    onClick={() => setForm(prev => ({ ...prev, role: r }))}
                                >
                                    <span className="role-tab-icon">{r === 'borrower' ? '🏠' : '💼'}</span>
                                    <span className="role-tab-label">{r === 'borrower' ? 'Borrower' : 'Lender'}</span>
                                    <span className="role-tab-desc">{r === 'borrower' ? 'Apply for loans' : 'Fund borrowers'}</span>
                                </button>
                            ))}
                        </div>

                        {/* Fields */}
                        <div className="register-fields">
                            <div className="register-field">
                                <label htmlFor="reg-name">Full Name</label>
                                <input
                                    id="reg-name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    placeholder="e.g. Alice Johnson"
                                    value={form.name}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>
                            <div className="register-field">
                                <label htmlFor="reg-email">Email Address</label>
                                <input
                                    id="reg-email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    value={form.email}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>
                            <div className="register-row">
                                <div className="register-field">
                                    <label htmlFor="reg-password">Password</label>
                                    <input
                                        id="reg-password"
                                        name="password"
                                        type="password"
                                        autoComplete="new-password"
                                        placeholder="Min. 6 characters"
                                        value={form.password}
                                        onChange={handleChange}
                                        disabled={loading}
                                    />
                                </div>
                                <div className="register-field">
                                    <label htmlFor="reg-confirm">Confirm Password</label>
                                    <input
                                        id="reg-confirm"
                                        name="confirm"
                                        type="password"
                                        autoComplete="new-password"
                                        placeholder="Repeat password"
                                        value={form.confirm}
                                        onChange={handleChange}
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="register-btn"
                            disabled={loading}
                        >
                            {loading ? 'Creating account…' : `Create ${form.role === 'borrower' ? 'Borrower' : 'Lender'} Account`}
                        </button>

                        {/* Footer link */}
                        <p className="register-login-link">
                            Already have an account?{' '}
                            <Link to="/login">Sign in</Link>
                        </p>
                    </form>
                )}
            </div>

            {/* Side info panel */}
            <div className="register-side">
                <div className="register-side-content">
                    <h2>The smart way to borrow and lend.</h2>
                    <ul className="register-benefits">
                        <li>
                            <span className="benefit-icon">⚡</span>
                            <div><strong>Instant Applications</strong><p>Browse competitive offers and apply in seconds.</p></div>
                        </li>
                        <li>
                            <span className="benefit-icon">🔒</span>
                            <div><strong>Role-Based Security</strong><p>Every account is scoped with strict access controls.</p></div>
                        </li>
                        <li>
                            <span className="benefit-icon">📊</span>
                            <div><strong>Real-time Dashboard</strong><p>Track loans, payments, and activity live.</p></div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Register;
