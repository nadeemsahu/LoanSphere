import React from 'react';
import DashboardCard from '../../components/DashboardCard/DashboardCard';
import { useDataContext } from '../../contexts/DataContext';
import '../../styles/dashboard.css';

const AnalystDashboard = () => {
    const { loans, transactions } = useDataContext();

    // High-level system metrics
    const totalIssued = loans.reduce((acc, l) => acc + parseFloat(l.amount || 0), 0);
    const totalTransactions = transactions.reduce((acc, t) => acc + parseFloat(t.amount || 0), 0);

    // Simulate estimated interest generated (mock computation for analytical view)
    const estimatedInterest = loans.reduce((acc, l) => {
        const rate = parseFloat(l.interestRate || 0) / 100;
        return acc + (parseFloat(l.amount || 0) * rate);
    }, 0);

    const activeCount = loans.filter(l => l.status === 'Active').length;
    const closedCount = loans.filter(l => l.status === 'Closed').length;
    const defaultedCount = loans.filter(l => l.status === 'Defaulted').length;

    return (
        <div className="dashboard-container fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Executive Analytics Dashboard</h1>
                    <p className="page-subtitle">High-level read-only overview of platform performance and volume.</p>
                </div>
            </div>

            <div className="dashboard-grid" style={{ marginBottom: '24px' }}>
                <DashboardCard title="Total Loan Volume" value={`$${(totalIssued / 1000).toFixed(1)}k`} label="Lifetime Origin" icon="📈" />
                <DashboardCard title="Transaction Volume" value={`$${(totalTransactions / 1000).toFixed(1)}k`} label="Capital Moved" icon="💸" />
                <DashboardCard title="Est. Interest Yield" value={`$${estimatedInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} label="Projected Revenue" icon="💰" />
            </div>

            <div className="content-section" style={{ padding: '24px' }}>
                <div className="section-header" style={{ marginBottom: '24px' }}>
                    <h3>Portfolio Count Summary</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div style={{ padding: '20px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Active Loans</div>
                        <div style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--primary-color)' }}>{activeCount}</div>
                    </div>
                    <div style={{ padding: '20px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Closed (Paid Off)</div>
                        <div style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--success-color, #22c55e)' }}>{closedCount}</div>
                    </div>
                    <div style={{ padding: '20px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Defaulted</div>
                        <div style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--danger-color, #ef4444)' }}>{defaultedCount}</div>
                    </div>
                    <div style={{ padding: '20px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Total Originated</div>
                        <div style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--text-primary)' }}>{loans.length}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalystDashboard;
