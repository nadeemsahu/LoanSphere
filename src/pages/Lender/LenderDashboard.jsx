import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardCard from '../../components/DashboardCard/DashboardCard';
import { useDataContext } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/dashboard.css';

const LenderDashboard = () => {
    const { user } = useAuth();
    const lenderName = user?.name || 'John Lender';

    const { loans, offers, transactions, activity } = useDataContext();
    const navigate = useNavigate();

    // Specific counts for this lender
    const myOffers = offers.filter(o => o.lender === lenderName);
    const myLoans = loans.filter(l => l.approvedBy === lenderName);

    // Derived states
    const activeLoansCount = myLoans.filter(l => l.status === 'Active').length;

    // All pending loans in the system (any lender can review and approve/reject)
    // This is consistent with the BorrowerApplications page which also shows all pending
    const pendingApplications = loans.filter(l => l.status === 'Pending');
    const pendingCount = pendingApplications.length;

    // Payments specific to this lender (my borrowers paying my loans)
    const myBorrowers = myLoans.map(l => l.borrower);
    // Note: If transactions have loanId, we can strictly link it. 
    // Here we filter by borrower name as a proxy for the lender's payments, matching the requested spec.
    const myPayments = transactions.filter(t => t.type === 'Payment' && myBorrowers.includes(t.borrower));
    const totalEarnings = myPayments.reduce((acc, p) => acc + parseFloat(p.amount || 0), 0);

    // Lender specific activity logs
    const lenderActivity = activity.filter(a => a.user === lenderName || a.details.includes(lenderName) || myBorrowers.includes(a.user));

    const getActionIcon = (action) => {
        const act = action.toLowerCase();
        if (act.includes('user') || act.includes('application')) return '👤';
        if (act.includes('loan') || act.includes('offer')) return '📜';
        if (act.includes('payment')) return '💲';
        return '⚡';
    };

    return (
        <div className="dashboard-container fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Lender Overview</h1>
                    <p className="page-subtitle">Track your loan offers, applications, and portfolio earnings.</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-primary btn-sm" onClick={() => navigate('/lender/create-offer')}>
                        + Create Loan Offer
                    </button>
                </div>
            </div>

            <div className="dashboard-grid">
                <DashboardCard title="Offers Created" value={myOffers.length.toString()} label="Active loan postings" icon="📄" />
                <DashboardCard title="Active Loans" value={activeLoansCount.toString()} label="Currently performing" icon="💼" />
                <DashboardCard title="Pending Apps" value={pendingCount.toString()} label="Awaiting your review" icon="⏳" />
                <DashboardCard title="Payments" value={myPayments.length.toString()} label="Total deposits made" icon="💸" />
                <DashboardCard title="Total Earnings" value={`$${totalEarnings.toLocaleString()}`} label="Collected cash" icon="📈" />
            </div>

            <div className="content-section" style={{ marginTop: '24px', padding: '24px' }}>
                <div className="section-header" style={{ marginBottom: '24px' }}>
                    <h3>Recent Activity</h3>
                    <span className="badge-count">{lenderActivity.length}</span>
                </div>

                {lenderActivity.length === 0 ? (
                    <div className="no-data">No recent activity for your portfolio.</div>
                ) : (
                    <div className="activity-timeline">
                        {lenderActivity.slice(0, 8).map((log, index) => (
                            <div key={index} className="activity-item">
                                <div className="activity-dot">
                                    {getActionIcon(log.action)}
                                </div>
                                <div className="activity-card">
                                    <div className="activity-card-header">
                                        <span className="activity-action">{log.action}</span>
                                        <span className="activity-time">{log.time}</span>
                                    </div>
                                    <p className="activity-details">{log.details}</p>
                                    <div className="activity-actor">
                                        Actor: <span>{log.user}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LenderDashboard;

