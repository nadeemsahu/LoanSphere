import React from 'react';
import '../styles/About.css';

const About = () => {
    return (
        <section id="about" className="about-section">
            <div className="about-content">
                <h2>About LoanSphere</h2>
                <p>
                    LoanSphere is a cutting-edge financial technology platform dedicated to simplifying the lending and borrowing process.
                    Born from the need for a more transparent, efficient, and user-friendly loan management system, we bridge the gap between financial institutions and individuals.
                </p>
                <p>
                    Our mission is to empower users with tools that provide clarity and control over their financial obligations.
                    Whether you are a lender managing a diverse portfolio or a borrower staying on top of repayments, LoanSphere provides the comprehensive insights you need to succeed.
                </p>
                <p>
                    With bank-grade security and an intuitive interface, we are redefining what it means to manage loans in the digital age.
                </p>
            </div>
        </section>
    );
};

export default About;
