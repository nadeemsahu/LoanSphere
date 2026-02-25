import React from 'react';
import Table from '../../components/Table/Table';
import { useDataContext } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/dashboard.css';

const PaymentTracking = () => {
    const { transactions, loans } = useDataContext();
    const { user } = useAuth();
    const lenderName = user?.name || 'Lender';

    // To track payments, we must identify which payments belong to this lender.
    // 1. Identify all borrowers for this lender's approved loans.
    const myLoans = loans.filter(l => l.approvedBy === lenderName);
    const myBorrowers = myLoans.map(l => l.borrower);

    // 2. Filter transactions to only 'Payment' types from those borrowers.
    const myPayments = transactions.filter(t => t.type === 'Payment' && myBorrowers.includes(t.borrower));

    // 3. For extra detail requested (Remaining Balance), we map the payments to their respective loan remaining balances
    const enrichedPayments = myPayments.map(payment => {
        // Try to find the exact loan this payment was for (mock data might rely purely on borrower name)
        const relatedLoan = myLoans.find(l => l.id === payment.loanId || l.borrower === payment.borrower);

        let remainingBalance = 0;
        if (relatedLoan) {
            // Calculate remaining balance dynamically for realistic display
            const loanPayments = transactions.filter(t => t.type === 'Payment' && (t.loanId === relatedLoan.id || t.borrower === relatedLoan.borrower));
            const amountPaid = loanPayments.reduce((acc, p) => acc + parseFloat(p.amount), 0);
            const originalAmount = parseFloat(relatedLoan.amount);
            remainingBalance = Math.max(0, originalAmount - amountPaid);
        }

        return {
            ...payment,
            relatedLoanId: relatedLoan?.id || '—',
            remainingBalance
        };
    });

    const columns = [
        { header: 'TxID', accessor: 'id' },
        { header: 'Borrower', render: (row) => <span style={{ fontWeight: 500 }}>{row.borrower}</span> },
        { header: 'Loan ID', accessor: 'relatedLoanId' },
        { header: 'Amount Paid', render: (row) => <span className="text-primary" style={{ fontWeight: 600 }}>+${row.amount.toLocaleString()}</span> },
        { header: 'Date', accessor: 'date' },
        { header: 'Remaining Balance', render: (row) => row.remainingBalance > 0 ? `$${row.remainingBalance.toLocaleString()}` : <span className="text-secondary-xs">Paid Off</span> },
    ];

    return (
        <div className="dashboard-container fade-in">
            <div className="page-header">
                <h1 className="page-title">Payment Tracking</h1>
                <p className="page-subtitle">Auto-updated ledger of all deposits made by your borrowers.</p>
            </div>

            <div className="content-section" style={{ overflowX: 'auto' }}>
                {enrichedPayments.length === 0 ? (
                    <div className="no-data">No payments have been received from your borrowers yet.</div>
                ) : (
                    <Table columns={columns} data={enrichedPayments} />
                )}
            </div>
        </div>
    );
};

export default PaymentTracking;
