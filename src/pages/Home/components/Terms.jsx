import React from 'react';
import '../styles/Legal.css';

const Terms = () => {
    return (
        <section id="terms" className="legal-section terms-section">
            <div className="legal-content">
                <h3>Terms and Conditions</h3>
                <div className="legal-text">
                    <p>
                        By accessing and using LoanSphere, you agree to comply with and be bound by the following terms and conditions.
                    </p>
                    <h4>Usage Agreement</h4>
                    <p>
                        Users must provide accurate and complete information during registration. Misrepresentation of identity or financial status is strictly prohibited.
                    </p>
                    <h4>Service Availability</h4>
                    <p>
                        While we strive for 99.9% uptime, LoanSphere is not liable for temporary service interruptions due to maintenance or unforeseen technical issues.
                    </p>
                    <h4>Liability Limitation</h4>
                    <p>
                        LoanSphere is a platform facilitator and is not responsible for the lending decisions made by financial institutions or the repayment capabilities of borrowers.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Terms;
