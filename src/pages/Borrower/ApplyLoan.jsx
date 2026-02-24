import React, { useState } from 'react';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import { useDataContext } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/dashboard.css';

const ApplyLoan = () => {
    const { user } = useAuth();
    const borrowerName = user?.name;
    const { applyForLoan } = useDataContext();
    const [formData, setFormData] = useState({ amount: '', purpose: '', term: '' });
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.amount || !formData.purpose || !formData.term) {
            setError('Please fill in all required fields.');
            return;
        }
        if (parseFloat(formData.amount) < 500) {
            setError('Minimum loan amount is $500.');
            return;
        }
        // PS15: loan is stamped with authenticated borrower's name
        applyForLoan(formData, borrowerName);
        setSubmitted(true);
        setError('');
        setFormData({ amount: '', purpose: '', term: '' });
        setTimeout(() => setSubmitted(false), 5000);
    };

    return (
        <div className="dashboard-container fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Apply for Loan</h1>
                    <p className="page-subtitle">Submit a new loan application under your account</p>
                </div>
            </div>

            <div className="content-section" style={{ maxWidth: '560px' }}>
                {submitted && (
                    <div role="alert" aria-live="polite" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.4)', padding: '0.875rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', color: '#22c55e', fontWeight: 500, fontSize: '0.9375rem' }}>
                        ✅ Application submitted! Go to <strong>My Loans</strong> to track it.
                    </div>
                )}
                {error && (
                    <div role="alert" aria-live="polite" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.4)', padding: '0.875rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', color: '#ef4444', fontWeight: 500, fontSize: '0.9375rem' }}>
                        ⚠️ {error}
                    </div>
                )}
                <div className="section-header"><h3>Loan Application Form</h3></div>
                <form onSubmit={handleSubmit} className="form-grid">
                    <div style={{ background: 'var(--surface-color)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '0.5rem' }}>
                        <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Applicant</p>
                        <p style={{ margin: 0, fontWeight: 600 }}>{borrowerName}</p>
                    </div>
                    <Input
                        label="Loan Amount ($) *"
                        type="number"
                        id="apply-amount"
                        placeholder="e.g. 15000"
                        value={formData.amount}
                        onChange={e => { setFormData({ ...formData, amount: e.target.value }); setError(''); }}
                        required
                    />
                    <Input
                        label="Purpose *"
                        type="text"
                        id="apply-purpose"
                        placeholder="e.g. Home Renovation, Car Purchase"
                        value={formData.purpose}
                        onChange={e => { setFormData({ ...formData, purpose: e.target.value }); setError(''); }}
                        required
                    />
                    <Input
                        label="Term (Months) *"
                        type="number"
                        id="apply-term"
                        placeholder="e.g. 24"
                        value={formData.term}
                        onChange={e => { setFormData({ ...formData, term: e.target.value }); setError(''); }}
                        required
                    />
                    <div className="form-actions-end">
                        <Button variant="primary" className="w-full" type="submit">
                            Submit Application
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApplyLoan;
