import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../components/Table/Table';
import { useDataContext } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/dashboard.css';

const MyLoanOffers = () => {
    const { offers, deleteOffer } = useDataContext();
    const { user } = useAuth();
    const navigate = useNavigate();
    const lenderName = user?.name || 'Lender';
    const [feedback, setFeedback] = useState('');

    const myOffers = offers.filter(o => o.lender === lenderName);

    const handleDelete = (id) => {
        if (window.confirm(`Remove offer #${id} from the marketplace? Borrowers will no longer be able to apply.`)) {
            deleteOffer(id, lenderName);
            setFeedback(`Offer #${id} removed from marketplace.`);
            setTimeout(() => setFeedback(''), 3500);
        }
    };

    const columns = [
        { header: 'Offer ID', accessor: 'id' },
        { header: 'Amount', render: (row) => <span style={{ fontWeight: 500 }}>${row.amount.toLocaleString()}</span> },
        { header: 'Interest', render: (row) => `${row.interestRate}%` },
        { header: 'Duration', render: (row) => `${row.term} months` },
        {
            header: 'Description',
            render: (row) => row.description
                ? <span title={row.description} style={{ maxWidth: '200px', display: 'inline-block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.description}</span>
                : <span className="text-secondary-xs">—</span>
        },
        { header: 'Status', render: () => <span className="status-badge status-active">Open for Apps</span> },
        {
            header: 'Action',
            render: (row) => (
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row.id)}>
                    Remove
                </button>
            )
        },
    ];

    return (
        <div className="dashboard-container fade-in">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="page-title">My Loan Offers</h1>
                    <p className="page-subtitle">Manage the loan offers you have published to the marketplace.</p>
                </div>
                <button className="btn btn-primary" onClick={() => navigate('/lender/create-offer')}>
                    + Create Offer
                </button>
            </div>

            {feedback && (
                <div role="alert" aria-live="polite" className="alert-warning">
                    {feedback}
                </div>
            )}

            <div className="content-section" style={{ overflowX: 'auto' }}>
                {myOffers.length === 0 ? (
                    <div className="no-data">You haven't published any loan offers yet.</div>
                ) : (
                    <Table columns={columns} data={myOffers} />
                )}
            </div>
        </div>
    );
};

export default MyLoanOffers;
