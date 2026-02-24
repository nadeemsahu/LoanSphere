import React, { useState } from 'react';
import Table from '../../components/Table/Table';
import Button from '../../components/Button/Button';
import { useDataContext } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/dashboard.css';

const Payments = () => {
    const { user } = useAuth();
    const borrowerName = user?.name;
    const { loans, transactions, addPayment } = useDataContext();
    const [processing, setProcessing] = useState(null);
    const [feedbackMsg, setFeedbackMsg] = useState('');

    // PS15: Borrower sees only own active loans and own payments
    const myLoans = loans.filter(l => l.borrower === borrowerName && l.status === 'Active');
    const myPayments = transactions.filter(t => t.type === 'Payment' && t.borrower === borrowerName);
    const totalPaid = myPayments.reduce((acc, t) => acc + t.amount, 0);

    const handleMakePayment = (loan) => {
        if (processing) return;
        setProcessing(loan.id);
        setTimeout(() => {
            const amount = loan.nextPaymentAmount || 500;
            addPayment(amount, borrowerName, loan.id);
            setProcessing(null);
            setFeedbackMsg(`✅ EMI payment of $${amount.toLocaleString()} for Loan #${loan.id} processed successfully!`);
            setTimeout(() => setFeedbackMsg(''), 5000);
        }, 700);
    };

    const txnColumns = [
        { header: 'TxID', accessor: 'id' },
        { header: 'Date', accessor: 'date' },
        { header: 'Amount', render: (row) => `$${row.amount.toLocaleString()}` },
        { header: 'Type', accessor: 'type' },
        { header: 'Status', render: (row) => <span className="status-badge status-success">{row.status}</span> },
    ];

    return (
        <div className="dashboard-container fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Payments &amp; EMI</h1>
                    <p className="page-subtitle">Your payment schedule and history</p>
                </div>
            </div>

            {feedbackMsg && (
                <div role="alert" aria-live="polite" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.4)', padding: '0.875rem 1rem', borderRadius: '8px', marginBottom: '1rem', color: '#22c55e', fontWeight: 500, fontSize: '0.9rem' }}>
                    {feedbackMsg}
                </div>
            )}

            {myLoans.length === 0 ? (
                <div className="no-data">
                    No active loans found. Apply for a loan to see EMI details here.
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    {myLoans.map(loan => (
                        <div key={loan.id} className="content-section">
                            <div className="section-header">
                                <h3>Loan #{loan.id}</h3>
                                <span className="status-badge status-active">Active</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Outstanding</span>
                                    <strong>${loan.amount.toLocaleString()}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Interest Rate</span>
                                    <strong>{loan.interestRate}%</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Term</span>
                                    <strong>{loan.term} months</strong>
                                </div>
                                <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0.25rem 0' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>EMI Due</div>
                                        <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>${(loan.nextPaymentAmount || 500).toLocaleString()}</div>
                                    </div>
                                    <Button
                                        variant="primary"
                                        onClick={() => handleMakePayment(loan)}
                                        disabled={processing === loan.id}
                                        aria-label={`Pay EMI for loan ${loan.id}`}
                                    >
                                        {processing === loan.id ? 'Processing…' : 'Pay EMI'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="content-section">
                <div className="section-header">
                    <h3>Payment History ({myPayments.length})</h3>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        Total Paid: <strong style={{ color: 'var(--text-primary)' }}>${totalPaid.toLocaleString()}</strong>
                    </span>
                </div>
                {myPayments.length === 0 ? (
                    <div className="no-data">No payments recorded yet.</div>
                ) : (
                    <Table columns={txnColumns} data={myPayments} />
                )}
            </div>
        </div>
    );
};

export default Payments;
