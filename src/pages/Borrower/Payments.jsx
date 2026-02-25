import React, { useState } from 'react';
import Table from '../../components/Table/Table';
import { useDataContext } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/dashboard.css';

const Payments = () => {
    const { user } = useAuth();
    const borrowerName = user?.name || 'Borrower';
    const { loans, transactions, addPayment } = useDataContext();

    const [processingId, setProcessingId] = useState(null);

    // Isolate active loans just to this borrower
    const myLoans = loans.filter(l => l.borrower === borrowerName && l.status === 'Active');

    // Calculate remaining balances to determine if actually due
    const payableLoans = myLoans.map(loan => {
        const loanPayments = transactions.filter(t => t.type === 'Payment' && t.borrower === borrowerName && t.loanId === loan.id);
        const amountPaid = loanPayments.reduce((acc, p) => acc + parseFloat(p.amount), 0);
        const originalAmount = parseFloat(loan.amount);
        const remainingBalance = Math.max(0, originalAmount - amountPaid);

        // Mock EMI - If they owe more than structured nextPaymentAmount, they pay that.
        // If they owe less, they just pay the remainder to clear the loan.
        let dueAmount = parseFloat(loan.nextPaymentAmount || 0);
        if (remainingBalance < dueAmount) dueAmount = remainingBalance;

        return {
            ...loan,
            amountPaid,
            remainingBalance,
            dueAmount,
            originalAmount
        };
    }).filter(loan => loan.remainingBalance > 0);

    const handlePayEmi = (loanId, amount) => {
        setProcessingId(loanId);

        // Simulate network/db processing delay for realistic UX
        setTimeout(() => {
            addPayment(amount, borrowerName, loanId);
            setProcessingId(null);
        }, 800);
    };

    const columns = [
        { header: 'Loan ID', accessor: 'id' },
        { header: 'Lender', accessor: 'approvedBy' },
        { header: 'Total Debt', render: (row) => `$${row.originalAmount.toLocaleString()}` },
        { header: 'Remaining Balance', render: (row) => <span className="text-primary" style={{ fontWeight: 600 }}>${row.remainingBalance.toLocaleString()}</span> },
        { header: 'EMI Amount Due', render: (row) => `$${row.dueAmount.toLocaleString()}` },
        {
            header: 'Action',
            render: (row) => (
                <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handlePayEmi(row.id, row.dueAmount)}
                    disabled={processingId !== null}
                >
                    {processingId === row.id ? 'Processing...' : `Pay $${row.dueAmount.toLocaleString()}`}
                </button>
            )
        },
    ];

    const historicalPayments = transactions.filter(t => t.type === 'Payment' && t.borrower === borrowerName);

    const historyColumns = [
        { header: 'TxID', accessor: 'id' },
        { header: 'Loan ID', render: (row) => row.loanId || '—' },
        { header: 'Amount', render: (row) => <span className="text-primary">+${parseFloat(row.amount).toLocaleString()}</span> },
        { header: 'Date', accessor: 'date' },
        { header: 'Status', render: () => <span className="status-badge status-success">Success</span> },
    ];

    return (
        <div className="dashboard-container fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Payments & EMI</h1>
                    <p className="page-subtitle">Simulate real-time EMI payments to diminish your active loan balances.</p>
                </div>
            </div>

            <div className="content-section" style={{ overflowX: 'auto', marginBottom: '24px' }}>
                <div className="section-header">
                    <h3>Due Payments Overview</h3>
                    <span className="badge-count">{payableLoans.length}</span>
                </div>
                {payableLoans.length === 0 ? (
                    <div className="no-data">No EMIs currently due. You're all caught up!</div>
                ) : (
                    <Table columns={columns} data={payableLoans} />
                )}
            </div>

            <div className="content-section" style={{ overflowX: 'auto' }}>
                <div className="section-header">
                    <h3>Payment History</h3>
                </div>
                {historicalPayments.length === 0 ? (
                    <div className="no-data">No payments made yet.</div>
                ) : (
                    <Table columns={historyColumns} data={historicalPayments} />
                )}
            </div>
        </div>
    );
};

export default Payments;
