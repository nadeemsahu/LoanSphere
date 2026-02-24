import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardCard from '../../components/DashboardCard/DashboardCard';
import Table from '../../components/Table/Table';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import { useDataContext } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/dashboard.css';

const LenderDashboard = () => {
    const { user, updateUser } = useAuth();
    const lenderName = user?.name || 'John Lender';
    const totalCapital = user?.totalCapital || 0;

    const { loans, offers, approveLoan } = useDataContext();
    const [isEditingCapital, setIsEditingCapital] = useState(false);
    const [newCapital, setNewCapital] = useState(totalCapital);
    const [approvedId, setApprovedId] = useState(null);
    const navigate = useNavigate();

    // PS15: Lender sees only loans explicitly approved by them or pending their approval
    const myOffers = offers.filter(o => o.lender === lenderName);
    const myLoans = loans.filter(l => l.approvedBy === lenderName);

    const activeLoans = myLoans.filter(l => l.status === 'Active');
    const pendingLoans = myLoans.filter(l => l.status === 'Pending');
    const totalDeployed = activeLoans.reduce((acc, l) => acc + l.amount, 0);
    const availableCapital = totalCapital - totalDeployed;

    const handleUpdateCapital = () => {
        updateUser({ totalCapital: parseFloat(newCapital) });
        setIsEditingCapital(false);
    };

    const handleApprove = (id) => {
        approveLoan(id, lenderName);
        setApprovedId(id);
        setTimeout(() => setApprovedId(null), 3000);
    };

    const offerColumns = [
        { header: 'ID', accessor: 'id' },
        { header: 'Amount', render: (row) => `$${row.amount.toLocaleString()}` },
        { header: 'Interest Rate', render: (row) => `${row.interestRate}%` },
        { header: 'Term', render: (row) => `${row.term} months` },
        { header: 'Status', render: () => <span className="status-badge status-active">Active</span> },
    ];

    const loanColumns = [
        { header: 'ID', accessor: 'id' },
        { header: 'Borrower', accessor: 'borrower' },
        { header: 'Amount', render: (row) => `$${row.amount.toLocaleString()}` },
        { header: 'Rate', render: (row) => `${row.interestRate}%` },
        { header: 'Status', render: (row) => <span className={`status-badge status-${row.status.toLowerCase()}`}>{row.status}</span> },
        {
            header: 'Action', render: (row) => (
                row.status === 'Pending'
                    ? <button
                        className="btn btn-outline btn-xs"
                        onClick={() => handleApprove(row.id)}
                    >
                        {approvedId === row.id ? '✅ Approved' : 'Approve'}
                    </button>
                    : <span className="text-secondary-xs">—</span>
            )
        },
    ];

    return (
        <div className="dashboard-container fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Lender Overview</h1>
                    <p className="page-subtitle">Manage your loan portfolio and active borrower requests</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-outline btn-sm" onClick={() => setIsEditingCapital(true)}>
                        ⚙️ Set Capital
                    </button>
                    <button className="btn btn-outline btn-sm" onClick={() => window.location.reload()}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                            <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                        </svg>
                        Refresh
                    </button>
                </div>
            </div>

            {isEditingCapital && (
                <div className="content-section fade-in" style={{ backgroundColor: 'var(--bg-secondary)', borderStyle: 'dashed' }}>
                    <div className="section-header">
                        <h3>Update Portfolio Capital</h3>
                        <button className="btn-link" onClick={() => setIsEditingCapital(false)}>Cancel</button>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center', marginTop: 'var(--space-sm)' }}>
                        <div style={{ flex: 1 }}>
                            <Input
                                label="Total Investment Capital ($)"
                                type="number"
                                value={newCapital}
                                onChange={(e) => setNewCapital(e.target.value)}
                                placeholder="500000"
                            />
                        </div>
                        <Button onClick={handleUpdateCapital} style={{ height: '42px', marginTop: '22px' }}>Update Capital</Button>
                    </div>
                </div>
            )}

            <div className="dashboard-grid">
                <DashboardCard title="Total Capital" value={`$${(totalCapital / 1000).toLocaleString()}k`} label="Investment budget" icon="💼" />
                <DashboardCard title="Capital Deployed" value={`$${(totalDeployed / 1000).toLocaleString()}k`} trend={{ value: 'Active Portfolio', positive: true }} icon="💰" />
                <DashboardCard title="Available Capital" value={`$${(availableCapital / 1000).toLocaleString()}k`} label="Remaining to lend" icon="📈" />
                <DashboardCard title="Pending Approvals" value={pendingLoans.length.toString()} label="Awaiting review" icon="⏳" />
            </div>

            <div className="content-grid-2-1">
                <div className="content-section">
                    <div className="section-header">
                        <h3>My Active & Pending Loans</h3>
                        <span className="badge-count">{myLoans.length}</span>
                    </div>
                    {myLoans.length === 0 ? (
                        <div className="no-data">
                            No loans associated with your account yet.
                        </div>
                    ) : (
                        <Table columns={loanColumns} data={myLoans} />
                    )}
                </div>
                <div className="content-section">
                    <div className="section-header">
                        <h3>Published Offers</h3>
                        <button className="btn-link" onClick={() => navigate('/lender/create-loan')}>+ New</button>
                    </div>
                    {myOffers.length === 0 ? (
                        <div className="no-data">
                            No offers published yet.
                        </div>
                    ) : (
                        <Table columns={offerColumns} data={myOffers} pagination={false} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default LenderDashboard;
