import React from 'react';
import '../styles/Legal.css';

const PrivacyPolicy = () => {
    return (
        <section className="legal-section">
            <div className="legal-content">
                <h3>Privacy Policy</h3>
                <div className="legal-text">
                    <p>
                        At LoanSphere, we take your privacy seriously. This policy outlines how we collect, use, and protect your personal information.
                    </p>
                    <h4>Data Protection</h4>
                    <p>
                        We employ industry-standard encryption and security protocols to safeguard your data. Your financial and personal information is stored on secure servers with restricted access.
                    </p>
                    <h4>Information Usage</h4>
                    <p>
                        Your data is used solely for the purpose of facilitating loan services, verifying identity, and improving our platform. We do not sell your data to third parties.
                    </p>
                    <h4>User Rights</h4>
                    <p>
                        You have the right to access, correct, or delete your personal information at any time. Contact our support team for any privacy-related concerns.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default PrivacyPolicy;
