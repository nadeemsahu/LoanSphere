import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const dashboardByRole = {
    admin: '/admin',
    lender: '/lender',
    borrower: '/borrower',
    analyst: '/analyst',
};

const AccessDenied = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleGoHome = () => {
        const target = user ? (dashboardByRole[user.role] || '/login') : '/login';
        navigate(target, { replace: true });
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: 'var(--bg-color, #0a0a0a)',
            padding: '2rem',
        }}>
            <div style={{
                maxWidth: '480px',
                width: '100%',
                background: 'var(--surface-color, #111)',
                border: '1px solid var(--border, #27272a)',
                borderRadius: '16px',
                padding: '3rem 2.5rem',
                textAlign: 'center',
            }}>
                <div style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    margin: '0 auto 1.5rem',
                }}>
                    🚫
                </div>

                <h1 style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: 'var(--text-primary, #fff)',
                    marginBottom: '0.75rem',
                }}>
                    Access Denied
                </h1>

                <p style={{
                    color: 'var(--text-secondary, #a1a1aa)',
                    fontSize: '0.9375rem',
                    lineHeight: 1.6,
                    marginBottom: '0.5rem',
                }}>
                    You do not have permission to access this page.
                </p>

                {user && (
                    <p style={{
                        color: 'var(--text-secondary, #71717a)',
                        fontSize: '0.8125rem',
                        marginBottom: '2rem',
                    }}>
                        You are logged in as <strong style={{ color: 'var(--text-primary, #fff)' }}>{user.name}</strong>{' '}
                        (<span style={{ textTransform: 'capitalize' }}>{user.role}</span>).
                        This area is restricted to another role.
                    </p>
                )}

                <button
                    onClick={handleGoHome}
                    style={{
                        display: 'block',
                        width: '100%',
                        padding: '0.75rem',
                        background: 'var(--text-primary, #fff)',
                        color: 'var(--bg-color, #0a0a0a)',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.9375rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        letterSpacing: '0.01em',
                    }}
                >
                    Go to My Dashboard
                </button>
            </div>
        </div>
    );
};

export default AccessDenied;
