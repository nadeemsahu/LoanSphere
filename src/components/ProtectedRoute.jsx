import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                // Use CSS variables so this respects the current theme and never produces a wrong-color flash
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-secondary)',
                fontSize: '0.875rem',
                letterSpacing: '0.05em',
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '28px',
                        height: '28px',
                        border: '2px solid var(--border-light)',
                        borderTopColor: 'var(--brand-primary)',
                        borderRadius: '50%',
                        animation: 'spin 0.7s linear infinite',
                        margin: '0 auto 0.75rem',
                        opacity: 0.8,
                    }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    LoanSphere
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/access-denied" replace />;
    }

    return children;
};

export default ProtectedRoute;
