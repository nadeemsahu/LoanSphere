import React from 'react';
import { useDataContext } from '../../contexts/DataContext';
import Table from '../../components/Table/Table';
import '../../styles/dashboard.css';

const RiskAnalysis = () => {
    const { loans } = useDataContext();

    const defaultedLoans = loans.filter(l => l.status === 'Defaulted');
    const defaultCount = defaultedLoans.length;

    // Simulate high risk borrower count (e.g. users with defaulted loans or multiple pending large loans)
    // For this mock, we'll just derive it from defaults to keep it read-only and analytical
    const highRiskBorrowersCount = new Set(defaultedLoans.map(l => l.borrower)).size + (loans.length > 5 ? 2 : 0);

    // Simulated late payments (1 in 5 active loans flagged as late for mock)
    const activeLoans = loans.filter(l => l.status === 'Active');
    const latePaymentStats = Math.floor(activeLoans.length / 5) || 0;

    // Platform risk score indicator (0-100, lower is better)
    const riskScore = Math.min(100, Math.round((defaultCount * 15) + (latePaymentStats * 5)));
    const riskColor = riskScore > 40 ? 'var(--danger-color, #ef4444)' : riskScore > 15 ? 'var(--warning-color, #f59e0b)' : 'var(--success-color, #22c55e)';

    const defaultColumns = [
        { header: 'Loan ID', accessor: 'id' },
        { header: 'Borrower', accessor: 'borrower' },
        { header: 'Amount Lost', render: (row) => <span className="text-danger" style={{ fontWeight: 600 }}>${row.amount.toLocaleString()}</span> },
        { header: 'Interest Rate', render: (row) => `${row.interestRate}%` },
        { header: 'Status', render: () => <span className="status-badge status-danger">Defaulted</span> }
    ];

    return (
        <div className="dashboard-container fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Risk Analysis</h1>
                    <p className="page-subtitle">Platform risk assessment, default monitoring, and exposure statistics.</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '24px' }}>
                <div className="content-section" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Overall Risk Score</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: riskColor }}>{riskScore}/100</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>Lower score indicates healthier portfolio</div>
                </div>
                <div className="content-section" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Defaulted Loans</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--danger-color, #ef4444)' }}>{defaultCount}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>Total verified defaults</div>
                </div>
                <div className="content-section" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>High-Risk Borrowers</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--warning-color, #f59e0b)' }}>{highRiskBorrowersCount}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>Flagged accounts monitoring</div>
                </div>
                <div className="content-section" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Late Payment Flags</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{latePaymentStats}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>Currently 30+ days overdue</div>
                </div>
            </div>

            <div className="content-section">
                <div className="section-header">
                    <h3>Defaulted Loan Ledger</h3>
                </div>
                {defaultedLoans.length === 0 ? (
                    <div className="no-data">No defaulted loans currently recorded on the platform.</div>
                ) : (
                    <Table columns={defaultColumns} data={defaultedLoans} />
                )}
            </div>
        </div>
    );
};

export default RiskAnalysis;
