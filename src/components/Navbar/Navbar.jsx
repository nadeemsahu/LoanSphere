import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import NotificationDropdown from '../NotificationDropdown/NotificationDropdown';
import './Navbar.css';

// Generate a human-readable breadcrumb from a pathname
const getBreadcrumb = (pathname) => {
    const segments = pathname.replace(/^\//, '').split('/');
    const last = segments[segments.length - 1];

    // Custom mapping for clearer navigation
    const labels = {
        'admin': 'Dashboard',
        'lender': 'Overview',
        'borrower': 'Dashboard',
        'analyst': 'Analytics',
        'create-loan': 'Create Offer',
        'offers': 'Loan Offers',
        'borrowers': 'Borrower List',
        'payments': 'Payment Tracking'
    };

    if (!last || last === '') return 'Dashboard';
    if (labels[last.toLowerCase()]) return labels[last.toLowerCase()];

    return last
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
};

const Navbar = ({ onToggleMenu }) => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const breadcrumb = getBreadcrumb(location.pathname);

    // Dynamic breadcrumb prefix based on role
    const getPrefix = () => {
        if (user?.role === 'admin') return 'Administration';
        if (user?.role === 'analyst') return 'Financials';
        if (user?.role === 'borrower') return 'Borrower';
        return 'Lending';
    };

    const handleLogout = () => {
        setIsDropdownOpen(false);
        logout();
        navigate('/login', { replace: true });
    };

    return (
        <header className="navbar" role="banner">
            <div className="navbar-inner">
                <div className="navbar-left">
                    <button
                        className="hamburger-btn"
                        onClick={onToggleMenu}
                        aria-label="Toggle navigation menu"
                        aria-expanded={false}
                        type="button"
                    >
                        <svg
                            width="20" height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>

                    <nav className="breadcrumb" aria-label="Breadcrumb">
                        <span className="breadcrumb-item">{getPrefix()}</span>
                        <span className="breadcrumb-separator">/</span>
                        <span className="breadcrumb-current">{breadcrumb}</span>
                    </nav>
                </div>

                <div className="navbar-right">
                    {user?.role === 'lender' && (
                        <button
                            className="btn btn-primary btn-sm nav-action-btn"
                            onClick={() => navigate('/lender/create-loan')}
                        >
                            + Create Offer
                        </button>
                    )}

                    <button
                        className="theme-toggle"
                        onClick={toggleTheme}
                        aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                        type="button"
                    >
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>

                    <NotificationDropdown />

                    <div className="profile-dropdown-container">
                        <button
                            className="profile-btn"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            aria-haspopup="true"
                            aria-expanded={isDropdownOpen}
                        >
                            <div className="avatar-circle">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <span className="profile-name">{user?.name}</span>
                            <svg
                                className={`chevron-icon ${isDropdownOpen ? 'rotate-180' : ''}`}
                                width="14" height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </button>

                        {isDropdownOpen && (
                            <>
                                <div className="dropdown-overlay-mask" onClick={() => setIsDropdownOpen(false)} />
                                <div className="profile-menu">
                                    <div className="menu-header">
                                        <div className="menu-identity">
                                            <span className="menu-name">{user?.name}</span>
                                            <span className="menu-role-badge">{user?.role}</span>
                                        </div>
                                        <span className="menu-email">{user?.email}</span>
                                    </div>
                                    <div className="menu-divider" />
                                    <button className="menu-item" onClick={() => { setIsDropdownOpen(false); navigate(`/${user?.role}/settings`); }}>
                                        Settings
                                    </button>
                                    <button className="menu-item text-danger" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
