import React from 'react';
import { useDataContext } from '../../contexts/DataContext';
import Table from '../../components/Table/Table';
import '../../styles/dashboard.css';

const Transactions = () => {
    const { transactions, loans, users } = useDataContext();

    // Enrich transactions with borrower names and ensure default values exist
    const enrichedTransactions = (transactions || []).map(tx => {
        const loan = loans.find(l => String(l.id) === String(tx.loanId));
        const borrower = users.find(u => String(u.id) === String(loan?.userId));
        return {
            ...tx,
            borrowerName: borrower?.name || 'System',
            displayStatus: tx.status || 'Success',
            displayType: tx.type || 'Payment',
            displayAmount: tx.amount ? parseFloat(tx.amount) : 0
        };
    });

    // Pure read-only rendering without any actions mapped
    const columns = [
        { header: 'ID', accessor: 'id' },
        { header: 'Loan ID', render: (row) => row.loanId || 'System' },
        { header: 'Borrower', accessor: 'borrowerName' },
        { header: 'Amount', render: (row) => `$${row.displayAmount.toLocaleString()}` },
        { header: 'Date', accessor: 'paymentDate' },
        { 
            header: 'Type', 
            render: (row) => (
                <span className={`status-badge ${(row.displayType === 'Payment') ? 'status-success' : 'status-pending'}`}>
                    {row.displayType}
                </span>
            ) 
        },
        { 
            header: 'Status', 
            render: (row) => (
                <span className={`status-badge status-${row.displayStatus.toLowerCase()}`}>
                    {row.displayStatus}
                </span>
            ) 
        },
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
                    <span className="badge-count">{enrichedTransactions.length}</span>
                </div>
                {enrichedTransactions.length === 0 ? (
                    <div className="no-data">No transactions have been recorded on the platform yet.</div>
                ) : (
                    <Table columns={columns} data={enrichedTransactions} />
                )}
            </div>
        </div>
    );
};

export default Transactions;
