import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

import { useTheme } from '../../../contexts/ThemeContext';
import ThemeIcon from '../../../components/ThemeIcon/ThemeIcon';
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
                        <ThemeIcon theme={theme} />
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
                        <ThemeIcon theme={theme} />
                    </button>
                    <Link to="/login" className="nav-link login-btn">Sign In</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
