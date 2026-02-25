import React from 'react';
import Table from '../../components/Table/Table';
import { useDataContext } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/dashboard.css';

const MyApplications = () => {
    const { user } = useAuth();
    const borrowerName = user?.name || 'Borrower';
    const { loans } = useDataContext();

    // Show all loans for this borrower that are pending or rejected
    // (If approved, they usually move fully to the "My Loans" active section conceptually, 
    // but for completeness tracking, we can show all application histories here.)
    const myApplications = loans.filter(l => l.borrower === borrowerName);

    const columns = [
        { header: 'App ID', accessor: 'id' },
        { header: 'Lender', render: (row) => <span style={{ fontWeight: 500 }}>{row.approvedBy || 'Assigning...'}</span> },
        { header: 'Amount Requested', render: (row) => `$${row.amount.toLocaleString()}` },
        { header: 'Interest Rate', render: (row) => `${row.interestRate}%` },
        { header: 'Date Applied', accessor: 'startDate' },
        { header: 'Status', render: (row) => <span className={`status-badge status-${row.status.toLowerCase()}`}>{row.status}</span> },
    ];

    return (
        <div className="dashboard-container fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">My Applications</h1>
                    <p className="page-subtitle">Track the status of your submitted loan requests.</p>
                </div>
            </div>

            <div className="content-section" style={{ overflowX: 'auto' }}>
                {myApplications.length === 0 ? (
                    <div className="no-data">You haven't applied for any loans yet.</div>
                ) : (
                    <Table columns={columns} data={myApplications} />
                )}
            </div>
        </div>
    );
};

export default MyApplications;
