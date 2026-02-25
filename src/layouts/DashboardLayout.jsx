import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import Navbar from '../components/Navbar/Navbar';
import '../styles/layout.css';

const DashboardLayout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    // Close sidebar on route change (mobile UX)
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const toggleMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(prev => !prev);
    }, []);

    const closeMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(false);
    }, []);

    return (
        <div className="dashboard-layout">
            <div
                className={`sidebar-overlay ${isMobileMenuOpen ? 'visible' : ''}`}
                onClick={closeMobileMenu}
            />

            <Sidebar isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />

            <main className="main-content">
                <Navbar onToggleMenu={toggleMobileMenu} />
                {/* key on location.pathname ensures only the inner content re-mounts on route change,
                    not the entire layout. The fade-in animation is on this wrapper, not the outer div. */}
                <div id="main-content" className="page-content" tabIndex="-1">
                    <div key={location.pathname} className="page-fade-in">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
