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

// Lender
const LenderDashboard = lazy(() => import('./pages/Lender/LenderDashboard'));
const CreateLoan = lazy(() => import('./pages/Lender/CreateLoan'));

// Borrower
const BorrowerDashboard = lazy(() => import('./pages/Borrower/BorrowerDashboard'));
const ApplyLoan = lazy(() => import('./pages/Borrower/ApplyLoan'));
const MyLoans = lazy(() => import('./pages/Borrower/MyLoans'));
const Payments = lazy(() => import('./pages/Borrower/Payments'));
const BrowseOffers = lazy(() => import('./pages/Borrower/BrowseOffers'));

// Analyst
const AnalystDashboard = lazy(() => import('./pages/Analyst/AnalystDashboard'));
const AnalyticsPage = lazy(() => import('./pages/Analyst/AnalyticsPage'));
const RiskReports = lazy(() => import('./pages/Analyst/RiskReports'));

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
                    { path: 'users', element: <Suspense fallback={<PageLoader />}><GenericTablePage title="User Management" type="users" /></Suspense> },
                    { path: 'loans', element: <Suspense fallback={<PageLoader />}><GenericTablePage title="All Loans" type="loans" /></Suspense> },
                    { path: 'transactions', element: <Suspense fallback={<PageLoader />}><GenericTablePage title="Transactions" type="transactions" /></Suspense> },
                    { path: 'stats', element: <Suspense fallback={<PageLoader />}><GenericTablePage title="System Activity" type="activity" /></Suspense> },
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
                    { path: 'offers', element: <Suspense fallback={<PageLoader />}><GenericTablePage title="Loan Offers" type="offers" /></Suspense> },
                    { path: 'borrowers', element: <Suspense fallback={<PageLoader />}><GenericTablePage title="Qualified Borrowers" type="users" /></Suspense> },
                    { path: 'payments', element: <Suspense fallback={<PageLoader />}><GenericTablePage title="Payment Tracking" type="payments" /></Suspense> },
                    { path: 'create-loan', element: <Suspense fallback={<PageLoader />}><CreateLoan /></Suspense> },
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
                    { path: 'apply', element: <Suspense fallback={<PageLoader />}><ApplyLoan /></Suspense> },
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
                    { path: 'analytics', element: <Suspense fallback={<PageLoader />}><AnalyticsPage /></Suspense> },
                    { path: 'risk', element: <Suspense fallback={<PageLoader />}><RiskReports /></Suspense> },
                    { path: 'transactions', element: <Suspense fallback={<PageLoader />}><GenericTablePage title="Transactions" type="transactions" /></Suspense> },
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
