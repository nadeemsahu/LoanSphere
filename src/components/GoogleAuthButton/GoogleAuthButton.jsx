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
// Hardcoded Google Client ID for immediate Vercel deployment support
const CLIENT_ID = '340707566273-h3tg2knu0kmimdcj8rvi0jvgq6juta7t.apps.googleusercontent.com';
const GoogleAuthButton = ({ onSuccess, text = 'continue_with' }) => {
    const { theme } = useTheme();
    const buttonRef = useRef(null);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    // Guards against calling initialize() more than once per page load
    const initializedRef = useRef(false);
    // Stable ref for onSuccess so we never need to re-initialize when parent re-renders
    const onSuccessRef = useRef(onSuccess);
    useEffect(() => { onSuccessRef.current = onSuccess; }, [onSuccess]);

    // ── Effect 1: Load the Google GIS script ──────────────────────────────────
    useEffect(() => {
        const scriptId = 'google-gsi-client-script';

        // If the API object is already present (e.g., navigating back to this page),
        // mark as loaded immediately — no need to wait for another load event.
        if (window.google?.accounts?.id) {
            setIsScriptLoaded(true);
            return;
        }

        let script = document.getElementById(scriptId);

        if (!script) {
            // First mount on this page: create and inject the script tag.
            script = document.createElement('script');
            script.id = scriptId;
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);
        } else if (script.dataset.loaded === 'true') {
            // Script tag exists and previously fired its load event, but
            // the component remounted (e.g., navigated away and back).
            setIsScriptLoaded(true);
            return;
        }

        const handleLoad = () => {
            script.dataset.loaded = 'true';
            setIsScriptLoaded(true);
        };
        const handleError = () => {
            console.error('[GoogleAuthButton] Failed to load Google Identity Services script.');
        };

        script.addEventListener('load', handleLoad);
        script.addEventListener('error', handleError);

        return () => {
            script.removeEventListener('load', handleLoad);
            script.removeEventListener('error', handleError);
        };
    }, []);

    // ── Effect 2: Initialize Google client (once only) ────────────────────────
    useEffect(() => {
        if (!isScriptLoaded || !window.google?.accounts?.id) return;

        // Only call initialize() once per page load — calling it again causes
        // "IdConfiguration is already set" errors and breaks the button.
        if (!initializedRef.current) {
            if (!CLIENT_ID) {
                console.error('[GoogleAuthButton] VITE_GOOGLE_CLIENT_ID is not set in .env');
                return;
            }

            window.google.accounts.id.initialize({
                client_id: CLIENT_ID,
                callback: (response) => {
                    if (onSuccessRef.current) {
                        onSuccessRef.current(response);
                    }
                },
            });

            initializedRef.current = true;
            console.log('[GoogleAuthButton] Google Identity Services initialized.');
        }
    }, [isScriptLoaded]);

    // ── Effect 3: Render / re-render the button when theme changes ────────────
    useEffect(() => {
        if (!isScriptLoaded || !initializedRef.current || !buttonRef.current) return;

        // renderButton is safe to call multiple times; Google replaces the iframe.
        window.google.accounts.id.renderButton(buttonRef.current, {
            theme: theme === 'dark' ? 'filled_black' : 'outline',
            size: 'large',
            width: '300',
            text: text,
        });
    }, [isScriptLoaded, theme, text]);

    return (
        <div className="google-auth-button-container">
            <div ref={buttonRef} className="google-auth-button-mount" />
        </div>
    );
};

export default GoogleAuthButton;
