import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import { users as initialUsers, loans as initialLoans, loanOffers as initialOffers, transactions as initialTransactions, activityLogs as initialLogs } from '../data/mockData';

const DataContext = createContext(null);

const getTimeLabel = () => {
    return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const safeParse = (key, fallback) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch {
        return fallback;
    }
};

export const DataProvider = ({ children }) => {
    const [users, setUsers] = useState(() => safeParse('fsad_users', initialUsers));
    const [loans, setLoans] = useState(() => safeParse('fsad_loans', initialLoans));
    const [offers, setOffers] = useState(() => safeParse('fsad_offers', initialOffers));
    const [transactions, setTransactions] = useState(() => safeParse('fsad_transactions', initialTransactions));
    const [activity, setActivity] = useState(() => safeParse('fsad_activity', initialLogs));
    const [notifications, setNotifications] = useState(() => safeParse('fsad_notifications', []));

    // Split into separate effects — only writes the changed slice to localStorage
    useEffect(() => { localStorage.setItem('fsad_users', JSON.stringify(users)); }, [users]);
    useEffect(() => { localStorage.setItem('fsad_loans', JSON.stringify(loans)); }, [loans]);
    useEffect(() => { localStorage.setItem('fsad_offers', JSON.stringify(offers)); }, [offers]);
    useEffect(() => { localStorage.setItem('fsad_transactions', JSON.stringify(transactions)); }, [transactions]);
    useEffect(() => { localStorage.setItem('fsad_activity', JSON.stringify(activity)); }, [activity]);
    useEffect(() => { localStorage.setItem('fsad_notifications', JSON.stringify(notifications)); }, [notifications]);

    // --- Activity Logging & Notifications ---
    const logActivity = useCallback((action, user, details) => {
        setActivity(prev => [{ action, user, details, time: `Just now (${getTimeLabel()})` }, ...prev]);
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

    // --- Users (Admin only) ---
    const addUser = useCallback((newUser) => {
        const created = { ...newUser, id: Date.now(), status: 'Active' };
        setUsers(prev => [created, ...prev]);
        logActivity('Add User', 'Admin', `Added new user: ${newUser.name} (${newUser.role})`);
        addNotification(`New ${newUser.role} user created: ${newUser.name}`, 'success');
    }, [logActivity, addNotification]);

    const blockUser = useCallback((id) => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'Blocked' ? 'Active' : 'Blocked' } : u));
        logActivity('User Status Toggle', 'Admin', `Toggled status for user ID ${id}`);
        addNotification(`User status updated`, 'warning');
    }, [logActivity, addNotification]);

    const editUserRole = useCallback((id, newRole) => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
        logActivity('User Role Update', 'Admin', `Changed role for user ID ${id} to ${newRole}`);
        addNotification(`User role updated to ${newRole}`, 'success');
    }, [logActivity, addNotification]);

    const removeUser = useCallback((id) => {
        setUsers(prev => prev.filter(u => String(u.id) !== String(id)));
        logActivity('User Removed', 'Admin', `Removed user ID ${id}`);
        addNotification(`User removed (ID: ${id})`, 'error');
    }, [logActivity, addNotification]);

    // --- Loans ---
    const approveLoan = useCallback((id, lenderName) => {
        setLoans(prev => prev.map(l => l.id === id
            ? {
                ...l,
                status: 'Active',
                approvedBy: lenderName || 'Lender',
                stages: (l.stages || []).map(s =>
                    s.name === 'Approved' || s.name === 'Disbursed'
                        ? { ...s, completed: true, date: new Date().toISOString().split('T')[0] }
                        : s
                )
            }
            : l
        ));
        logActivity('Loan Approved', lenderName || 'Lender', `Approved loan request #${id}`);
        addNotification(`Loan #${id} has been approved by ${lenderName || 'Lender'}`, 'success');
    }, [logActivity, addNotification]);

    const rejectLoanApplication = useCallback((id, lenderName) => {
        setLoans(prev => prev.map(l => l.id === id ? { ...l, status: 'Rejected', approvedBy: lenderName || 'Lender' } : l));
        logActivity('Loan Rejected', lenderName || 'Lender', `Rejected loan application #${id}`);
        addNotification(`Loan application #${id} has been rejected`, 'warning');
    }, [logActivity, addNotification]);

    const deleteLoan = useCallback((id) => {
        setLoans(prev => prev.filter(l => String(l.id) !== String(id)));
        logActivity('Loan Deleted', 'Admin', `Deleted loan #${id}`);
        addNotification(`Loan #${id} deleted`, 'error');
    }, [logActivity, addNotification]);

    const applyForLoan = useCallback((loanData, borrowerName) => {
        const amount = parseFloat(loanData.amount);
        const term = parseInt(loanData.term, 10);
        const newLoan = {
            id: Date.now(),
            borrower: borrowerName || loanData.borrowerName || 'Borrower',
            amount,
            purpose: loanData.purpose || '',
            status: 'Pending',
            interestRate: parseFloat(loanData.interest || 6.5),
            term,
            startDate: new Date().toISOString().split('T')[0],
            nextPaymentAmount: Math.round(amount / term),
            approvedBy: null,
            stages: [
                { name: 'Application Submitted', completed: true, date: new Date().toISOString().split('T')[0] },
                { name: 'Underwriting', completed: false },
                { name: 'Approved', completed: false },
                { name: 'Disbursed', completed: false }
            ]
        };
        setLoans(prev => [newLoan, ...prev]);
        logActivity('Loan Application', borrowerName || 'Borrower', `Submitted application for $${amount.toLocaleString()}`);
        addNotification(`${borrowerName || 'Borrower'} applied for a $${amount.toLocaleString()} loan`, 'info');
    }, [logActivity, addNotification]);

    // --- Offers ---
    const createOffer = useCallback((offerData, lenderName) => {
        const newOffer = {
            id: Date.now(),
            amount: parseFloat(offerData.amount),
            interestRate: parseFloat(offerData.interest),
            term: parseInt(offerData.term, 10),
            description: offerData.description || '',
            optionalTerms: offerData.optionalTerms || '',
            lender: lenderName || 'Lender'
        };
        setOffers(prev => [newOffer, ...prev]);
        logActivity('Offer Created', lenderName || 'Lender', `Published loan offer for $${newOffer.amount.toLocaleString()}`);
        addNotification(`New loan offer for $${newOffer.amount.toLocaleString()} published by ${lenderName || 'Lender'}`, 'success');
    }, [logActivity, addNotification]);

    const deleteOffer = useCallback((id, lenderName) => {
        setOffers(prev => prev.filter(o => o.id !== id));
        logActivity('Offer Removed', lenderName || 'Lender', `Withdrew loan offer #${id} from marketplace`);
        addNotification(`Loan offer #${id} removed from marketplace`, 'warning');
    }, [logActivity, addNotification]);

    const applyForOffer = useCallback((id, borrowerName) => {
        const offer = offers.find(o => o.id === id);
        if (offer) {
            const newLoan = {
                id: Date.now(),
                borrower: borrowerName || 'Borrower',
                amount: offer.amount,
                purpose: offer.description || 'Applied from Loan Offer',
                status: 'Pending',
                interestRate: offer.interestRate,
                term: offer.term,
                startDate: new Date().toISOString().split('T')[0],
                nextPaymentAmount: Math.round(offer.amount / offer.term),
                approvedBy: offer.lender,
                stages: [
                    { name: 'Application Submitted', completed: true, date: new Date().toISOString().split('T')[0] },
                    { name: 'Underwriting', completed: false },
                    { name: 'Approved', completed: false },
                    { name: 'Disbursed', completed: false }
                ]
            };
            setLoans(prev => [newLoan, ...prev]);
        }
        setOffers(prev => prev.filter(o => o.id !== id));
        logActivity('Offer Applied', borrowerName || 'Borrower', `Applied for offer #${id} (${offer?.lender})`);
        addNotification(`${borrowerName || 'Borrower'} accepted loan offer #${id}`, 'info');
    }, [offers, logActivity, addNotification]);

    // --- Transactions & Payments ---
    const addPayment = useCallback((amount, borrowerName, loanId) => {
        const floatAmount = parseFloat(amount);
        const newPayment = {
            id: `TXN${Date.now().toString().slice(-6)}`,
            date: new Date().toISOString().split('T')[0],
            amount: floatAmount,
            type: 'Payment',
            status: 'Success',
            borrower: borrowerName || 'Borrower',
            loanId: loanId || null
        };
        setTransactions(prev => [newPayment, ...prev]);
        logActivity('Payment Received', borrowerName || 'Borrower', `Paid $${floatAmount.toLocaleString()} towards loan ${loanId ? '#' + loanId : 'balance'}`);
        addNotification(`Payment of $${floatAmount.toLocaleString()} successful`, 'success');
    }, [logActivity, addNotification]);

    // Memoize the entire context value to prevent unnecessary re-renders of consumers
    const value = useMemo(() => ({
        users, addUser, blockUser, removeUser, editUserRole,
        loans, approveLoan, rejectLoanApplication, deleteLoan, applyForLoan,
        offers, createOffer, deleteOffer, applyForOffer,
        transactions, addPayment,
        activity, logActivity,
        notifications, markNotificationRead, clearNotifications
    }), [
        users, addUser, blockUser, removeUser, editUserRole,
        loans, approveLoan, rejectLoanApplication, deleteLoan, applyForLoan,
        offers, createOffer, deleteOffer, applyForOffer,
        transactions, addPayment,
        activity, logActivity,
        notifications, markNotificationRead, clearNotifications
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
