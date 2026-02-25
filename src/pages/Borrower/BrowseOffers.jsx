import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../components/Table/Table';
import { useDataContext } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/dashboard.css';

const BrowseOffers = () => {
    const { user } = useAuth();
    const borrowerName = user?.name;
    const { offers, applyForOffer } = useDataContext();
    const navigate = useNavigate();

    const [appliedId, setAppliedId] = useState(null);
    const [feedbackMsg, setFeedbackMsg] = useState('');

    const handleApply = (id) => {
        applyForOffer(id, borrowerName);
        setAppliedId(id);
        setFeedbackMsg(`✅ Application submitted for Offer #${id}! Track it in My Applications.`);
        setTimeout(() => {
            setFeedbackMsg('');
            navigate('/borrower/applications');
        }, 2500);
    };

    const offerColumns = [
        { header: 'Lender', render: (row) => <span style={{ fontWeight: 600 }}>{row.lender}</span> },
        { header: 'Amount', render: (row) => <span className="text-primary" style={{ fontWeight: 500 }}>${row.amount.toLocaleString()}</span> },
        { header: 'Interest Rate', render: (row) => `${row.interestRate}%` },
        { header: 'Term', render: (row) => `${row.term} months` },
        {
            header: 'Description',
            render: (row) => row.description
                ? <span title={row.description} style={{ maxWidth: '200px', display: 'inline-block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.description}</span>
                : <span className="text-secondary-xs">—</span>
        },
        {
            header: 'Action',
            render: (row) => (
                <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleApply(row.id)}
                    disabled={appliedId === row.id}
                    aria-label={`Apply for offer ${row.id}`}
                >
                    {appliedId === row.id ? '✅ Applied' : 'Apply Now'}
                </button>
            )
        },
    ];

    return (
        <div className="dashboard-container fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Browse Loan Offers</h1>
                    <p className="page-subtitle">Find and apply for loans published by verified lenders.</p>
                </div>
            </div>

            {feedbackMsg && (
                <div role="alert" aria-live="polite" className="alert-success">
                    {feedbackMsg}
                </div>
            )}

            <div className="content-section" style={{ overflowX: 'auto' }}>
                <div className="section-header">
                    <h3>Available Marketplace Offers</h3>
                    <span className="badge-count">{offers.length}</span>
                </div>
                {offers.length === 0 ? (
                    <div className="no-data">
                        No loan offers are currently available. Please check back later.
                    </div>
                ) : (
                    <Table columns={offerColumns} data={offers} />
                )}
            </div>
        </div>
    );
};

export default BrowseOffers;
