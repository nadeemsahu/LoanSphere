import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Hero.css';

const Hero = () => {
    return (
        <section className="hero-section" id="home">
            <div className="hero-content">
                <h1 className="hero-title">
                    Smart Loan Management <br />
                    <span className="hero-highlight">Made Simple</span>
                </h1>
                <p className="hero-description">
                    Empower your financial future with LoanSphere. The comprehensive platform for lenders and borrowers to manage loans, track payments, and analyze financial health with ease.
                </p>
                <div className="hero-actions">
                    <Link to="/login" className="btn btn-primary">Get Started</Link>
                    <button className="btn btn-secondary" onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>
                        Explore Features
                    </button>
                </div>
            </div>
            <div className="hero-visual">
                <div className="abstract-shape shape-1"></div>
                <div className="abstract-shape shape-2"></div>
                <div className="hero-card-preview">
                    <div className="card-header">
                        <div className="circle"></div>
                        <div className="line"></div>
                    </div>
                    <div className="card-body">
                        <div className="stat-row">
                            <div className="stat-block"></div>
                            <div className="stat-block"></div>
                        </div>
                        <div className="graph-placeholder">
                            <div className="bar bar-1"></div>
                            <div className="bar bar-2"></div>
                            <div className="bar bar-3"></div>
                            <div className="bar bar-4"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
