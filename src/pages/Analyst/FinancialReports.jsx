import React, { useState } from 'react';
import { useDataContext } from '../../contexts/DataContext';
import '../../styles/dashboard.css';

const FinancialReports = () => {
    const { loans, transactions } = useDataContext();
    const [generating, setGenerating] = useState(false);
    const [reportReady, setReportReady] = useState(false);

    const totalIssued = loans.reduce((acc, l) => acc + parseFloat(l.amount || 0), 0);
    const totalRepaid = transactions.filter(t => t.type === 'Payment').reduce((acc, t) => acc + parseFloat(t.amount || 0), 0);

    // Simulate interest earned (mock computing standard 5% yield over repaid)
    const interestEarned = totalRepaid * 0.05;

    // Default losses
    const defaultLosses = loans.filter(l => l.status === 'Defaulted').reduce((acc, l) => acc + parseFloat(l.amount || 0), 0);

    const handleGenerateReport = () => {
        setGenerating(true);
        setReportReady(false);
        setTimeout(() => {
            setGenerating(false);
            setReportReady(true);
            setTimeout(() => setReportReady(false), 5000);
        }, 1500);
    };

    return (
        <div className="dashboard-container fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Financial Reports</h1>
                    <p className="page-subtitle">Generate and view unified financial ledgers across the application.</p>
                </div>
                <div className="header-actions">
                    <button
                        className="btn btn-primary"
                        onClick={handleGenerateReport}
                        disabled={generating}
                        style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        {generating ? 'Compiling Data...' : 'Download Full Report'}
                    </button>
                </div>
            </div>

            {reportReady && (
                <div role="alert" aria-live="polite" className="fade-in" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.4)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', color: '#22c55e', fontSize: '0.9rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    Report generated successfully! financial-summary-Q4.pdf has been saved.
                </div>
            )}

            <div className="content-section" style={{ padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', paddingBottom: '24px', borderBottom: '1px solid var(--border)' }}>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Fiscal Year Summary</h2>
                        <span className="text-secondary-xs">YTD Aggregated Platform Financials</span>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '600px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
                        <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Total Issued Amount</span>
                        <span style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>${totalIssued.toLocaleString()}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
                        <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Total Repaid Amount</span>
                        <span style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>${totalRepaid.toLocaleString()}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: 'rgba(34,197,94,0.05)', borderRadius: '8px', borderLeft: '4px solid var(--success-color, #22c55e)' }}>
                        <span style={{ fontSize: '1rem', color: 'var(--success-color, #22c55e)', fontWeight: 500 }}>Interest Earned (Gross)</span>
                        <span style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--success-color, #22c55e)' }}>+${Math.round(interestEarned).toLocaleString()}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: 'rgba(239,68,68,0.05)', borderRadius: '8px', borderLeft: '4px solid var(--danger-color, #ef4444)' }}>
                        <span style={{ fontSize: '1rem', color: 'var(--danger-color, #ef4444)', fontWeight: 500 }}>Default Losses (Write-offs)</span>
                        <span style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--danger-color, #ef4444)' }}>-${defaultLosses.toLocaleString()}</span>
                    </div>

                    <div style={{ marginTop: '16px', borderTop: '2px dashed var(--border)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.125rem', fontWeight: 700 }}>Net Platform Health</span>
                        <span style={{ fontSize: '1.5rem', fontWeight: 700, color: interestEarned >= defaultLosses ? 'var(--success-color, #22c55e)' : 'var(--danger-color, #ef4444)' }}>
                            {interestEarned >= defaultLosses ? 'Positive' : 'Negative'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinancialReports;
