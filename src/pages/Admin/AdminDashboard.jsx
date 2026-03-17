import React, { useState, useCallback } from 'react';
import DashboardCard from '../../components/DashboardCard/DashboardCard';
import Table from '../../components/Table/Table';
import { useDataContext } from '../../contexts/DataContext';
import '../../styles/dashboard.css';

const AdminDashboard = () => {
    const { users, loans, transactions, activity } = useDataContext();
    const [refreshed, setRefreshed] = useState(false);
    const [exported, setExported] = useState(false);

    const activeLoans = loans.filter(l => l.status === 'Active');
    const totalTransactions = transactions.length;

    const handleRefresh = useCallback(() => {
        setRefreshed(true);
        setTimeout(() => setRefreshed(false), 2000);
    }, []);

    const handleExport = useCallback(() => {
        setExported(true);
        // Build a simple CSV of the activity log and trigger download
        const header = 'Action,User,Details,Time\n';
        const rows = activity.map(a =>
            [a.action, a.user, a.details, a.time]
                .map(v => `"${String(v).replace(/"/g, '""')}"`)
                .join(',')
        ).join('\n');
        const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'loansphere-activity-report.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setTimeout(() => setExported(false), 2000);
    }, [activity]);

    const activityColumns = [
        { header: 'Action', accessor: 'action' },
        { header: 'User', render: (row) => <span style={{ fontWeight: 600 }}>{row.user}</span> },
        { header: 'Details', accessor: 'details' },
        { header: 'Time', render: (row) => <span className="text-secondary-xs">{row.time}</span> },
    ];

    return (
        <div className="dashboard-container fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Admin Overview</h1>
                    <p className="page-subtitle">Platform performance and system health monitoring</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-outline btn-sm" onClick={handleRefresh}>
                        {refreshed ? '✓ Data Current' : 'Refresh Data'}
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={handleExport}>
                        {exported ? '✓ Exported!' : 'Export CSV'}
                    </button>
                </div>
            </div>

            <div className="dashboard-grid">
                <DashboardCard
                    title="Total Users"
                    value={users.length.toString()}
                    label="Registered accounts"
                    icon="👥"
                />
                <DashboardCard
                    title="Total Loans"
                    value={loans.length.toString()}
                    label="All system loans"
                    icon="📂"
                />
                <DashboardCard
                    title="Active Loans"
                    value={activeLoans.length.toString()}
                    label="Currently performing"
                    icon="📊"
                />
                <DashboardCard
                    title="Total Transactions"
                    value={totalTransactions.toString()}
                    label="Platform operations"
                    icon="💰"
                />
            </div>

            <div className="content-section" style={{ marginTop: '24px' }}>
                <div className="section-header">
                    <h3>Recent System Activity</h3>
                    <span className="badge-count">{activity.length}</span>
                </div>
                <Table columns={activityColumns} data={activity.slice(0, 6)} plain />
            </div>
        </div>
    );
};

export default AdminDashboard;
