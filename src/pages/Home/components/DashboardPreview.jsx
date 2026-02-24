import React from 'react';
import '../styles/DashboardPreview.css';

const DashboardPreview = () => {
    return (
        <section className="dashboard-preview-section">
            <div className="section-header">
                <h2>Powerful Dashboard</h2>
                <p>Experience a premium interface designed for clarity and control.</p>
            </div>
            <div className="preview-container">
                <div className="preview-card main-card">
                    <div className="preview-header">
                        <div className="ph-title">Overview</div>
                        <div className="ph-actions">
                            <div className="ph-btn"></div>
                            <div className="ph-btn primary"></div>
                        </div>
                    </div>
                    <div className="preview-body">
                        <div className="preview-row">
                            <div className="preview-stat-card">
                                <div className="pst-label">Total Loans</div>
                                <div className="pst-value">1,245</div>
                            </div>
                            <div className="preview-stat-card">
                                <div className="pst-label">Active Amount</div>
                                <div className="pst-value">$4.2M</div>
                            </div>
                            <div className="preview-stat-card">
                                <div className="pst-label">Repayment Rate</div>
                                <div className="pst-value">98.5%</div>
                            </div>
                        </div>
                        <div className="preview-chart-area">
                            <div className="pca-lines">
                                <div className="pca-line" style={{ height: '40%' }}></div>
                                <div className="pca-line" style={{ height: '60%' }}></div>
                                <div className="pca-line" style={{ height: '50%' }}></div>
                                <div className="pca-line" style={{ height: '80%' }}></div>
                                <div className="pca-line" style={{ height: '65%' }}></div>
                                <div className="pca-line" style={{ height: '90%' }}></div>
                                <div className="pca-line" style={{ height: '75%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DashboardPreview;
