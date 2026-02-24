import React from 'react';
import Table from './Table/Table';
import { useDataContext } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import '../styles/dashboard.css';
// PS15-compliant GenericTablePage
// Role-scoped data filtering and action availability
const GenericTablePage = ({ title, type }) => {
    const { user } = useAuth();
    const role = user?.role;
    const userName = user?.name;

    const {
        users, blockUser, removeUser, addUser,
        loans, approveLoan, deleteLoan,
        offers,
        transactions,
        activity
    } = useDataContext();

    const isAnalyst = role === 'analyst';
    const isAdmin = role === 'admin';
    const isLender = role === 'lender';

    // PS15: Each role sees only their appropriate data
    let tableData = [];
    switch (type) {
        case 'users':
            // Admin: all users. Lender: only borrowers (not other lenders/admins/analysts)
            tableData = isLender
                ? users.filter(u => u.role === 'borrower')
                : users;
            break;
        case 'loans':
            // Admin: all loans. Lender: only loans explicitly approved by them
            tableData = isLender
                ? loans.filter(l => l.approvedBy === userName)
                : loans;
            break;
        case 'offers':
            // Lender: only their own offers. Admin: all.
            tableData = isLender ? offers.filter(o => o.lender === userName) : offers;
            break;
        case 'activity':
            tableData = activity;
            break;
        case 'transactions':
            // Admin: all transactions. Analyst: all (read-only).
            // Lender: only transactions where borrower is in their approved loans
            if (isLender) {
                const myBorrowerNames = loans
                    .filter(l => l.approvedBy === userName)
                    .map(l => l.borrower);
                tableData = transactions.filter(t => myBorrowerNames.includes(t.borrower));
            } else {
                tableData = transactions;
            }
            break;
        case 'payments':
            // Lender: payment-type transactions for their borrowers
            if (isLender) {
                const myBorrowerNames = loans
                    .filter(l => l.approvedBy === userName)
                    .map(l => l.borrower);
                tableData = transactions.filter(t => t.type === 'Payment' && myBorrowerNames.includes(t.borrower));
            } else {
                tableData = transactions.filter(t => t.type === 'Payment');
            }
            break;
        default:
            tableData = [];
    }

    const [actionFeedback, setActionFeedback] = React.useState('');

    const showFeedback = (msg) => {
        setActionFeedback(msg);
        setTimeout(() => setActionFeedback(''), 3500);
    };

    const handleAction = (actionType, id) => {
        if (isAnalyst) return; // Analyst: strictly read-only
        if (actionType === 'delete') {
            if (type === 'users' && isAdmin) { removeUser(id); showFeedback('User removed.'); }
            if (type === 'loans' && isAdmin) { deleteLoan(id); showFeedback(`Loan #${id} deleted.`); }
        } else if (actionType === 'block' && isAdmin) {
            blockUser(id);
            showFeedback('User status toggled.');
        } else if (actionType === 'approve') {
            approveLoan(id, userName);
            showFeedback(`✅ Loan #${id} approved!`);
        } else if (actionType === 'download') {
            showFeedback('Receipt download initiated (mock).');
        }
    };

    const handleAddUser = () => {
        if (!isAdmin) return;
        const newUser = { name: 'New User', email: `user${Date.now()}@loansphere.com`, role: 'borrower', status: 'Active' };
        addUser(newUser);
        showFeedback('New user added to platform.');
    };

    // Build columns based on type and role
    let columns = [];
    switch (type) {
        case 'users':
            columns = [
                { header: 'ID', accessor: 'id' },
                { header: 'Name', accessor: 'name' },
                { header: 'Email', accessor: 'email' },
                { header: 'Role', render: (row) => <span style={{ textTransform: 'capitalize' }}>{row.role}</span> },
                { header: 'Status', render: (row) => <span className={`status-badge status-${(row.status || 'active').toLowerCase()}`}>{row.status || 'Active'}</span> },
                ...(isAdmin ? [{
                    header: 'Actions',
                    render: (row) => (
                        <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                                className="btn btn-outline btn-sm"
                                onClick={() => handleAction('block', row.id)}
                            >
                                {row.status === 'Blocked' ? 'Unblock' : 'Block'}
                            </button>
                            <button
                                className="btn btn-outline btn-sm"
                                style={{ color: '#ef4444', borderColor: '#ef4444' }}
                                onClick={() => handleAction('delete', row.id)}
                            >
                                Remove
                            </button>
                        </div>
                    )
                }] : [])
            ];
            break;
        case 'loans':
            columns = [
                { header: 'ID', accessor: 'id' },
                { header: 'Borrower', accessor: 'borrower' },
                { header: 'Amount', render: (row) => `$${row.amount.toLocaleString()}` },
                { header: 'Rate', render: (row) => `${row.interestRate}%` },
                { header: 'Status', render: (row) => <span className={`status-badge status-${row.status.toLowerCase()}`}>{row.status}</span> },
                { header: 'Date', accessor: 'startDate' },
                ...((isAdmin || isLender) ? [{
                    header: 'Action',
                    render: (row) => (
                        <div style={{ display: 'flex', gap: '6px' }}>
                            {row.status === 'Pending' && (
                                <button
                                    className="btn btn-outline btn-sm"
                                    onClick={() => handleAction('approve', row.id)}
                                >
                                    Approve
                                </button>
                            )}
                            {isAdmin && (
                                <button
                                    className="btn btn-outline btn-sm"
                                    style={{ color: '#ef4444', borderColor: '#ef4444' }}
                                    onClick={() => handleAction('delete', row.id)}
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    )
                }] : [])
            ];
            break;
        case 'offers':
            columns = [
                { header: 'ID', accessor: 'id' },
                { header: 'Amount', render: (row) => `$${row.amount.toLocaleString()}` },
                { header: 'Interest', render: (row) => `${row.interestRate}%` },
                { header: 'Term', render: (row) => `${row.term} months` },
                { header: 'Lender', accessor: 'lender' },
                { header: 'Status', render: () => <span className="status-badge status-active">Active</span> },
            ];
            break;
        case 'activity':
            columns = [
                { header: 'Action', accessor: 'action' },
                { header: 'User', accessor: 'user' },
                { header: 'Details', accessor: 'details' },
                { header: 'Time', accessor: 'time' },
            ];
            break;
        case 'transactions':
        case 'payments':
            columns = [
                { header: 'TxID', accessor: 'id' },
                { header: 'Date', accessor: 'date' },
                { header: 'Amount', render: (row) => `$${row.amount.toLocaleString()}` },
                { header: 'Type', accessor: 'type' },
                { header: 'Borrower', accessor: 'borrower' },
                { header: 'Status', render: (row) => <span className={`status-badge status-${(row.status || 'success').toLowerCase()}`}>{row.status}</span> },
                ...(!isAnalyst ? [{
                    header: 'Receipt',
                    render: (row) => (
                        <button
                            className="btn btn-outline btn-sm"
                            onClick={() => handleAction('download', row.id)}
                        >
                            Receipt
                        </button>
                    )
                }] : [])
            ];
            break;
        default:
            columns = [];
    }

    const subtitle = isAnalyst
        ? 'Read-only view — no actions available'
        : isLender
            ? `Your ${title.toLowerCase()} only`
            : `Manage and view ${title.toLowerCase()}`;

    return (
        <div className="dashboard-container fade-in">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="page-title">{title}</h1>
                    <p className="page-subtitle">{subtitle}</p>
                </div>
                {type === 'users' && isAdmin && (
                    <button className="btn btn-primary" onClick={handleAddUser}>+ Add User</button>
                )}
            </div>

            {actionFeedback && (
                <div role="alert" aria-live="polite" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.4)', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', color: '#22c55e', fontSize: '0.875rem', fontWeight: 500 }}>
                    {actionFeedback}
                </div>
            )}

            <div className="content-section">
                {tableData.length === 0 ? (
                    <div className="no-data">
                        No records found.
                    </div>
                ) : (
                    <Table columns={columns} data={tableData} />
                )}
            </div>
        </div>
    );
};

export default GenericTablePage;
