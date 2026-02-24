import React from 'react';
import { useLocation } from 'react-router-dom';

const PlaceholderPage = () => {
    const location = useLocation();
    const title = location.pathname.split('/').pop().replace('-', ' ');

    return (
        <div style={{ padding: '2rem', textAlign: 'center' }} className="fade-in">
            <h1 style={{ textTransform: 'capitalize', marginBottom: '1rem' }}>{title}</h1>
            <p style={{ color: 'var(--text-secondary)' }}>This feature is coming soon.</p>
        </div>
    );
};

export default PlaceholderPage;
