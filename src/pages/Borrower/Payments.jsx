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
    const [paymentError, setPaymentError] = useState('');

    // Isolate active loans just to this borrower
    const myLoans = loans.filter(l => String(l.userId) === String(user?.id) && l.status.toUpperCase() === 'ACTIVE');

    // Calculate remaining balances to determine if actually due
    const payableLoans = myLoans.map(loan => {
        const loanPayments = transactions.filter(t => String(t.loanId) === String(loan.id));
        const amountPaid = loanPayments.reduce((acc, p) => acc + parseFloat(p.amount), 0);
        const originalAmount = parseFloat(loan.amount);
        const remainingBalance = Math.max(0, originalAmount - amountPaid);

        // Calculate monthly EMI installment from principal ÷ term
        // (loan.nextPaymentAmount does not exist in backend DTO)
        const monthlyInstallment = loan.termMonths > 0
            ? parseFloat((originalAmount / loan.termMonths).toFixed(2))
            : originalAmount;
        // If remaining is less than one full installment, pay the remainder
        const dueAmount = remainingBalance < monthlyInstallment ? remainingBalance : monthlyInstallment;

        return {
            ...loan,
            amountPaid,
            remainingBalance,
            dueAmount,
            originalAmount
        };
    }).filter(loan => loan.remainingBalance > 0);

    const handlePayEmi = async (loanId, amount) => {
        setProcessingId(loanId);
        setPaymentError('');
        try {
            await addPayment(amount, borrowerName, loanId);
        } catch (err) {
            setPaymentError(`Payment failed: ${err.message || 'Please try again.'}`);
        } finally {
            setProcessingId(null);
        }
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

    const myLoanIds = myLoans.map(l => String(l.id));
    const historicalPayments = transactions.filter(t => myLoanIds.includes(String(t.loanId)));

    const historyColumns = [
        { header: 'TxID', accessor: 'id' },
        { header: 'Loan ID', render: (row) => row.loanId || '—' },
        { header: 'Amount', render: (row) => <span className="text-primary">+${parseFloat(row.amount).toLocaleString()}</span> },
        { header: 'Date', accessor: 'paymentDate' },
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

            {paymentError && (
                <div role="alert" aria-live="polite" className="alert-error">
                    ⚠️ {paymentError}
                </div>
            )}

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
