import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

import { useTheme } from '../../../contexts/ThemeContext';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 20;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [scrolled]);

    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

    const scrollToSection = (id) => {
        setMobileMenuOpen(false);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const ThemeIcon = () => (
        theme === 'light' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
        ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
        )
    );

    return (
        <nav className={`home-navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="navbar-container">
                <div className="navbar-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <div className="logo-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 22h20L12 2z" />
                        </svg>
                    </div>
                    <span>LoanSphere</span>
                </div>

                <div className="navbar-links desktop-only">
                    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="nav-link">Home</button>
                    <button onClick={() => scrollToSection('features')} className="nav-link">Features</button>
                    <button onClick={() => scrollToSection('about')} className="nav-link">About</button>
                    <button onClick={() => scrollToSection('contact')} className="nav-link">Contact</button>
                    <button onClick={toggleTheme} className="nav-link theme-toggle" aria-label="Toggle theme">
                        <ThemeIcon />
                    </button>
                    <Link to="/login" className="nav-link login-btn">Sign In</Link>
                </div>

                <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
                    <span className={`bar ${mobileMenuOpen ? 'open' : ''}`}></span>
                    <span className={`bar ${mobileMenuOpen ? 'open' : ''}`}></span>
                    <span className={`bar ${mobileMenuOpen ? 'open' : ''}`}></span>
                </div>

                <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
                    <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setMobileMenuOpen(false); }} className="nav-link">Home</button>
                    <button onClick={() => scrollToSection('features')} className="nav-link">Features</button>
                    <button onClick={() => scrollToSection('about')} className="nav-link">About</button>
                    <button onClick={() => scrollToSection('contact')} className="nav-link">Contact</button>
                    <button onClick={() => { toggleTheme(); setMobileMenuOpen(false); }} className="nav-link theme-toggle-mobile" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                        <ThemeIcon />
                    </button>
                    <Link to="/login" className="nav-link login-btn">Sign In</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
