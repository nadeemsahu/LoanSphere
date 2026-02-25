import React, { useState } from 'react';
import Table from '../../components/Table/Table';
import { useDataContext } from '../../contexts/DataContext';

const TransactionMonitoring = () => {
    const { transactions } = useDataContext();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTransactions = transactions.filter(t => {
        const term = searchTerm.toLowerCase();
        return (
            String(t.id).toLowerCase().includes(term) ||
            (t.borrower && t.borrower.toLowerCase().includes(term)) ||
            (t.loanId && String(t.loanId).toLowerCase().includes(term))
        );
    });

    const columns = [
        { header: 'TxID', accessor: 'id' },
        { header: 'Loan ID', render: (row) => row.loanId || <span className="text-secondary-xs">—</span> },
        { header: 'User', render: (row) => row.borrower || <span className="text-secondary-xs">System</span> },
        { header: 'Amount', render: (row) => <span style={{ fontWeight: 500 }}>${row.amount.toLocaleString()}</span> },
        { header: 'Date', accessor: 'date' },
        { header: 'Type', accessor: 'type' },
        { header: 'Status', render: (row) => <span className={`status-badge status-${(row.status || 'success').toLowerCase()}`}>{row.status || 'Success'}</span> },
    ];

    return (
        <div className="dashboard-container fade-in">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 className="page-title">Transaction Monitoring</h1>
                    <p className="page-subtitle">Read-only view of global platform financial activities.</p>
                </div>
                <div style={{ flex: '1', maxWidth: '300px' }}>
                    <input
                        type="text"
                        placeholder="Search by TxID, Loan ID, or User..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-input"
                        style={{ width: '100%' }}
                    />
                </div>
            </div>

            <div className="content-section" style={{ overflowX: 'auto' }}>
                {filteredTransactions.length === 0 ? (
                    <div className="no-data">No transactions match your search.</div>
                ) : (
                    <Table columns={columns} data={filteredTransactions} />
                )}
            </div>
        </div>
    );
};

export default TransactionMonitoring;
