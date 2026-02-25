import React from 'react';
import { useDataContext } from '../../contexts/DataContext';
import Table from '../../components/Table/Table';
import '../../styles/dashboard.css';

const Transactions = () => {
    const { transactions } = useDataContext();

    // Pure read-only rendering without any actions mapped
    const columns = [
        { header: 'Transaction ID', accessor: 'id' },
        { header: 'Loan ID', render: (row) => row.loanId || 'System' },
        { header: 'Borrower', accessor: 'borrower' },
        { header: 'Amount', render: (row) => `$${row.amount.toLocaleString()}` },
        { header: 'Date', accessor: 'date' },
        { header: 'Type', render: (row) => <span className={`status-badge ${row.type === 'Payment' ? 'status-success' : 'status-pending'}`}>{row.type}</span> },
        { header: 'Status', render: (row) => <span className={`status-badge status-${row.status.toLowerCase()}`}>{row.status}</span> },
    ];

    return (
        <div className="dashboard-container fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Transaction Monitoring</h1>
                    <p className="page-subtitle">Read-only global ledger of all platform financial movements.</p>
                </div>
            </div>

            <div className="content-section">
                <div className="section-header">
                    <h3>Global Financial Ledger</h3>
                    <span className="badge-count">{transactions.length}</span>
                </div>
                {transactions.length === 0 ? (
                    <div className="no-data">No transactions have been recorded on the platform yet.</div>
                ) : (
                    <Table columns={columns} data={transactions} />
                )}
            </div>
        </div>
    );
};

export default Transactions;
