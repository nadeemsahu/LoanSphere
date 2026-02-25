import React, { useState } from 'react';
import Table from '../../components/Table/Table';
import { useDataContext } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/dashboard.css';

const BorrowerApplications = () => {
    const { loans, approveLoan, rejectLoanApplication } = useDataContext();
    const { user } = useAuth();
    const lenderName = user?.name || 'Lender';

    const [actionFeedback, setActionFeedback] = useState('');

    const showFeedback = (msg) => {
        setActionFeedback(msg);
        setTimeout(() => setActionFeedback(''), 3500);
    };

    const handleApprove = (id) => {
        approveLoan(id, lenderName);
        showFeedback(`✅ Application #${id} approved! Loan is now active.`);
    };

    const handleReject = (id) => {
        const confirm = window.confirm(`Are you sure you want to reject application #${id}?`);
        if (confirm) {
            rejectLoanApplication(id, lenderName);
            showFeedback(`Application #${id} has been rejected.`);
        }
    };

    const pendingApplications = loans.filter(l => l.status === 'Pending' && l.approvedBy === lenderName);

    const columns = [
        { header: 'App ID', accessor: 'id' },
        { header: 'Borrower', render: (row) => <span style={{ fontWeight: 500 }}>{row.borrower}</span> },
        { header: 'Amount Requested', render: (row) => `$${row.amount.toLocaleString()}` },
        { header: 'Interest Rate', render: (row) => `${row.interestRate}%` },
        { header: 'Term', render: (row) => `${row.term} months` },
        { header: 'Purpose', render: (row) => row.purpose || <span className="text-secondary-xs">—</span> },
        { header: 'Status', render: (row) => <span className={`status-badge status-${row.status.toLowerCase()}`}>{row.status}</span> },
        {
            header: 'Actions',
            render: (row) => (
                <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => handleApprove(row.id)}>
                        Approve
                    </button>
                    <button className="btn btn-outline btn-sm" style={{ color: '#ef4444', borderColor: '#ef4444' }} onClick={() => handleReject(row.id)}>
                        Reject
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="dashboard-container fade-in">
            <div className="page-header">
                <h1 className="page-title">Borrower Applications</h1>
                <p className="page-subtitle">Review and decision applications for your loan offers.</p>
            </div>

            {actionFeedback && (
                <div role="alert" aria-live="polite" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.4)', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', color: '#22c55e', fontSize: '0.875rem', fontWeight: 500 }}>
                    {actionFeedback}
                </div>
            )}

            <div className="content-section" style={{ overflowX: 'auto' }}>
                {pendingApplications.length === 0 ? (
                    <div className="no-data">No pending applications right now.</div>
                ) : (
                    <Table columns={columns} data={pendingApplications} />
                )}
            </div>
        </div>
    );
};

export default BorrowerApplications;
