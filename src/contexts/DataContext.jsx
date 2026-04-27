import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import { apiClient } from '../api/apiClient';
import { useAuth } from './AuthContext';

const DataContext = createContext(null);

const getTimeLabel = () => {
    return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

export const DataProvider = ({ children }) => {
    const { user } = useAuth();

    // Server-managed states
    const [users, setUsers] = useState([]);
    const [loans, setLoans] = useState([]);
    const [offers, setOffers] = useState([]);
    const [transactions, setTransactions] = useState([]);

    // Local-only states (activity log & notifications are UI-only)
    const [activity, setActivity] = useState([]);
    const [notifications, setNotifications] = useState([]);

    // --- Fetch helpers ---
    const fetchUsers = useCallback(async () => {
        try {
            const data = await apiClient.get('/users');
            if (Array.isArray(data)) {
                // Normalise role to lowercase for frontend consistency (Sidebar/Auth)
                setUsers(data.map(u => ({ ...u, role: u.role?.toLowerCase() })));
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }, []);

    const fetchLoans = useCallback(async () => {
        try {
            const data = await apiClient.get('/loans?pageSize=500&sortDir=desc');
            if (data && data.content) setLoans(data.content);
        } catch (error) {
            console.error('Error fetching loans:', error);
        }
    }, []);

    const fetchOffers = useCallback(async () => {
        try {
            const data = await apiClient.get('/offers?pageSize=500&sortDir=desc');
            if (data && data.content) setOffers(data.content);
        } catch (error) {
            console.error('Error fetching offers:', error);
        }
    }, []);

    const fetchPayments = useCallback(async () => {
        try {
            const data = await apiClient.get('/payments?pageSize=500&sortDir=desc');
            if (data && data.content) {
                setTransactions(data.content);
            } else if (Array.isArray(data)) {
                setTransactions(data);
            }
        } catch (error) {
            console.error('Error fetching payments:', error);
        }
    }, []);

    // Initial load
    useEffect(() => {
        fetchUsers();
        fetchLoans();
        fetchOffers();
        fetchPayments();
    }, [fetchUsers, fetchLoans, fetchOffers, fetchPayments]);

    // --- Activity Logging & Notifications ---
    const logActivity = useCallback((action, actor, details) => {
        setActivity(prev => [{ action, user: actor, details, time: `Just now (${getTimeLabel()})` }, ...prev]);
    }, []);

    const addNotification = useCallback((message, type = 'info') => {
        const newNotif = { id: Date.now().toString(), message, type, read: false, time: getTimeLabel() };
        setNotifications(prev => [newNotif, ...prev]);
    }, []);

    const markNotificationRead = useCallback((id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }, []);

    const clearNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    // --- Users ---
    const addUser = useCallback(async (userData) => {
        try {
            await apiClient.post('/users/register', { 
                ...userData, 
                password: 'password', // Default password for admin-added users
                role: userData.role.toUpperCase()
            });
            addNotification(`User ${userData.name} added successfully`, 'success');
            fetchUsers();
        } catch (error) {
            addNotification('Failed to add user: ' + error.message, 'error');
        }
    }, [addNotification, fetchUsers]);

    const blockUser = useCallback(async (id) => {
        try {
            const user = users.find(u => u.id === id);
            const newStatus = user.status === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED';
            await apiClient.put(`/users/${id}/status`, { status: newStatus });
            addNotification(`User status updated to ${newStatus}`, 'success');
            fetchUsers();
        } catch (error) {
            addNotification('Failed to update status: ' + error.message, 'error');
        }
    }, [users, addNotification, fetchUsers]);

    const editUserRole = useCallback(async (id, role) => {
        try {
            await apiClient.put(`/users/${id}/role`, { role: role.toUpperCase() });
            addNotification('User role updated successfully', 'success');
            fetchUsers();
        } catch (error) {
            addNotification('Failed to update role: ' + error.message, 'error');
        }
    }, [addNotification, fetchUsers]);

    const removeUser = useCallback(async (id) => {
        try {
            await apiClient.delete(`/users/${id}`);
            addNotification('User deleted successfully', 'warning');
            fetchUsers();
        } catch (error) {
            addNotification('Failed to delete user: ' + error.message, 'error');
        }
    }, [addNotification, fetchUsers]);

    // --- Loans ---
    const approveLoan = useCallback(async (id, lenderName) => {
        try {
            await apiClient.put(`/loans/${id}/status?status=ACTIVE&approvedBy=${encodeURIComponent(lenderName || 'Lender')}`);
            logActivity('Loan Approved', lenderName || 'Lender', `Approved loan request #${id}`);
            addNotification(`Loan #${id} has been approved by ${lenderName || 'Lender'}`, 'success');
            fetchLoans();
        } catch (error) {
            addNotification('Failed to approve loan: ' + error.message, 'error');
        }
    }, [logActivity, addNotification, fetchLoans]);

    const rejectLoanApplication = useCallback(async (id, lenderName) => {
        try {
            await apiClient.put(`/loans/${id}/status?status=REJECTED`);
            logActivity('Loan Rejected', lenderName || 'Lender', `Rejected loan application #${id}`);
            addNotification(`Loan application #${id} has been rejected`, 'warning');
            fetchLoans();
        } catch (error) {
            addNotification('Failed to reject loan: ' + error.message, 'error');
        }
    }, [logActivity, addNotification, fetchLoans]);

    const deleteLoan = useCallback(async (id) => {
        try {
            await apiClient.delete(`/loans/${id}`);
            logActivity('Loan Deleted', 'Admin', `Deleted loan #${id}`);
            addNotification(`Loan #${id} deleted`, 'error');
            fetchLoans();
        } catch (error) {
            addNotification('Failed to delete loan: ' + error.message, 'error');
        }
    }, [logActivity, addNotification, fetchLoans]);

    const applyForLoan = useCallback(async (loanData, borrowerName) => {
        const amount = parseFloat(loanData.amount);
        const termMonths = parseInt(loanData.term, 10);
        try {
            await apiClient.post('/loans/apply', {
                amount,
                termMonths,
                purpose: loanData.purpose || '',
                userId: user?.id
            });
            logActivity('Loan Application', borrowerName || 'Borrower', `Submitted application for $${amount.toLocaleString()}`);
            addNotification(`Loan application for $${amount.toLocaleString()} submitted`, 'info');
            fetchLoans();
        } catch (error) {
            addNotification('Failed to apply for loan: ' + error.message, 'error');
            throw error;
        }
    }, [logActivity, addNotification, fetchLoans, user]);

    // --- Offers ---
    const createOffer = useCallback(async (formData, lenderId) => {
        try {
            await apiClient.post('/offers', {
                amount: parseFloat(formData.amount),
                interestRate: parseFloat(formData.interest),
                termMonths: parseInt(formData.term, 10),
                description: formData.description || '',
                optionalTerms: formData.optionalTerms || '',
                lenderId: lenderId
            });
            logActivity('Offer Created', 'Lender', `Published loan offer for $${parseFloat(formData.amount).toLocaleString()}`);
            addNotification(`New loan offer for $${parseFloat(formData.amount).toLocaleString()} published`, 'success');
            fetchOffers();
        } catch (error) {
            addNotification('Failed to create offer: ' + error.message, 'error');
            throw error;
        }
    }, [logActivity, addNotification, fetchOffers]);

    const deleteOffer = useCallback(async (id) => {
        try {
            await apiClient.delete(`/offers/${id}`);
            logActivity('Offer Removed', 'Lender', `Withdrew loan offer #${id} from marketplace`);
            addNotification(`Loan offer #${id} removed from marketplace`, 'warning');
            fetchOffers();
        } catch (error) {
            addNotification('Failed to remove offer: ' + error.message, 'error');
        }
    }, [logActivity, addNotification, fetchOffers]);

    const applyForOffer = useCallback(async (offerId, borrowerName) => {
        const offer = offers.find(o => String(o.id) === String(offerId));
        if (!offer) {
            addNotification('Offer not found', 'error');
            return;
        }
        try {
            await apiClient.post('/loans/apply', {
                amount: offer.amount,
                termMonths: offer.termMonths,
                interestRate: offer.interestRate,
                purpose: offer.description || 'Applied from Loan Offer',
                userId: user?.id
            });
            logActivity('Offer Applied', borrowerName || 'Borrower', `Applied for offer #${offerId}`);
            addNotification(`Loan application submitted for offer #${offerId}`, 'info');
            fetchLoans();
        } catch (error) {
            addNotification('Failed to apply for offer: ' + error.message, 'error');
            throw error;
        }
    }, [offers, logActivity, addNotification, fetchLoans, user]);

    // --- Transactions & Payments ---
    const addPayment = useCallback(async (amount, borrowerName, loanId) => {
        const floatAmount = parseFloat(amount);
        try {
            await apiClient.post('/payments', {
                amount: floatAmount,
                paymentDate: new Date().toISOString().split('T')[0],
                loanId: loanId
            });
            logActivity('Payment Received', borrowerName || 'Borrower', `Paid $${floatAmount.toLocaleString()} towards loan #${loanId}`);
            addNotification(`Payment of $${floatAmount.toLocaleString()} successful`, 'success');
            await fetchLoans();    // refresh loans to get updated status
            await fetchPayments(); // refresh transactions/payments
        } catch (error) {
            addNotification('Payment failed: ' + error.message, 'error');
            throw error;
        }
    }, [logActivity, addNotification, fetchLoans, fetchPayments]);

    const value = useMemo(() => ({
        users, addUser, blockUser, removeUser, editUserRole, fetchUsers,
        loans, approveLoan, rejectLoanApplication, deleteLoan, applyForLoan,
        offers, createOffer, deleteOffer, applyForOffer,
        transactions, payments: transactions, addPayment, fetchPayments, // Expose both names for compatibility
        activity, logActivity,
        notifications, markNotificationRead, clearNotifications,
        fetchLoans, fetchOffers
    }), [
        users, addUser, blockUser, removeUser, editUserRole, fetchUsers,
        loans, approveLoan, rejectLoanApplication, deleteLoan, applyForLoan,
        offers, createOffer, deleteOffer, applyForOffer,
        transactions, addPayment, fetchPayments,
        activity, logActivity,
        notifications, markNotificationRead, clearNotifications,
        fetchLoans, fetchOffers
    ]);

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};

export const useDataContext = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error('useDataContext must be used within a DataProvider');
    return context;
};
