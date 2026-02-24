import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardCard from '../../components/DashboardCard/DashboardCard';
import Table from '../../components/Table/Table';
import Button from '../../components/Button/Button';
import StatusTracker from '../../components/StatusTracker/StatusTracker';
import { useDataContext } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/dashboard.css';

const BorrowerDashboard = () => {
    const { user } = useAuth();
    const borrowerName = user?.name;
    const { loans, transactions } = useDataContext();
    const navigate = useNavigate();

    // PS15: Borrower sees ONLY their own loans and payments
    const myLoans = loans.filter(l => l.borrower === borrowerName);
    const myPayments = transactions.filter(t => t.type === 'Payment' && t.borrower === borrowerName);
    const activeLoans = myLoans.filter(l => l.status === 'Active');
    const pendingLoans = myLoans.filter(l => l.status === 'Pending');
    const totalBorrowed = myLoans.reduce((acc, l) => acc + l.amount, 0);
    const totalPaid = myPayments.reduce((acc, t) => acc + t.amount, 0);

    // Show the most recent active loan's status tracker
    const trackerLoan = activeLoans[0] || myLoans[0];

    const loanColumns = [
        { header: 'Loan ID', accessor: 'id' },
        { header: 'Amount', render: (row) => `$${row.amount.toLocaleString()}` },
        { header: 'Purpose', render: (row) => row.purpose || '—' },
        { header: 'Rate', render: (row) => `${row.interestRate}%` },
        { header: 'Term', render: (row) => `${row.term} months` },
        { header: 'Status', render: (row) => <span className={`status-badge status-${row.status.toLowerCase()}`}>{row.status}</span> },
    ];

    const txColumns = [
        { header: 'TxID', accessor: 'id' },
        { header: 'Date', accessor: 'date' },
        { header: 'Amount', render: (row) => `$${row.amount.toLocaleString()}` },
        { header: 'Status', render: () => <span className="status-badge status-success">Success</span> },
    ];

    return (
        <div className="dashboard-container fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">My Dashboard</h1>
                    <p className="page-subtitle">Welcome, {borrowerName}. Track your loans and payments.</p>
                </div>
                <div className="header-actions">
                    <Button variant="outline" onClick={() => navigate('/borrower/offers')}>Browse Offers</Button>
                    <Button variant="primary" onClick={() => navigate('/borrower/apply')}>Apply for Loan</Button>
                </div>
            </div>

            <div className="dashboard-grid">
                <DashboardCard title="Total Borrowed" value={`$${totalBorrowed.toLocaleString()}`} label="Across my loans" icon="💳" />
                <DashboardCard title="Active Loans" value={activeLoans.length.toString()} label="Currently running" icon="📄" />
                <DashboardCard title="Pending Applications" value={pendingLoans.length.toString()} label="Under review" icon="⏳" />
                <DashboardCard title="Total Paid" value={`$${totalPaid.toLocaleString()}`} trend={{ value: 'On time', positive: true }} icon="✅" />
            </div>

            {trackerLoan && trackerLoan.stages && trackerLoan.stages.length > 0 && (
                <div className="content-section">
                    <div className="section-header">
                        <h3>Loan Status Tracker — #{trackerLoan.id}</h3>
                        <span className={`status-badge status-${trackerLoan.status.toLowerCase()}`}>{trackerLoan.status}</span>
                    </div>
                    <StatusTracker stages={trackerLoan.stages} />
                </div>
            )}

            <div className="content-grid-2-1">
                <div className="content-section">
                    <div className="section-header">
                        <h3>My Loans</h3>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate('/borrower/loans')}
                        >
                            View All
                        </Button>
                    </div>
                    {myLoans.length === 0 ? (
                        <div className="no-data">No loans yet. Apply for one!</div>
                    ) : (
                        <Table columns={loanColumns} data={myLoans} pagination={false} />
                    )}
                </div>
                <div className="content-section">
                    <div className="section-header">
                        <h3>Recent Payments</h3>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate('/borrower/payments')}
                        >
                            View All
                        </Button>
                    </div>
                    {myPayments.length === 0 ? (
                        <div className="no-data">No payments recorded yet.</div>
                    ) : (
                        <Table columns={txColumns} data={myPayments.slice(0, 5)} pagination={false} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default BorrowerDashboard;
