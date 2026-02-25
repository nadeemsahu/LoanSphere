import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardCard from '../../components/DashboardCard/DashboardCard';
import { useDataContext } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/dashboard.css';

const BorrowerDashboard = () => {
    const { user } = useAuth();
    const borrowerName = user?.name || 'Borrower';
    const { loans, transactions, activity } = useDataContext();
    const navigate = useNavigate();

    // Data filtering restricted just to this borrower
    const myLoans = loans.filter(l => l.borrower === borrowerName);
    const myPayments = transactions.filter(t => t.type === 'Payment' && t.borrower === borrowerName);

    const activeLoans = myLoans.filter(l => l.status === 'Active');
    const pendingLoans = myLoans.filter(l => l.status === 'Pending');

    const totalBorrowed = activeLoans.reduce((acc, l) => acc + parseFloat(l.amount), 0);
    const totalPaid = myPayments.reduce((acc, p) => acc + parseFloat(p.amount), 0);
    const overallRemainingBalance = Math.max(0, totalBorrowed - totalPaid);

    const upcomingEmi = activeLoans.reduce((acc, l) => acc + parseFloat(l.nextPaymentAmount || 0), 0);

    // Borrower specific activity logs
    const borrowerActivity = activity.filter(a => a.user === borrowerName || a.details.includes(borrowerName));

    const getActionIcon = (action) => {
        const act = action.toLowerCase();
        if (act.includes('loan') || act.includes('application')) return '📋';
        if (act.includes('approve')) return '✅';
        if (act.includes('payment')) return '💳';
        return '⚡';
    };

    return (
        <div className="dashboard-container fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Borrower Dashboard</h1>
                    <p className="page-subtitle">Track your active loans, upcoming EMIs, and applications.</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-outline btn-sm" onClick={() => navigate('/borrower/offers')}>
                        Browse Loan Offers
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={() => navigate('/borrower/payments')}>
                        Pay Upcoming EMI
                    </button>
                </div>
            </div>

            <div className="dashboard-grid">
                <DashboardCard title="Active Loans" value={activeLoans.length.toString()} label="Currently servicing" icon="💼" />
                <DashboardCard title="Pending Apps" value={pendingLoans.length.toString()} label="Awaiting review" icon="⏳" />
                <DashboardCard title="Total Borrowed" value={`$${totalBorrowed.toLocaleString()}`} label="Principal amount" icon="💵" />
                <DashboardCard title="Remaining Balance" value={`$${overallRemainingBalance.toLocaleString()}`} label="Left to pay" icon="📉" />
                <DashboardCard title="Upcoming EMI" value={`$${upcomingEmi.toLocaleString()}`} label="Due next cycle" icon="📅" trend={{ value: 'Due soon', positive: false }} />
            </div>

            <div className="content-section" style={{ marginTop: '24px', padding: '24px' }}>
                <div className="section-header" style={{ marginBottom: '24px' }}>
                    <h3>Recent Activity</h3>
                    <span className="badge-count">{borrowerActivity.length}</span>
                </div>

                {borrowerActivity.length === 0 ? (
                    <div className="no-data">No recent activity on your account.</div>
                ) : (
                    <div style={{ position: 'relative', borderLeft: '2px solid var(--border-medium)', marginLeft: '16px', paddingLeft: '24px' }}>
                        {borrowerActivity.slice(0, 8).map((log, index) => (
                            <div key={index} style={{ marginBottom: '20px', position: 'relative' }}>
                                <div style={{
                                    position: 'absolute', left: '-37px', top: '0', width: '24px', height: '24px',
                                    borderRadius: '50%', backgroundColor: 'var(--bg-secondary)', border: '2px solid var(--border-medium)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px'
                                }}>
                                    {getActionIcon(log.action)}
                                </div>
                                <div style={{
                                    backgroundColor: 'var(--bg-secondary)', padding: '16px',
                                    borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{log.action}</span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{log.time}</span>
                                    </div>
                                    <p style={{ margin: '0 0 0 0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                        {log.details.replace(borrowerName, 'You')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BorrowerDashboard;
