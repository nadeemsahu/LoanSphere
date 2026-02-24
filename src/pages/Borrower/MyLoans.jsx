import React from 'react';
import Table from '../../components/Table/Table';
import StatusTracker from '../../components/StatusTracker/StatusTracker';
import { useDataContext } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/dashboard.css';

const MyLoans = () => {
    const { user } = useAuth();
    const borrowerName = user?.name;
    const { loans } = useDataContext();

    // PS15: show only this borrower's own loans
    const myLoans = loans.filter(l => l.borrower === borrowerName);
    const activeLoan = myLoans.find(l => l.status === 'Active') || myLoans[0];

    const loanColumns = [
        { header: 'Loan ID', accessor: 'id' },
        { header: 'Amount', render: (row) => `$${row.amount.toLocaleString()}` },
        { header: 'Purpose', render: (row) => row.purpose || '—' },
        { header: 'Rate', render: (row) => `${row.interestRate}%` },
        { header: 'Term', render: (row) => `${row.term} months` },
        { header: 'Status', render: (row) => <span className={`status-badge status-${row.status.toLowerCase()}`}>{row.status}</span> },
        { header: 'Applied On', accessor: 'startDate' },
    ];

    return (
        <div className="dashboard-container fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">My Loans</h1>
                    <p className="page-subtitle">Track your loan applications and repayment status</p>
                </div>
            </div>

            {activeLoan && activeLoan.stages && activeLoan.stages.length > 0 && (
                <div className="content-section">
                    <div className="section-header">
                        <h3>Application Tracker — Loan #{activeLoan.id}</h3>
                        <span className={`status-badge status-${activeLoan.status.toLowerCase()}`}>{activeLoan.status}</span>
                    </div>
                    <StatusTracker stages={activeLoan.stages} />
                </div>
            )}

            <div className="content-section">
                <div className="section-header">
                    <h3>All My Loans ({myLoans.length})</h3>
                </div>
                {myLoans.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        You have no loans yet. Apply for a loan or browse available offers.
                    </div>
                ) : (
                    <Table columns={loanColumns} data={myLoans} />
                )}
            </div>
        </div>
    );
};

export default MyLoans;
