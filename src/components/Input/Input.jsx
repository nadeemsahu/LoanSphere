import React from 'react';
import './Input.css';

const Input = ({ label, type = 'text', className = '', ...props }) => {
    return (
        <div className={`input-group ${className}`}>
            {label && <label className="input-label">{label}</label>}
            <input
                type={type}
                className="input-field"
                {...props}
            />
        </div>
    );
};

export default Input;
