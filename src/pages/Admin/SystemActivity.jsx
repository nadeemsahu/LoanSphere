import React from 'react';
import { useDataContext } from '../../contexts/DataContext';
import '../../styles/dashboard.css';

const SystemActivity = () => {
    const { activity } = useDataContext();

    // Helper to get an icon based on action text
    const getActionIcon = (action) => {
        const act = action.toLowerCase();
        if (act.includes('user')) return '👤';
        if (act.includes('loan')) return '📜';
        if (act.includes('payment') || act.includes('offer')) return '💲';
        if (act.includes('status') || act.includes('block')) return '🛡️';
        return '⚡';
    };

    return (
        <div className="dashboard-container fade-in">
            <div className="page-header">
                <h1 className="page-title">System Activity Log</h1>
                <p className="page-subtitle">Timeline record of all major system events.</p>
            </div>

            <div className="content-section" style={{ padding: '24px' }}>
                {activity.length === 0 ? (
                    <div className="no-data">No activity logged yet.</div>
                ) : (
                    <div style={{ position: 'relative', borderLeft: '2px solid var(--border-medium)', marginLeft: '16px', paddingLeft: '24px' }}>
                        {activity.map((log, index) => (
                            <div key={index} style={{ marginBottom: '24px', position: 'relative' }}>
                                {/* Timeline Dot */}
                                <div style={{
                                    position: 'absolute',
                                    left: '-37px',
                                    top: '0',
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--bg-secondary)',
                                    border: '2px solid var(--border-medium)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12px'
                                }}>
                                    {getActionIcon(log.action)}
                                </div>

                                {/* Content Card */}
                                <div style={{
                                    backgroundColor: 'var(--bg-secondary)',
                                    padding: '16px',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border-light)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{log.action}</span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{log.time}</span>
                                    </div>
                                    <p style={{ margin: '0 0 8px 0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                        {log.details}
                                    </p>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                                        Action by: <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{log.user}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SystemActivity;
