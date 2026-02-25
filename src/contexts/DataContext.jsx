import React, { createContext, useState, useContext, useEffect } from 'react';
import { users as initialUsers, loans as initialLoans, loanOffers as initialOffers, transactions as initialTransactions, activityLogs as initialLogs } from '../data/mockData';

const DataContext = createContext(null);

// Helper to get a readable time string
const getTimeLabel = () => {
    return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

export const DataProvider = ({ children }) => {
    const [users, setUsers] = useState(() => {
        try { return JSON.parse(localStorage.getItem('fsad_users')) || initialUsers; } catch { return initialUsers; }
    });
    const [loans, setLoans] = useState(() => {
        try { return JSON.parse(localStorage.getItem('fsad_loans')) || initialLoans; } catch { return initialLoans; }
    });
    const [offers, setOffers] = useState(() => {
        try { return JSON.parse(localStorage.getItem('fsad_offers')) || initialOffers; } catch { return initialOffers; }
    });
    const [transactions, setTransactions] = useState(() => {
        try { return JSON.parse(localStorage.getItem('fsad_transactions')) || initialTransactions; } catch { return initialTransactions; }
    });
    const [activity, setActivity] = useState(() => {
        try { return JSON.parse(localStorage.getItem('fsad_activity')) || initialLogs; } catch { return initialLogs; }
    });
    const [notifications, setNotifications] = useState(() => {
        try { return JSON.parse(localStorage.getItem('fsad_notifications')) || []; } catch { return []; }
    });

    useEffect(() => {
        localStorage.setItem('fsad_users', JSON.stringify(users));
        localStorage.setItem('fsad_loans', JSON.stringify(loans));
        localStorage.setItem('fsad_offers', JSON.stringify(offers));
        localStorage.setItem('fsad_transactions', JSON.stringify(transactions));
        localStorage.setItem('fsad_activity', JSON.stringify(activity));
        localStorage.setItem('fsad_notifications', JSON.stringify(notifications));
    }, [users, loans, offers, transactions, activity, notifications]);

    // --- Activity Logging & Notifications ---
    const logActivity = (action, user, details) => {
        setActivity(prev => [{ action, user, details, time: `Just now (${getTimeLabel()})` }, ...prev]);
    };

    const addNotification = (message, type = 'info') => {
        const newNotif = { id: Date.now().toString(), message, type, read: false, time: getTimeLabel() };
        setNotifications(prev => [newNotif, ...prev]);
    };

    const markNotificationRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    // --- Users (Admin only) ---
    const addUser = (newUser) => {
        const created = { ...newUser, id: Date.now(), status: 'Active' };
        setUsers(prev => [created, ...prev]);
        logActivity('Add User', 'Admin', `Added new user: ${newUser.name} (${newUser.role})`);
        addNotification(`New ${newUser.role} user created: ${newUser.name}`, 'success');
    };

    const blockUser = (id) => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'Blocked' ? 'Active' : 'Blocked' } : u));
        logActivity('User Status Toggle', 'Admin', `Toggled status for user ID ${id}`);
        addNotification(`User status updated`, 'warning');
    };

    const editUserRole = (id, newRole) => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
        logActivity('User Role Update', 'Admin', `Changed role for user ID ${id} to ${newRole}`);
        addNotification(`User role updated to ${newRole}`, 'success');
    };

    const removeUser = (id) => {
        setUsers(prev => prev.filter(u => String(u.id) !== String(id)));
        logActivity('User Removed', 'Admin', `Removed user ID ${id}`);
        addNotification(`User removed (ID: ${id})`, 'error');
    };

    // --- Loans ---
    const approveLoan = (id, lenderName) => {
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
    };

    const rejectLoanApplication = (id, lenderName) => {
        setLoans(prev => prev.map(l => l.id === id ? { ...l, status: 'Rejected', approvedBy: lenderName || 'Lender' } : l));
        logActivity('Loan Rejected', lenderName || 'Lender', `Rejected loan application #${id}`);
        addNotification(`Loan application #${id} has been rejected`, 'warning');
    };

    const deleteLoan = (id) => {
        setLoans(prev => prev.filter(l => String(l.id) !== String(id)));
        logActivity('Loan Deleted', 'Admin', `Deleted loan #${id}`);
        addNotification(`Loan #${id} deleted`, 'error');
    };

    // borrowerName: stamped from authenticated borrower user
    const applyForLoan = (loanData, borrowerName) => {
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
    };

    // --- Offers ---
    const createOffer = (offerData, lenderName) => {
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
    };

    const applyForOffer = (id, borrowerName) => {
        const offer = offers.find(o => o.id === id);
        if (offer) {
            const newLoan = {
                id: Date.now(),
                borrower: borrowerName || 'Borrower',
                amount: offer.amount,
                purpose: 'Applied from Loan Offer',
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
    };

    // --- Transactions & Payments ---
    const addPayment = (amount, borrowerName, loanId) => {
        const newPayment = {
            id: `TXN${Date.now().toString().slice(-6)}`,
            date: new Date().toISOString().split('T')[0],
            amount: parseFloat(amount),
            type: 'Payment',
            status: 'Success',
            borrower: borrowerName || 'Borrower',
            loanId: loanId || null
        };
        setTransactions(prev => [newPayment, ...prev]);
        logActivity('Payment Received', 'System', `Received $${parseFloat(amount).toLocaleString()} from ${borrowerName || 'Borrower'}`);
        addNotification(`Payment of $${parseFloat(amount).toLocaleString()} received from ${borrowerName || 'Borrower'}`, 'success');
    };

    return (
        <DataContext.Provider value={{
            users, addUser, blockUser, removeUser, editUserRole,
            loans, approveLoan, rejectLoanApplication, deleteLoan, applyForLoan,
            offers, createOffer, applyForOffer,
            transactions, addPayment,
            activity, logActivity,
            notifications, markNotificationRead, clearNotifications
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useDataContext = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error('useDataContext must be used within a DataProvider');
    return context;
};
