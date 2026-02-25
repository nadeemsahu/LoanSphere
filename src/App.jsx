import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { DataProvider } from './contexts/DataContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts (small — not lazy)
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';

// Lazy-loaded pages (code-split per route for performance)
const Login = lazy(() => import('./pages/Login/Login'));
const AccessDenied = lazy(() => import('./pages/AccessDenied'));
const Homepage = lazy(() => import('./pages/Home/Homepage'));

// Admin
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'));
const UserManagement = lazy(() => import('./pages/Admin/UserManagement'));
const LoanMonitoring = lazy(() => import('./pages/Admin/LoanMonitoring'));
const TransactionMonitoring = lazy(() => import('./pages/Admin/TransactionMonitoring'));
const SystemActivity = lazy(() => import('./pages/Admin/SystemActivity'));

// Lender
const LenderDashboard = lazy(() => import('./pages/Lender/LenderDashboard'));
const CreateLoanOffer = lazy(() => import('./pages/Lender/CreateLoanOffer'));
const MyLoanOffers = lazy(() => import('./pages/Lender/MyLoanOffers'));
const BorrowerApplications = lazy(() => import('./pages/Lender/BorrowerApplications'));
const ActiveLoans = lazy(() => import('./pages/Lender/ActiveLoans'));
const PaymentTracking = lazy(() => import('./pages/Lender/PaymentTracking'));

// Borrower
const BorrowerDashboard = lazy(() => import('./pages/Borrower/BorrowerDashboard'));
const BrowseOffers = lazy(() => import('./pages/Borrower/BrowseOffers'));
const MyApplications = lazy(() => import('./pages/Borrower/MyApplications'));
const MyLoans = lazy(() => import('./pages/Borrower/MyLoans'));
const Payments = lazy(() => import('./pages/Borrower/Payments'));

// Analyst
const AnalystDashboard = lazy(() => import('./pages/Analyst/AnalystDashboard'));
const LoanAnalytics = lazy(() => import('./pages/Analyst/LoanAnalytics'));
const RiskAnalysis = lazy(() => import('./pages/Analyst/RiskAnalysis'));
const FinancialReports = lazy(() => import('./pages/Analyst/FinancialReports'));
const Transactions = lazy(() => import('./pages/Analyst/Transactions'));

// Shared
const PlaceholderPage = lazy(() => import('./components/PlaceholderPage'));
const GenericTablePage = lazy(() => import('./components/GenericTablePage'));

// Minimal loading fallback (no spinner — just empty to avoid layout shift)
const PageLoader = () => (
    <div role="status" aria-label="Loading page" style={{ padding: '2rem', textAlign: 'center', color: '#a1a1aa', fontSize: '0.875rem' }}>
        Loading…
    </div>
);

// Smart home redirect — logged-in users skip homepage and go to their dashboard
const ROLE_DASHBOARDS = { admin: '/admin', lender: '/lender', borrower: '/borrower', analyst: '/analyst' };

const HomeRedirect = () => {
    const { user, loading } = useAuth();
    if (loading) return <PageLoader />;
    if (user) return <Navigate to={ROLE_DASHBOARDS[user.role] || '/login'} replace />;
    return (
        <Suspense fallback={<PageLoader />}>
            <Homepage />
        </Suspense>
    );
};

import { Outlet } from 'react-router-dom';
import { DocumentTitleHandler } from './components/DocumentTitleHandler';

const RootLayout = () => {
    return (
        <>
            <DocumentTitleHandler />
            <Outlet />
        </>
    );
};

