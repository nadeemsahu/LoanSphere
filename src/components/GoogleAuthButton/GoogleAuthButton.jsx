import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import './GoogleAuthButton.css';

/**
 * GoogleAuthButton natively wraps the Google Identity Services integration.
 * It dynamically injects the external script safely within the React lifecycle,
 * protecting against global scope contamination and ensuring strict React compliance.
 *
 * @param {Function} onSuccess - Callback when authentication succeeds, passes the JWT credential.
 * @param {string} [text="continue_with"] - Button translation string, e.g. 'signin_with', 'signup_with', 'continue_with'
 */
const GoogleAuthButton = ({ onSuccess, text = "continue_with" }) => {
    const { theme } = useTheme();
    const buttonRef = useRef(null);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);

    useEffect(() => {
        // ID of the script tag to prevent duplicate injections
        const scriptId = 'google-gsi-client-script';
        
        // If the Google library is already present globally, safe to use immediately
        if (window.google && window.google.accounts && window.google.accounts.id) {
            setIsScriptLoaded(true);
            return;
        }

        // Check if script is currently injecting
        let script = document.getElementById(scriptId);

        if (!script) {
            script = document.createElement('script');
            script.id = scriptId;
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);
        }

        const handleLoad = () => setIsScriptLoaded(true);
        const handleError = () => console.error('Failed to load Google Identity Services script.');

        script.addEventListener('load', handleLoad);
        script.addEventListener('error', handleError);

        return () => {
            script.removeEventListener('load', handleLoad);
            script.removeEventListener('error', handleError);
        };
    }, []);

    useEffect(() => {
        if (!isScriptLoaded || !window.google || !buttonRef.current) return;

        // Initialize GIS Client natively
        window.google.accounts.id.initialize({
            // Public Client ID safe for frontend compilation
            client_id: '340707566273-h3tg2knu0kmimdcj8rvi0jvgq6juta7t.apps.googleusercontent.com',
            callback: (response) => {
                if (onSuccess) onSuccess(response);
            }
        });

        // Render the UI widget inside the React Ref
        window.google.accounts.id.renderButton(
            buttonRef.current,
            { 
                theme: theme === 'dark' ? 'filled_black' : 'outline', 
                size: 'large', 
                width: '100%', 
                text: text 
            }
        );
    }, [isScriptLoaded, theme, onSuccess, text]);

    return (
        <div className="google-auth-button-container">
            <div ref={buttonRef} className="google-auth-button-mount"></div>
        </div>
    );
};

export default GoogleAuthButton;
