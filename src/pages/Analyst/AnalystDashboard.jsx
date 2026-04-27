import React from 'react';
import DashboardCard from '../../components/DashboardCard/DashboardCard';
import { useDataContext } from '../../contexts/DataContext';
import '../../styles/dashboard.css';

const AnalystDashboard = () => {
    const { loans, payments } = useDataContext();

    // High-level system metrics
    const totalIssued = loans.reduce((acc, l) => acc + parseFloat(l.amount || 0), 0);
    const totalTransactions = payments.reduce((acc, t) => acc + parseFloat(t.amount || 0), 0);

    // Simulate estimated interest generated (computational fallback for analytical view)
    const estimatedInterest = loans.reduce((acc, l) => {
        const rate = parseFloat(l.interestRate || 5.0) / 100;
        return acc + (parseFloat(l.amount || 0) * rate);
    }, 0);

    const activeCount = loans.filter(l => l.status === 'ACTIVE').length;
    const closedCount = loans.filter(l => l.status === 'CLOSED').length;
    const defaultedCount = loans.filter(l => l.status === 'DEFAULTED').length;

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
                <div className="stats-summary-grid">
                    <div className="stats-summary-card">
                        <div className="stats-summary-label">Active Loans</div>
                        <div className="stats-summary-value">{activeCount}</div>
                    </div>
                    <div className="stats-summary-card">
                        <div className="stats-summary-label">Closed (Paid Off)</div>
                        <div className="stats-summary-value success">{closedCount}</div>
                    </div>
                    <div className="stats-summary-card">
                        <div className="stats-summary-label">Defaulted</div>
                        <div className="stats-summary-value danger">{defaultedCount}</div>
                    </div>
                    <div className="stats-summary-card">
                        <div className="stats-summary-label">Total Originated</div>
                        <div className="stats-summary-value">{loans.length}</div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AnalystDashboard;
