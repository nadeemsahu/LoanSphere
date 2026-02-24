import React from 'react';
import './StatusTracker.css';

const StatusTracker = ({ stages }) => {
    return (
        <div className="status-tracker">
            {stages.map((stage, index) => (
                <div key={index} className={`tracker-step ${stage.completed ? 'completed' : ''}`}>
                    <div className="step-icon">
                        {stage.completed ? '✓' : index + 1}
                    </div>
                    <div className="step-label">
                        <span className="step-name">{stage.name}</span>
                        {stage.date && <span className="step-date">{stage.date}</span>}
                    </div>
                    {index < stages.length - 1 && <div className="step-line"></div>}
                </div>
            ))}
        </div>
    );
};

export default StatusTracker;
