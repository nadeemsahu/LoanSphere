import React from 'react';
import ChartPlaceholder from '../../components/ChartPlaceholder/ChartPlaceholder';
import { useDataContext } from '../../contexts/DataContext';
import '../../styles/dashboard.css';

const AnalyticsPage = () => {
    const { loans, transactions } = useDataContext();

    const totalOriginated = loans.reduce((acc, l) => acc + l.amount, 0);
    const activeLoans = loans.filter(l => l.status === 'Active').length;
    const avgLoanSize = loans.length ? Math.round(totalOriginated / loans.length) : 0;
    const totalTransacted = transactions.reduce((acc, t) => acc + t.amount, 0);

    return (
        <div className="dashboard-container fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Platform Analytics</h1>
                    <p className="page-subtitle">Read-only deep dive into loan origination and performance metrics</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ background: 'var(--surface-color)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Total Originated</p>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: 700 }}>${totalOriginated.toLocaleString()}</h3>
                </div>
                <div style={{ background: 'var(--surface-color)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Active Loans</p>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{activeLoans}</h3>
                </div>
                <div style={{ background: 'var(--surface-color)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Avg Loan Size</p>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: 700 }}>${avgLoanSize.toLocaleString()}</h3>
                </div>
                <div style={{ background: 'var(--surface-color)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Total Transacted</p>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: 700 }}>${totalTransacted.toLocaleString()}</h3>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div className="content-section">
                    <div className="section-header"><h3>Loan Volume Trend</h3></div>
                    <ChartPlaceholder title="Monthly Origination Volume" height="240px" />
                </div>
                <div className="content-section">
                    <div className="section-header"><h3>Default Rate Trend</h3></div>
                    <ChartPlaceholder title="Default Rate Over Time" height="240px" />
                </div>
            </div>

            <div className="content-section">
                <div className="section-header"><h3>Loan Status Distribution</h3></div>
                <div style={{ display: 'flex', gap: '2rem', padding: '1.5rem', flexWrap: 'wrap' }}>
                    {['Active', 'Pending', 'Closed', 'Defaulted'].map(status => {
                        const count = loans.filter(l => l.status === status).length;
                        return (
                            <div key={status} style={{ textAlign: 'center', minWidth: '80px' }}>
                                <div style={{ fontSize: '2rem', fontWeight: 700 }}>{count}</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{status}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
