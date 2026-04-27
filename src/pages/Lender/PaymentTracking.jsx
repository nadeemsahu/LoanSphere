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
    const myLoans = loans.filter(l => l.approvedBy === user?.name);
    const myLoanIds = myLoans.map(l => String(l.id));

    // 2. Filter transactions to only those matching my loan IDs.
    const myPayments = transactions.filter(t => myLoanIds.includes(String(t.loanId)));

    // 3. For extra detail requested (Remaining Balance), we map the payments to their respective loan remaining balances
    const enrichedPayments = myPayments.map(payment => {
        const relatedLoan = myLoans.find(l => String(l.id) === String(payment.loanId));

        let remainingBalance = 0;
        if (relatedLoan) {
            const loanPayments = transactions.filter(t => String(t.loanId) === String(relatedLoan.id));
            const amountPaid = loanPayments.reduce((acc, p) => acc + parseFloat(p.amount), 0);
            const originalAmount = parseFloat(relatedLoan.amount);
            remainingBalance = Math.max(0, originalAmount - amountPaid);
        }

        return {
            ...payment,
            relatedLoanId: relatedLoan?.id || '—',
            borrowerName: relatedLoan?.borrowerName || 'Borrower',
            remainingBalance
        };
    });

    const columns = [
        { header: 'TxID', accessor: 'id' },
        { header: 'Borrower', render: (row) => <span style={{ fontWeight: 500 }}>{row.borrowerName}</span> },
        { header: 'Loan ID', accessor: 'relatedLoanId' },
        { header: 'Amount Paid', render: (row) => <span className="text-primary" style={{ fontWeight: 600 }}>+${parseFloat(row.amount).toLocaleString()}</span> },
        { header: 'Date', accessor: 'paymentDate' },
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
