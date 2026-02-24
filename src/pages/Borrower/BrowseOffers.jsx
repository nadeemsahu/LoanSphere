import React, { useState } from 'react';
import Table from '../../components/Table/Table';
import { useDataContext } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/dashboard.css';

const BrowseOffers = () => {
    const { user } = useAuth();
    const borrowerName = user?.name;
    const { offers, applyForOffer } = useDataContext();
    const [appliedId, setAppliedId] = useState(null);
    const [feedbackMsg, setFeedbackMsg] = useState('');

    const handleApply = (id) => {
        applyForOffer(id, borrowerName);
        setAppliedId(id);
        setFeedbackMsg(`✅ Applied for offer #${id}! A loan application has been created. Check My Loans.`);
        setTimeout(() => setFeedbackMsg(''), 5000);
    };

    const offerColumns = [
        { header: 'Offer ID', accessor: 'id' },
        { header: 'Amount', render: (row) => `$${row.amount.toLocaleString()}` },
        { header: 'Interest Rate', render: (row) => `${row.interestRate}%` },
        { header: 'Term', render: (row) => `${row.term} months` },
        { header: 'Lender', accessor: 'lender' },
        {
            header: 'Action',
            render: (row) => (
                <button
                    className="btn btn-primary"
                    style={{ padding: '4px 12px', fontSize: '12px' }}
                    onClick={() => handleApply(row.id)}
                    disabled={appliedId === row.id}
                    aria-label={`Apply for offer ${row.id}`}
                >
                    {appliedId === row.id ? '✅ Applied' : 'Apply'}
                </button>
            )
        },
    ];

    return (
        <div className="dashboard-container fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Browse Loan Offers</h1>
                    <p className="page-subtitle">Explore pre-approved loan offers available to you</p>
                </div>
            </div>

            {feedbackMsg && (
                <div role="alert" aria-live="polite" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.4)', padding: '0.875rem 1rem', borderRadius: '8px', marginBottom: '1rem', color: '#22c55e', fontWeight: 500, fontSize: '0.9rem' }}>
                    {feedbackMsg}
                </div>
            )}

            <div className="content-section">
                <div className="section-header">
                    <h3>Available Offers ({offers.length})</h3>
                </div>
                {offers.length === 0 ? (
                    <div className="no-data">
                        No offers available at this time. Check back later.
                    </div>
                ) : (
                    <Table columns={offerColumns} data={offers} />
                )}
            </div>
        </div>
    );
};

export default BrowseOffers;
