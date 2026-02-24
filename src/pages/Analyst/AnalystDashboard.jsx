import React, { useState } from 'react';
import DashboardCard from '../../components/DashboardCard/DashboardCard';
import ChartPlaceholder from '../../components/ChartPlaceholder/ChartPlaceholder';
import Table from '../../components/Table/Table';
import Button from '../../components/Button/Button';
import { useDataContext } from '../../contexts/DataContext';
import '../../styles/dashboard.css';

const AnalystDashboard = () => {
    const { loans, transactions } = useDataContext();
    const [exportMsg, setExportMsg] = useState('');

    const handleExportPDF = () => {
        setExportMsg('PDF report export initiated. Your download will begin shortly.');
        setTimeout(() => setExportMsg(''), 4000);
    };

    // Read-only risk assessment columns — NO action buttons
    const riskColumns = [
        { header: 'Loan ID', accessor: 'id' },
        { header: 'Borrower', accessor: 'borrower' },
        { header: 'Amount', render: (row) => `$${row.amount.toLocaleString()}` },
        {
            header: 'Risk Level', render: (row) => {
                const label = row.status === 'Active' ? 'Low' : row.status === 'Pending' ? 'Medium' : 'High';
                const cls = label === 'Low' ? 'success' : label === 'Medium' ? 'pending' : 'danger';
                return <span className={`status-badge status-${cls}`}>{label}</span>;
            }
        },
        { header: 'Status', render: (row) => <span className={`status-badge status-${row.status.toLowerCase()}`}>{row.status}</span> },
    ];

    // Computed metrics from live context data
    const totalVolume = loans.reduce((acc, l) => acc + l.amount, 0);
    const activeCount = loans.filter(l => l.status === 'Active').length;
    const defaultCount = loans.filter(l => l.status === 'Defaulted').length;
    const defaultRate = loans.length ? ((defaultCount / loans.length) * 100).toFixed(1) : '0.0';
    const avgLoanSize = loans.length ? Math.round(totalVolume / loans.length) : 0;

    return (
        <div className="dashboard-container fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Financial Analytics</h1>
                    <p className="page-subtitle">Read-only market trends and risk assessment</p>
                </div>
                <div className="header-actions">
                    <Button variant="primary" onClick={handleExportPDF}>Export Report</Button>
                </div>
            </div>

            {exportMsg && (
                <div role="alert" aria-live="polite" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.4)', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', color: '#22c55e', fontSize: '0.875rem', fontWeight: 500 }}>
                    📄 {exportMsg}
                </div>
            )}

            <div className="dashboard-grid">
                <DashboardCard title="Total Loan Volume" value={`$${(totalVolume / 1000).toFixed(1)}k`} label="Lifetime Issued" icon="🏛️" />
                <DashboardCard title="Active Loans" value={activeCount.toString()} label="Currently Active" icon="📄" />
                <DashboardCard title="Default Rate" value={`${defaultRate}%`} trend={{ value: 'Platform-wide', positive: defaultCount === 0 }} icon="📉" />
                <DashboardCard title="Avg Loan Size" value={`$${(avgLoanSize / 1000).toFixed(1)}k`} label="Per loan" icon="🏷️" />
            </div>

            <div className="content-grid-2-1">
                <div className="content-section">
                    <div className="section-header"><h3>Volume Trends</h3></div>
                    <ChartPlaceholder title="Loan Volume Over Time" height="260px" />
                </div>
                <div className="content-section">
                    <div className="section-header"><h3>Risk Distribution</h3></div>
                    <ChartPlaceholder title="By Risk Category" height="260px" />
                </div>
            </div>

            <div className="content-section">
                <div className="section-header">
                    <h3>Risk Assessment — All Loans (Read-Only)</h3>
                </div>
                <Table columns={riskColumns} data={loans} />
            </div>
        </div>
    );
};

export default AnalystDashboard;
