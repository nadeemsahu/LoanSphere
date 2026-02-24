import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const routeTitles = {
    '/': 'Home | LoanSphere',
    '/login': 'Sign In | LoanSphere',
    '/admin': 'Admin Dashboard | LoanSphere',
    '/admin/users': 'Manage Users | LoanSphere Admin',
    '/admin/loans': 'All Loans | LoanSphere Admin',
    '/admin/transactions': 'System Transactions | LoanSphere Admin',
    '/admin/stats': 'System Activity | LoanSphere Admin',
    '/lender': 'Lender Dashboard | LoanSphere',
    '/lender/offers': 'My Loan Offers | LoanSphere Lender',
    '/lender/borrowers': 'Qualified Borrowers | LoanSphere Lender',
    '/lender/payments': 'Payment Tracking | LoanSphere Lender',
    '/lender/create-loan': 'Create Loan Offer | LoanSphere Lender',
    '/borrower': 'Borrower Dashboard | LoanSphere',
    '/borrower/offers': 'Browse Offers | LoanSphere',
    '/borrower/apply': 'Apply for Loan | LoanSphere',
    '/borrower/loans': 'My Loans | LoanSphere',
    '/borrower/payments': 'Make a Payment | LoanSphere',
    '/analyst': 'Analyst Dashboard | LoanSphere',
    '/analyst/analytics': 'System Analytics | LoanSphere Analyst',
    '/analyst/risk': 'Risk Reports | LoanSphere Analyst',
    '/analyst/transactions': 'All Transactions | LoanSphere Analyst',
};

const useDocumentTitle = () => {
    const location = useLocation();

    useEffect(() => {
        const title = routeTitles[location.pathname] || 'LoanSphere - Loan Issuance Management';
        document.title = title;
    }, [location.pathname]);
};

export const DocumentTitleHandler = () => {
    useDocumentTitle();
    return null;
};
