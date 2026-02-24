import React from 'react';
import DashboardCard from '../../components/DashboardCard/DashboardCard';
import Table from '../../components/Table/Table';
import { useDataContext } from '../../contexts/DataContext';
import '../../styles/dashboard.css';

const AdminDashboard = () => {
    const { users, loans, transactions, activity } = useDataContext();

    const recentTxColumns = [
        { header: 'TxID', accessor: 'id' },
        { header: 'Date', accessor: 'date' },
        { header: 'Amount', render: (row) => `$${row.amount.toLocaleString()}` },
        { header: 'Type', accessor: 'type' },
        {
            header: 'Borrower',
            render: (row) => row.borrower
                ? <span className="text-primary" style={{ fontWeight: 500 }}>{row.borrower}</span>
                : <span className="text-secondary-xs">—</span>
        },
        { header: 'Status', render: (row) => <span className={`status-badge status-${(row.status || 'success').toLowerCase()}`}>{row.status || 'Success'}</span> },
    ];

    const activityColumns = [
        { header: 'Action', accessor: 'action' },
        { header: 'User', render: (row) => <span style={{ fontWeight: 600 }}>{row.user}</span> },
        { header: 'Details', accessor: 'details' },
        { header: 'Time', render: (row) => <span className="text-secondary-xs">{row.time}</span> },
    ];

    const pendingLoans = loans.filter(l => l.status === 'Pending');
    const activeLoans = loans.filter(l => l.status === 'Active');
    const totalVolume = loans.reduce((acc, l) => acc + l.amount, 0);

    return (
        <div className="dashboard-container fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Admin Overview</h1>
                    <p className="page-subtitle">Platform performance and system health monitoring</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-outline btn-sm" onClick={() => window.location.reload()}>
                        Refresh Data
                    </button>
                    <button className="btn btn-primary btn-sm">
                        Download Report
                    </button>
                </div>
            </div>

            <div className="dashboard-grid">
                <DashboardCard
                    title="Total Users"
                    value={users.length.toString()}
                    trend={{ value: 'Active Platform', positive: true }}
                    icon="👥"
                />
                <DashboardCard
                    title="Active Loans"
                    value={activeLoans.length.toString()}
                    label="Performing assets"
                    icon="📊"
                />
                <DashboardCard
                    title="Pending Review"
                    value={pendingLoans.length.toString()}
                    label="Awaiting action"
                    icon="⏳"
                />
                <DashboardCard
                    title="Total Volume"
                    value={`$${(totalVolume / 1000).toLocaleString()}k`}
                    label="Lifetime originated"
                    icon="💎"
                />
            </div>

            <div className="content-grid-2-1">
                <div className="content-section">
                    <div className="section-header">
                        <h3>Recent Transactions</h3>
                        <span className="badge-count">{transactions.length}</span>
                    </div>
                    <Table columns={recentTxColumns} data={transactions.slice(0, 8)} plain />
                </div>
                <div className="content-section">
                    <div className="section-header">
                        <h3>System Activity</h3>
                        <span className="badge-count">{activity.length}</span>
                    </div>
                    <Table columns={activityColumns} data={activity.slice(0, 6)} plain />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
