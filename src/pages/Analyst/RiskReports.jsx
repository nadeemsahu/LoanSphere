import React, { useState } from 'react';
import { useDataContext } from '../../contexts/DataContext';
import '../../styles/dashboard.css';
const RiskReports = () => {
    const { loans } = useDataContext();
    const [downloadMsg, setDownloadMsg] = useState('');

    const handleDownload = () => {
        setDownloadMsg('PDF report download initiated. This would download the Q3 Risk Report.');
        setTimeout(() => setDownloadMsg(''), 4000);
    };

    // Compute live risk metrics from data
    const pendingCount = loans.filter(l => l.status === 'Pending').length;
    const activeCount = loans.filter(l => l.status === 'Active').length;
    const closedCount = loans.filter(l => l.status === 'Closed').length;
    const defaultCount = loans.filter(l => l.status === 'Defaulted').length;
    const projectedDefault = loans.length ? ((defaultCount / loans.length) * 100 + 2.8).toFixed(1) : '2.8';

    const riskLevel = defaultCount > 2 ? 'High' : pendingCount > 3 ? 'Moderate' : 'Low';
    const riskColor = riskLevel === 'High' ? 'var(--danger-color, #ef4444)' : riskLevel === 'Moderate' ? 'var(--warning-color, #f59e0b)' : 'var(--success-color, #22c55e)';

    return (
        <div className="dashboard-container fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Risk Reports</h1>
                    <p className="page-subtitle">Analyze platform risk factors and portfolio health (read-only)</p>
                </div>
            </div>

            {downloadMsg && (
                <div role="alert" aria-live="polite" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.4)', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', color: '#22c55e', fontSize: '0.875rem', fontWeight: 500 }}>
                    📄 {downloadMsg}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="content-section">
                    <h3 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 500 }}>Overall Portfolio Risk</h3>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: riskColor }}>{riskLevel}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{activeCount} active / {pendingCount} pending / {closedCount} closed</div>
                </div>
                <div className="content-section">
                    <h3 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 500 }}>Projected Default Rate</h3>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--danger-color, #ef4444)' }}>{projectedDefault}%</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Based on {loans.length} loans tracked</div>
                </div>
                <div className="content-section">
                    <h3 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 500 }}>Avg Credit Score</h3>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success-color, #22c55e)' }}>742</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Platform estimate</div>
                </div>
            </div>

            <div className="content-section">
                <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.75rem' }}>Quarterly Risk Assessment</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6, fontSize: '0.9375rem' }}>
                    The current quarter shows a slight increase in projected defaults within the small business loan sector.
                    However, overall portfolio health remains stable with strong repayment rates in personal loans.
                    {defaultCount === 0 && ' No defaults have been recorded this period — portfolio is performing well.'}
                </p>
                <button
                    className="btn btn-primary"
                    onClick={handleDownload}
                    aria-label="Download Q3 Risk Report as PDF"
                >
                    Download Full Risk Report (PDF)
                </button>
            </div>
        </div>
    );
};

export default RiskReports;
