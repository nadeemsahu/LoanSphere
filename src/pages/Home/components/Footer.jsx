import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
    return (
        <footer className="home-footer">
            <div className="footer-content">
                <div className="footer-links">
                    <a href="#home" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Home</a>
                    <a href="#features" onClick={(e) => { e.preventDefault(); document.getElementById('features').scrollIntoView({ behavior: 'smooth' }); }}>Features</a>
                    <a href="#about" onClick={(e) => { e.preventDefault(); document.getElementById('about').scrollIntoView({ behavior: 'smooth' }); }}>About</a>
                    <a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById('contact').scrollIntoView({ behavior: 'smooth' }); }}>Contact</a>
                    <a href="https://www.linkedin.com/in/nadeemsahun/" target="_blank" rel="noopener noreferrer">Connect</a>
                </div>
                <div className="footer-legal">
                    <a href="#legal" onClick={(e) => { e.preventDefault(); document.getElementById('legal').scrollIntoView({ behavior: 'smooth' }); }}>Privacy Policy</a>
                    <a href="#legal" onClick={(e) => { e.preventDefault(); document.getElementById('legal').scrollIntoView({ behavior: 'smooth' }); }}>Terms of Service</a>
                </div>
                <div className="footer-copyright">
                    © {new Date().getFullYear()} LoanSphere. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
