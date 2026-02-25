import React from 'react';
import Table from '../../components/Table/Table';
import StatusTracker from '../../components/StatusTracker/StatusTracker';
import { useDataContext } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/dashboard.css';

const MyLoans = () => {
    const { user } = useAuth();
    const borrowerName = user?.name || 'Borrower';
    const { loans, transactions } = useDataContext();

    // Isolate loans just to this borrower
    const myLoans = loans.filter(l => l.borrower === borrowerName);

    // Specifically show active or completed loans here
    const activeAndClosed = myLoans.filter(l => l.status === 'Active' || l.status === 'Closed' || l.status === 'Defaulted');

    // Create an enriched array with dynamic remaining balance calculations
    const enrichedLoans = activeAndClosed.map(loan => {
        // Find all payments made to this specific loan
        const loanPayments = transactions.filter(t => t.type === 'Payment' && t.borrower === borrowerName && t.loanId === loan.id);
        const amountPaid = loanPayments.reduce((acc, p) => acc + parseFloat(p.amount), 0);

        const originalAmount = parseFloat(loan.amount);
        const remainingBalance = Math.max(0, originalAmount - amountPaid);

        const isClosed = remainingBalance === 0 && loan.status === 'Active'; // Pseudo determination

        return {
            ...loan,
            remainingBalance,
            displayStatus: isClosed ? 'Closed' : loan.status,
            amountPaid
        };
    });

    const columns = [
        { header: 'Loan ID', accessor: 'id' },
        { header: 'Lender', accessor: 'approvedBy' },
        { header: 'Principal', render: (row) => `$${row.amount.toLocaleString()}` },
        { header: 'Interest Rate', render: (row) => `${row.interestRate}%` },
        { header: 'Remaining Balance', render: (row) => row.remainingBalance > 0 ? <span className="text-primary" style={{ fontWeight: 600 }}>${row.remainingBalance.toLocaleString()}</span> : <span className="text-secondary-xs">Paid Off</span> },
        { header: 'Status', render: (row) => <span className={`status-badge status-${row.displayStatus.toLowerCase()}`}>{row.displayStatus}</span> },
    ];

    return (
        <div className="dashboard-container fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">My Loans</h1>
                    <p className="page-subtitle">Manage and track your active debt portions.</p>
                </div>
            </div>

            <div className="content-section" style={{ overflowX: 'auto', marginBottom: '24px' }}>
                <div className="section-header">
                    <h3>Active & History</h3>
                </div>
                {enrichedLoans.length === 0 ? (
                    <div className="no-data">You have no active or completed loans at this time.</div>
                ) : (
                    <Table columns={columns} data={enrichedLoans} />
                )}
            </div>

            {enrichedLoans.map(loan => (
                <div key={loan.id} className="content-section" style={{ marginBottom: '24px' }}>
                    <div className="section-header">
                        <h3>Status Tracker — #{loan.id}</h3>
                        <span className={`status-badge status-${loan.displayStatus.toLowerCase()}`}>{loan.displayStatus}</span>
                    </div>
                    {/* Render status stages provided from Context processing */}
                    {loan.stages && loan.stages.length > 0 ? (
                        <StatusTracker stages={loan.stages} />
                    ) : (
                        <p className="text-secondary-xs" style={{ padding: '0 24px 24px' }}>No tracking stages available for this older loan.</p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default MyLoans;