const router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            {
                path: '/',
                element: <Navigate to="/home" replace />,
            },
            {
                path: '/home',
                element: <HomeRedirect />,
            },
            {
                element: <AuthLayout />,
                children: [
                    { path: 'login', element: <Suspense fallback={<PageLoader />}><Login /></Suspense> },
                    { path: 'access-denied', element: <Suspense fallback={<PageLoader />}><AccessDenied /></Suspense> },
                ],
            },
            {
                path: '/admin',
                element: (
                    <ProtectedRoute allowedRoles={['admin']}>
                        <DashboardLayout />
                    </ProtectedRoute>
                ),
                children: [
                    { index: true, element: <Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense> },
                    { path: 'users', element: <Suspense fallback={<PageLoader />}><UserManagement /></Suspense> },
                    { path: 'loans', element: <Suspense fallback={<PageLoader />}><LoanMonitoring /></Suspense> },
                    { path: 'transactions', element: <Suspense fallback={<PageLoader />}><TransactionMonitoring /></Suspense> },
                    { path: 'stats', element: <Suspense fallback={<PageLoader />}><SystemActivity /></Suspense> },
                    { path: '*', element: <Suspense fallback={<PageLoader />}><PlaceholderPage /></Suspense> },
                ],
            },
            {
                path: '/lender',
                element: (
                    <ProtectedRoute allowedRoles={['lender']}>
                        <DashboardLayout />
                    </ProtectedRoute>
                ),
                children: [
                    { index: true, element: <Suspense fallback={<PageLoader />}><LenderDashboard /></Suspense> },
                    { path: 'create-offer', element: <Suspense fallback={<PageLoader />}><CreateLoanOffer /></Suspense> },
                    { path: 'offers', element: <Suspense fallback={<PageLoader />}><MyLoanOffers /></Suspense> },
                    { path: 'applications', element: <Suspense fallback={<PageLoader />}><BorrowerApplications /></Suspense> },
                    { path: 'active-loans', element: <Suspense fallback={<PageLoader />}><ActiveLoans /></Suspense> },
                    { path: 'payments', element: <Suspense fallback={<PageLoader />}><PaymentTracking /></Suspense> },
                    { path: '*', element: <Suspense fallback={<PageLoader />}><PlaceholderPage /></Suspense> },
                ],
            },
            {
                path: '/borrower',
                element: (
                    <ProtectedRoute allowedRoles={['borrower']}>
                        <DashboardLayout />
                    </ProtectedRoute>
                ),
                children: [
                    { index: true, element: <Suspense fallback={<PageLoader />}><BorrowerDashboard /></Suspense> },
                    { path: 'offers', element: <Suspense fallback={<PageLoader />}><BrowseOffers /></Suspense> },
                    { path: 'applications', element: <Suspense fallback={<PageLoader />}><MyApplications /></Suspense> },
                    { path: 'loans', element: <Suspense fallback={<PageLoader />}><MyLoans /></Suspense> },
                    { path: 'payments', element: <Suspense fallback={<PageLoader />}><Payments /></Suspense> },
                    { path: '*', element: <Suspense fallback={<PageLoader />}><PlaceholderPage /></Suspense> },
                ],
            },
            {
                path: '/analyst',
                element: (
                    <ProtectedRoute allowedRoles={['analyst']}>
                        <DashboardLayout />
                    </ProtectedRoute>
                ),
                children: [
                    { index: true, element: <Suspense fallback={<PageLoader />}><AnalystDashboard /></Suspense> },
                    { path: 'analytics', element: <Suspense fallback={<PageLoader />}><LoanAnalytics /></Suspense> },
                    { path: 'risk', element: <Suspense fallback={<PageLoader />}><RiskAnalysis /></Suspense> },
                    { path: 'reports', element: <Suspense fallback={<PageLoader />}><FinancialReports /></Suspense> },
                    { path: 'transactions', element: <Suspense fallback={<PageLoader />}><Transactions /></Suspense> },
                    { path: '*', element: <Suspense fallback={<PageLoader />}><PlaceholderPage /></Suspense> },
                ],
            },
            {
                path: '*',
                element: <Navigate to="/login" replace />,
            },
        ]
    }
]);

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <DataProvider>
                    <RouterProvider router={router} />
                </DataProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
