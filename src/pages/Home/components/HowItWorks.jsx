import React from 'react';
import '../styles/HowItWorks.css';

const HowItWorks = () => {
    const steps = [
        {
            number: "01",
            title: "Apply for Loan",
            description: "Borrowers verify eligibility and submit applications in minutes."
        },
        {
            number: "02",
            title: "Approval & Disbursal",
            description: "Lenders review and approve loans with automated checks."
        },
        {
            number: "03",
            title: "Track & Repay",
            description: "Monitor repayment schedules and make seamless EMI payments."
        }
    ];

    return (
        <section className="how-it-works-section">
            <div className="section-header">
                <h2>How It Works</h2>
                <p>Simple, transparent, and efficient process.</p>
            </div>
            <div className="steps-container">
                {steps.map((step, index) => (
                    <div className="step-item" key={index}>
                        <div className="step-number">{step.number}</div>
                        <h3>{step.title}</h3>
                        <p>{step.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default HowItWorks;
