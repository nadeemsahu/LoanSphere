import React, { useState } from 'react';
import Table from '../../components/Table/Table';
import { useDataContext } from '../../contexts/DataContext';

const UserManagement = () => {
    const { users, addUser, blockUser, removeUser, editUserRole } = useDataContext();
    const [actionFeedback, setActionFeedback] = useState('');

    const showFeedback = (msg) => {
        setActionFeedback(msg);
        setTimeout(() => setActionFeedback(''), 3500);
    };

    const handleAddUser = () => {
        const name = window.prompt("Enter new user's name:");
        if (!name) return;
        const email = window.prompt("Enter new user's email:", `${name.toLowerCase().replace(/\s+/g, '.')}@loansphere.com`);
        if (!email) return;

        let roleValid = false;
        let role = '';
        while (!roleValid) {
            role = window.prompt("Enter role (admin, lender, borrower, analyst):", 'borrower');
            if (!role) return;
            role = role.toLowerCase().trim();
            if (['admin', 'lender', 'borrower', 'analyst'].includes(role)) {
                roleValid = true;
            } else {
                alert('Invalid role! Please enter admin, lender, borrower, or analyst.');
            }
        }

        const newUser = { name, email, role, status: 'Active' };
        addUser(newUser);
        showFeedback(`New ${role} user ${name} added.`);
    };

    const handleEditRole = (id, currentRole) => {
        const newRole = window.prompt(`Update role for user ID ${id}. Current role: ${currentRole}\nAccepted values: admin, lender, borrower, analyst`);
        if (!newRole) return;

        const cleanRole = newRole.toLowerCase().trim();
        if (['admin', 'lender', 'borrower', 'analyst'].includes(cleanRole)) {
            if (cleanRole === currentRole) {
                showFeedback('Role unchanged.');
            } else {
                editUserRole(id, cleanRole);
                showFeedback(`User role updated to ${cleanRole}.`);
            }
        } else {
            alert('Invalid role specified. Role unchanged.');
        }
    };

    const handleToggleStatus = (id, currentStatus) => {
        blockUser(id);
        showFeedback(`User marked as ${currentStatus === 'Blocked' ? 'Active' : 'Blocked'}.`);
    };

    const handleRemoveUser = (id, name) => {
        const confirm = window.confirm(`Are you sure you want to permanently delete user ${name} (ID: ${id})?`);
        if (confirm) {
            removeUser(id);
            showFeedback(`User ${name} removed from system.`);
        }
    };

    const columns = [
        { header: 'ID', accessor: 'id' },
        { header: 'Name', render: (row) => <span style={{ fontWeight: 500 }}>{row.name}</span> },
        { header: 'Email', accessor: 'email' },
        { header: 'Role', render: (row) => <span style={{ textTransform: 'capitalize' }}>{row.role}</span> },
        { header: 'Status', render: (row) => <span className={`status-badge status-${(row.status || 'active').toLowerCase()}`}>{row.status || 'Active'}</span> },
        { header: 'Created', render: () => 'System' }, // Add basic created date column if we expand mock data later
        {
            header: 'Actions',
            render: (row) => (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => handleEditRole(row.id, row.role)}>
                        Edit Role
                    </button>
                    <button className="btn btn-outline btn-sm" onClick={() => handleToggleStatus(row.id, row.status)}>
                        {row.status === 'Blocked' ? 'Activate' : 'Deactivate'}
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleRemoveUser(row.id, row.name)}>
                        Delete
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="dashboard-container fade-in">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="page-title">User Management</h1>
                    <p className="page-subtitle">Manage system users, roles, and access levels directly.</p>
                </div>
                <button className="btn btn-primary" onClick={handleAddUser}>+ Add User</button>
            </div>

            {actionFeedback && (
                <div role="alert" aria-live="polite" className="alert-success">
                    {actionFeedback}
                </div>
            )}

            <div className="content-section" style={{ overflowX: 'auto' }}>
                <Table columns={columns} data={users} />
            </div>
        </div>
    );
};

export default UserManagement;
