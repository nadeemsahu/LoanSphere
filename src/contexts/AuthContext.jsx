import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { users as seedUsers } from '../data/mockData';

const AuthContext = createContext(null);

// Helper: always reads the latest user list (seed + localStorage registered users)
const getAllUsers = () => {
    try {
        const stored = localStorage.getItem('fsad_users');
        return stored ? JSON.parse(stored) : seedUsers;
    } catch {
        return seedUsers;
    }
};

/**
 * Decodes a Google JWT credential (id_token) client-side.
 * The payload section is base64url-encoded JSON — safe to decode without a secret
 * because we're only reading identity fields (sub, email, name, picture).
 * Server-side signature verification is not needed for a localStorage-backed demo.
 */
const decodeJwt = (token) => {
    try {
        const base64Url = token.split('.')[1];
        // Convert base64url to base64 by replacing URL-safe characters
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        // Pad to multiple of 4 if needed
        const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
        const jsonPayload = decodeURIComponent(
            atob(padded)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (err) {
        console.error('[AuthContext] Failed to decode Google JWT:', err);
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    // Login checks fsad_users (includes registered users) first, then falls back to seed
    const login = useCallback((email, password) => {
        const allUsers = getAllUsers();
        const foundUser = allUsers.find(u => u.email.toLowerCase().trim() === email.toLowerCase().trim() && u.password === password);
        if (!foundUser) {
            return { success: false, message: 'Invalid email or password.' };
        }
        if (foundUser.status === 'Blocked') {
            return { success: false, message: 'Your account has been deactivated. Contact admin.' };
        }
        const { password: _pw, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        return { success: true, user: userWithoutPassword };
    }, []);

    // Register: Borrower and Lender only. Writes to fsad_users so DataContext and login pick it up.
    const register = useCallback((name, email, password, role) => {
        const ALLOWED_ROLES = ['borrower', 'lender'];
        if (!ALLOWED_ROLES.includes(role)) {
            return { success: false, message: 'Invalid role. Only Borrower or Lender can register.' };
        }

        const allUsers = getAllUsers();
        const emailTaken = allUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
        if (emailTaken) {
            return { success: false, message: 'An account with this email already exists.' };
        }

        const newUser = {
            id: Date.now(),
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password,
            role,
            status: 'Active',
        };

        localStorage.setItem('fsad_users', JSON.stringify([newUser, ...allUsers]));
        return { success: true };
    }, []);

    /**
     * Google Login (localStorage-based, no backend required).
     *
     * Decodes the Google JWT credential client-side, then:
     * - If the email already exists in localStorage → log them in directly.
     * - If NOT → return { needsRegistration: true, googleData } so the UI
     *   can redirect to /register and pre-fill the form.
     *
     * @param {string} credential - The id_token JWT string from Google GIS callback.
     */
    const googleLogin = useCallback((credential) => {
        try {
            const payload = decodeJwt(credential);

            if (!payload || !payload.email) {
                console.error('[AuthContext] googleLogin: invalid or empty JWT payload.');
                return Promise.resolve({ success: false, message: 'Invalid Google credential. Please try again.' });
            }

            const googleData = {
                googleId: payload.sub,
                email: payload.email,
                name: payload.name || payload.email.split('@')[0],
                picture: payload.picture || '',
                // Keep the raw credential in case completeGoogleRegistration needs it later
                token: credential,
            };

            console.log('[AuthContext] googleLogin: decoded payload', { email: googleData.email, name: googleData.name });

            const allUsers = getAllUsers();
            // Match by email (case-insensitive)
            const existingUser = allUsers.find(
                u => u.email.toLowerCase() === googleData.email.toLowerCase()
            );

            if (existingUser) {
                // User exists — log them in
                if (existingUser.status === 'Blocked') {
                    return Promise.resolve({ success: false, message: 'Your account has been deactivated. Contact admin.' });
                }
                const { password: _pw, ...userWithoutPassword } = existingUser;
                // Merge up-to-date Google fields (picture may have changed)
                const merged = {
                    ...userWithoutPassword,
                    picture: googleData.picture || userWithoutPassword.picture,
                    googleId: googleData.googleId || userWithoutPassword.googleId,
                };
                setUser(merged);
                localStorage.setItem('user', JSON.stringify(merged));
                console.log('[AuthContext] googleLogin: existing user logged in', merged.email);
                return Promise.resolve({ success: true, needsRegistration: false, user: merged });
            } else {
                // No account found — needs registration
                console.log('[AuthContext] googleLogin: no account found, needs registration');
                return Promise.resolve({ success: true, needsRegistration: true, googleData });
            }
        } catch (error) {
            console.error('[AuthContext] googleLogin error:', error);
            return Promise.resolve({ success: false, message: 'Google authentication failed. Please try again.' });
        }
    }, []);

    /**
     * Complete Google Registration (localStorage-based, no backend required).
     *
     * Creates a new user in localStorage using the Google identity data
     * combined with the extra fields the user filled in (phone, role, optional password).
     * Then immediately logs the user in.
     */
    const completeGoogleRegistration = useCallback((userData) => {
        const { name, email, googleId, picture, phone, role, password } = userData;

        const ALLOWED_ROLES = ['borrower', 'lender'];
        if (!ALLOWED_ROLES.includes(role)) {
            return { success: false, message: 'Invalid role. Only Borrower or Lender can register.' };
        }

        if (!email || !name) {
            return { success: false, message: 'Missing required Google identity data.' };
        }

        const allUsers = getAllUsers();

        // Edge case: email was registered in the meantime
        const emailTaken = allUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
        if (emailTaken) {
            // Account now exists — just log them in silently
            const found = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
            if (found) {
                const { password: _pw, ...userWithoutPassword } = found;
                setUser(userWithoutPassword);
                localStorage.setItem('user', JSON.stringify(userWithoutPassword));
                return { success: true, user: userWithoutPassword };
            }
            return { success: false, message: 'An account with this email already exists.' };
        }

        const newUser = {
            id: Date.now(),
            name: name.trim(),
            email: email.toLowerCase().trim(),
            // Use provided password or fall back to googleId as a placeholder credential
            password: password || googleId || `google_${Date.now()}`,
            role,
            status: 'Active',
            googleId: googleId || null,
            picture: picture || '',
            phone: phone || '',
        };

        localStorage.setItem('fsad_users', JSON.stringify([newUser, ...allUsers]));

        // Log them in immediately after registration
        const { password: _pw, ...userWithoutPassword } = newUser;
        setUser(userWithoutPassword);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));

        console.log('[AuthContext] completeGoogleRegistration: new user created & logged in', newUser.email);
        return { success: true, user: userWithoutPassword };
    }, []);

    const updateUser = (data) => {
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        const allUsers = getAllUsers();
        const updatedAll = allUsers.map(u => u.id === updatedUser.id ? { ...u, ...data } : u);
        localStorage.setItem('fsad_users', JSON.stringify(updatedAll));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, updateUser, googleLogin, completeGoogleRegistration, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
