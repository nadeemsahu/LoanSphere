import React from 'react';
import './DashboardCard.css';

const DashboardCard = ({ title, value, label, trend, icon }) => {
    return (
        <div className="dashboard-card fade-in">
            <div className="card-top">
                <span className="card-label">{title}</span>
                {icon && <span className="card-icon-mini">{icon}</span>}
            </div>
            <div className="card-main">
                <h3 className="card-value">{value}</h3>
            </div>
            <div className="card-footer">
                {trend && (
                    <div className={`trend-indicator ${trend.positive ? 'trend-up' : 'trend-down'}`}>
                        {trend.positive ? '↑' : '↓'} {trend.value}
                    </div>
                )}
                {label && <span className="card-subtext">{label}</span>}
            </div>
        </div>
    );
};

export default DashboardCard;
