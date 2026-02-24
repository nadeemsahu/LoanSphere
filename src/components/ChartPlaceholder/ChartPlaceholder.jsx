import React from 'react';
import './ChartPlaceholder.css';

const ChartPlaceholder = ({ title, height = '200px' }) => {
    return (
        <div className="chart-placeholder" style={{ height }}>
            <h4 className="chart-title">{title}</h4>
            <div className="chart-visual">
                <div className="bar" style={{ height: '40%' }}></div>
                <div className="bar" style={{ height: '70%' }}></div>
                <div className="bar" style={{ height: '50%' }}></div>
                <div className="bar" style={{ height: '85%' }}></div>
                <div className="bar" style={{ height: '60%' }}></div>
                <div className="bar" style={{ height: '90%' }}></div>
            </div>
        </div>
    );
};

export default ChartPlaceholder;
