import React from 'react';
import Table from '../../components/Table/Table';
import { useDataContext } from '../../contexts/DataContext';

const LoanMonitoring = () => {
    const { loans } = useDataContext();

    const columns = [
        { header: 'Loan ID', accessor: 'id' },
        { header: 'Borrower', render: (row) => <span style={{ fontWeight: 500 }}>{row.borrower}</span> },
        { header: 'Lender', render: (row) => row.approvedBy ? row.approvedBy : <span className="text-secondary-xs">Unassigned</span> },
        { header: 'Amount', render: (row) => `$${row.amount.toLocaleString()}` },
        { header: 'Interest', render: (row) => `${row.interestRate}%` },
        { header: 'Duration', render: (row) => `${row.term} months` },
        { header: 'Status', render: (row) => <span className={`status-badge status-${row.status.toLowerCase()}`}>{row.status}</span> },
    ];

    return (
        <div className="dashboard-container fade-in">
            <div className="page-header">
                <h1 className="page-title">Loan Monitoring</h1>
                <p className="page-subtitle">Read-only view of all multi-party loans across the platform.</p>
            </div>

            <div className="content-section" style={{ overflowX: 'auto' }}>
                {loans.length === 0 ? (
                    <div className="no-data">No loans active or pending in the system.</div>
                ) : (
                    <Table columns={columns} data={loans} />
                )}
            </div>
        </div>
    );
};

export default LoanMonitoring;
