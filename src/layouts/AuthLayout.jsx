import React from 'react';
import { Outlet } from 'react-router-dom';
import '../styles/auth.css';

const AuthLayout = () => {
    return (
        <div className="auth-layout">
            <div className="auth-container">
                <div className="auth-header">
                    <div className="logo-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 22h20L12 2z" />
                        </svg>
                    </div>
                    <h1>LoanSphere</h1>
                </div>
                <div className="auth-card">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
