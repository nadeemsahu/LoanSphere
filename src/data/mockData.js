export const users = [
    { id: 1, name: 'Admin User', email: 'admin@loansphere.com', role: 'admin', password: 'password', status: 'Active' },
    { id: 2, name: 'John Lender', email: 'lender@loansphere.com', role: 'lender', password: 'password', status: 'Active', totalCapital: 500000 },
    { id: 3, name: 'Alice Borrower', email: 'borrower@loansphere.com', role: 'borrower', password: 'password', status: 'Active' },
    { id: 4, name: 'Sarah Analyst', email: 'analyst@loansphere.com', role: 'analyst', password: 'password', status: 'Active' },
];

export const loans = [
    {
        id: 101,
        borrower: 'Alice Borrower',
        amount: 50000,
        status: 'Active',
        interestRate: 5.5,
        term: 12,
        purpose: 'Home Renovation',
        startDate: '2023-01-15',
        nextPaymentDate: '2023-10-15',
        nextPaymentAmount: 4350,
        approvedBy: 'John Lender',
        stages: [
            { name: 'Application Submitted', completed: true, date: '2023-01-10' },
            { name: 'Underwriting', completed: true, date: '2023-01-12' },
            { name: 'Approved', completed: true, date: '2023-01-14' },
            { name: 'Disbursed', completed: true, date: '2023-01-15' },
        ]
    },
    {
        id: 102,
        borrower: 'Bob Smith',
        amount: 25000,
        status: 'Pending',
        interestRate: 6.0,
        term: 24,
        purpose: 'Business Expansion',
        startDate: '2023-02-20',
        nextPaymentDate: '2023-03-20',
        nextPaymentAmount: 1150,
        approvedBy: 'John Lender',
        stages: [
            { name: 'Application Submitted', completed: true, date: '2023-02-18' },
            { name: 'Underwriting', completed: true, date: '2023-02-19' },
            { name: 'Approved', completed: false },
            { name: 'Disbursed', completed: false }
        ]
    },
    {
        id: 103,
        borrower: 'Charlie Brown',
        amount: 100000,
        status: 'Closed',
        interestRate: 4.5,
        term: 36,
        purpose: 'Vehicle Purchase',
        startDate: '2022-05-10',
        nextPaymentAmount: 0,
        approvedBy: null,
        stages: []
    },
    {
        id: 104,
        borrower: 'Alice Borrower',
        amount: 10000,
        status: 'Pending',
        interestRate: 7.0,
        term: 6,
        purpose: 'Personal Loan',
        startDate: '2023-03-01',
        nextPaymentAmount: 1750,
        approvedBy: 'John Lender',
        stages: [
            { name: 'Application Submitted', completed: true, date: '2023-03-01' },
            { name: 'Underwriting', completed: false },
            { name: 'Approved', completed: false },
            { name: 'Disbursed', completed: false }
        ]
    },
];

export const transactions = [
    { id: 'TXN001', date: '2023-03-01', amount: 1500, type: 'Payment', status: 'Success', borrower: 'Alice Borrower', loanId: 101 },
    { id: 'TXN002', date: '2023-02-28', amount: 50000, type: 'Disbursement', status: 'Success', borrower: 'Alice Borrower', loanId: 101 },
    { id: 'TXN003', date: '2023-02-25', amount: 200, type: 'Fee', status: 'Success', borrower: 'Bob Smith', loanId: 102 },
];

export const loanOffers = [
    { id: 1, amount: 50000, interestRate: 5.5, term: 12, lender: 'John Lender' },
    { id: 2, amount: 25000, interestRate: 6.0, term: 24, lender: 'John Lender' },
    { id: 3, amount: 100000, interestRate: 4.5, term: 36, lender: 'Other Lender' },
];

export const analyticsData = {
    totalLoans: 1250000,
    activeLoans: 45,
    defaultRate: 2.5,
    averageLoanSize: 27000,
};

export const activityLogs = [
    { action: 'User Login', time: '2 mins ago', user: 'Admin User', details: 'Successful login from IP 192.168.1.1' },
    { action: 'Loan Approved', time: '15 mins ago', user: 'John Lender', details: 'Approved Loan #101 for Alice Borrower' },
    { action: 'New Registration', time: '1 hour ago', user: 'System', details: 'New borrower registered: Jane Doe' },
    { action: 'Payment Received', time: '3 hours ago', user: 'System', details: 'Received $4350 from Loan #101' },
    { action: 'Security Alert', time: '5 hours ago', user: 'System', details: 'Failed login attempt detected' },
];

export const notifications = [
    { id: 1, type: 'payment', message: 'Payment of $4350 received from Loan #101', time: '2h ago', read: false },
    { id: 2, type: 'info', message: 'New loan application requiring review', time: '5h ago', read: false },
    { id: 3, type: 'system', message: 'System maintenance scheduled for tonight', time: '1d ago', read: true },
];
