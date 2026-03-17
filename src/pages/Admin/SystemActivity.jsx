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
                    <div className="activity-timeline">
                        {activity.map((log, index) => (
                            <div key={index} className="activity-item">
                                <div className="activity-dot">
                                    {getActionIcon(log.action)}
                                </div>
                                <div className="activity-card">
                                    <div className="activity-card-header">
                                        <span className="activity-action">{log.action}</span>
                                        <span className="activity-time">{log.time}</span>
                                    </div>
                                    <p className="activity-details">{log.details}</p>
                                    <div className="activity-actor">
                                        Action by: <span>{log.user}</span>
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
