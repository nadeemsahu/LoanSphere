import React, { useState } from 'react';
import { useDataContext } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import '../../styles/dashboard.css';

const CreateLoanOffer = () => {
    const { createOffer } = useDataContext();
    const { user } = useAuth();
    const lenderName = user?.name || 'Lender';
    const [formData, setFormData] = useState({ amount: '', interest: '', term: '', description: '', optionalTerms: '' });
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.amount || !formData.interest || !formData.term) {
            setError('Please fill in Amount, Interest Rate, and Term before publishing.');
            return;
        }
        if (parseFloat(formData.amount) < 1000) {
            setError('Minimum loan amount is $1,000.');
            return;
        }
        createOffer(formData, lenderName);
        setSubmitted(true);
        setError('');
        setFormData({ amount: '', interest: '', term: '', description: '', optionalTerms: '' });
        setTimeout(() => setSubmitted(false), 5000);
    };

    return (
        <div className="dashboard-container fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Create Loan Offer</h1>
                    <p className="page-subtitle">Publish a new loan offer for qualified borrowers</p>
                </div>
            </div>

            <div className="content-section-md">
                {submitted && (
                    <div role="alert" className="alert-success">
                        ✅ Offer published successfully! View it under <strong>My Offers</strong>.
                    </div>
                )}
                {error && (
                    <div role="alert" className="alert-error" style={{ marginBottom: '1.5rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '12px', borderRadius: '8px', fontSize: '0.875rem' }}>
                        ⚠️ {error}
                    </div>
                )}

                <div className="section-header">
                    <h3>Offer Details</h3>
                    <span className="text-secondary-xs">
                        Publishing as: <strong className="text-primary">{lenderName}</strong>
                    </span>
                </div>

                <form onSubmit={handleSubmit} className="form-grid">
                    <Input
                        label="Loan Amount ($) *"
                        id="cl-amount"
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                        min="1000"
                        placeholder="e.g. 50000"
                    />

                    <div className="form-row-2">
                        <Input
                            label="Interest Rate (%) *"
                            id="cl-interest"
                            type="number"
                            name="interest"
                            value={formData.interest}
                            onChange={handleChange}
                            required
                            step="0.1"
                            min="0.1"
                            placeholder="e.g. 5.5"
                        />
                        <Input
                            label="Term (Months) *"
                            id="cl-term"
                            type="number"
                            name="term"
                            value={formData.term}
                            onChange={handleChange}
                            required
                            min="1"
                            max="360"
                            placeholder="e.g. 12"
                        />
                    </div>

                    <div className="form-row-1" style={{ marginTop: 'var(--space-md)' }}>
                        <div className="input-field-wrapper">
                            <label htmlFor="cl-description" className="input-label">Description / Purpose Filter</label>
                            <textarea
                                id="cl-description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="e.g. For small business expansion only"
                                className="form-input"
                                rows="3"
                                style={{ width: '100%', resize: 'vertical' }}
                            />
                        </div>
                    </div>

                    <div className="form-row-1" style={{ marginTop: 'var(--space-md)' }}>
                        <div className="input-field-wrapper">
                            <label htmlFor="cl-optional" className="input-label">Optional Terms</label>
                            <textarea
                                id="cl-optional"
                                name="optionalTerms"
                                value={formData.optionalTerms}
                                onChange={handleChange}
                                placeholder="e.g. Requires 680+ credit score, collateral needed"
                                className="form-input"
                                rows="2"
                                style={{ width: '100%', resize: 'vertical' }}
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: 'var(--space-xl)' }}>
                        <Button type="submit" size="lg" style={{ width: '100%' }}>
                            Publish Loan Offer
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateLoanOffer;
