import React from 'react';
import Table from '../../components/Table/Table';
import { useDataContext } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/dashboard.css';

const ActiveLoans = () => {
    const { loans, transactions } = useDataContext();
    const { user } = useAuth();
    const lenderName = user?.name || 'Lender';

    // Get all loans managed by this lender that are not pending or rejected.
    const activePortfolio = loans.filter(l => (l.approvedBy === user?.name) && l.status.toUpperCase() !== 'PENDING' && l.status.toUpperCase() !== 'REJECTED');

    // Calculate remaining balance dynamically for realistic display
    const enrichedPortfolio = activePortfolio.map(loan => {
        // Find payments purely for this loan by loanId
        const loanPayments = transactions.filter(t => String(t.loanId) === String(loan.id));
        const amountPaid = loanPayments.reduce((acc, p) => acc + parseFloat(p.amount), 0);
        const originalAmount = parseFloat(loan.amount);
        // Simple remaining balance calculation (ignoring complex interest mechanics for UI mock)
        const remaining = Math.max(0, originalAmount - amountPaid);

        // Adjust mock status to CLOSED if fully paid
        const currentStatus = remaining === 0 ? 'CLOSED' : loan.status;

        return {
            ...loan,
            amountPaid,
            remainingBalance: remaining,
            currentStatus,
        };
    });

    const columns = [
        { header: 'Loan ID', accessor: 'id' },
        { header: 'Borrower', render: (row) => <span style={{ fontWeight: 500 }}>{row.borrowerName}</span> },
        { header: 'Amount Issued', render: (row) => `$${row.amount.toLocaleString()}` },
        { header: 'Interest Rate', render: (row) => `${row.interestRate}%` },
        { header: 'Remaining Balance', render: (row) => <span style={{ color: row.remainingBalance === 0 ? 'var(--text-secondary)' : 'var(--text-primary)', fontWeight: 600 }}>${row.remainingBalance.toLocaleString()}</span> },
        { header: 'Status', render: (row) => <span className={`status-badge status-${row.currentStatus.toLowerCase()}`}>{row.currentStatus}</span> },
    ];

    return (
        <div className="dashboard-container fade-in">
            <div className="page-header">
                <h1 className="page-title">Active Loans</h1>
                <p className="page-subtitle">Monitor the performance and status of your approved loans.</p>
            </div>

            <div className="content-section" style={{ overflowX: 'auto' }}>
                {enrichedPortfolio.length === 0 ? (
                    <div className="no-data">You have no active or closed loans in your portfolio.</div>
                ) : (
                    <Table columns={columns} data={enrichedPortfolio} />
                )}
            </div>
        </div>
    );
};

export default ActiveLoans;
