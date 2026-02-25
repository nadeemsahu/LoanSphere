import React from 'react';
import { useDataContext } from '../../contexts/DataContext';
import ChartPlaceholder from '../../components/ChartPlaceholder/ChartPlaceholder';
import '../../styles/dashboard.css';

const LoanAnalytics = () => {
    const { loans } = useDataContext();

    const totalLoans = loans.length;

    // Groupings
    const statuses = ['Active', 'Pending', 'Closed', 'Defaulted'];
    const distribution = statuses.reduce((acc, status) => {
        acc[status] = loans.filter(l => l.status === status).length;
        return acc;
    }, {});

    const totalVolume = loans.reduce((acc, l) => acc + parseFloat(l.amount || 0), 0);
    const avgLoanSize = totalLoans > 0 ? totalVolume / totalLoans : 0;

    const avgInterestRate = totalLoans > 0
        ? loans.reduce((acc, l) => acc + parseFloat(l.interestRate || 0), 0) / totalLoans
        : 0;

    return (
        <div className="dashboard-container fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Loan Analytics</h1>
                    <p className="page-subtitle">Deep dive into loan distributions, averages, and system-wide metrics.</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '24px' }}>
                <div className="content-section" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Average Loan Amount</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>${avgLoanSize.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                </div>
                <div className="content-section" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Average Interest Rate</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>{avgInterestRate.toFixed(2)}%</div>
                </div>
            </div>

            <div className="content-grid-2-1" style={{ marginBottom: '24px' }}>
                <div className="content-section">
                    <div className="section-header"><h3>Status Distribution</h3></div>
                    <div style={{ padding: '16px 24px' }}>
                        {statuses.map(status => {
                            const count = distribution[status];
                            const percentage = totalLoans > 0 ? ((count / totalLoans) * 100).toFixed(1) : 0;
                            return (
                                <div key={status} style={{ marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.875rem' }}>
                                        <span style={{ fontWeight: 500 }}>{status}</span>
                                        <span style={{ color: 'var(--text-secondary)' }}>{count} ({percentage}%)</span>
                                    </div>
                                    <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{
                                            width: `${percentage}%`,
                                            height: '100%',
                                            backgroundColor: status === 'Active' ? 'var(--primary-color)' : status === 'Closed' ? 'var(--success-color, #22c55e)' : status === 'Defaulted' ? 'var(--danger-color, #ef4444)' : 'var(--text-tertiary)'
                                        }}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="content-section">
                    <div className="section-header"><h3>Volume Trend Simulation</h3></div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '24px' }}>
                        <ChartPlaceholder title="Origination Flow" height="200px" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoanAnalytics;
