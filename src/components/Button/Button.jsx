import React from 'react';
import './Button.css';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    ...props
}) => {
    const sizeClass = size && size !== 'md' ? `btn-${size}` : '';

    return (
        <button
            className={`btn btn-${variant} ${sizeClass} ${className}`.trim()}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
