import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/apiClient';

const AuthContext = createContext(null);

const decodeJwt = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
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
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem('loansphere_user');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (e) {
            console.error('Failed to parse user from localStorage', e);
            localStorage.removeItem('loansphere_user');
            return null;
        }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, []);

    const login = useCallback(async (email, password) => {
        try {
            const data = await apiClient.post('/users/login', { email, password });
            const loggedInUser = { ...data, role: data.role.toLowerCase() };
            setUser(loggedInUser);
            localStorage.setItem('loansphere_user', JSON.stringify(loggedInUser));
            return { success: true, user: loggedInUser };
        } catch (error) {
            return { success: false, message: error.message || 'Invalid email or password.' };
        }
    }, []);

    const register = useCallback(async (name, email, password, role) => {
        try {
            const payload = {
                name,
                email,
                password,
                role: role.toUpperCase()
            };
            await apiClient.post('/users/register', payload);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.message || 'Registration failed.' };
        }
    }, []);

    const googleLogin = useCallback(async (credential) => {
        try {
            const payload = decodeJwt(credential);
            if (!payload || !payload.email) {
                return { success: false, message: 'Invalid Google credential.' };
            }

            // Google OAuth mapping: to perfectly integrate this we would need a proper OAuth endpoint,
            // but since syllabus restricts to explicit DTOs we'll try to log in via a default password
            // or trigger registration.
            try {
                // Try logging in assuming they registered via Google earlier and their googleId is password
                const res = await apiClient.post('/users/login', { email: payload.email, password: payload.sub });
                const loggedInUser = { ...res, role: res.role.toLowerCase() };
                setUser(loggedInUser);
                localStorage.setItem('loansphere_user', JSON.stringify(loggedInUser));
                return { success: true, needsRegistration: false, user: loggedInUser };
            } catch (err) {
                // Return needs registration
                const googleData = {
                    googleId: payload.sub,
                    email: payload.email,
                    name: payload.name || payload.email.split('@')[0],
                    picture: payload.picture || '',
                    token: credential,
                };
                return { success: true, needsRegistration: true, googleData };
            }
        } catch (error) {
            return { success: false, message: 'Google authentication failed.' };
        }
    }, []);

    const completeGoogleRegistration = useCallback(async (userData) => {
        const { name, email, googleId, picture, phone, role, password } = userData;
        try {
            const pwdToUse = password || googleId || `google_${Date.now()}`;
            const payload = {
                name,
                email,
                password: pwdToUse,
                role: role.toUpperCase()
            };
            const createdUser = await apiClient.post('/users/register', payload);
            const userToSet = { ...createdUser, role: createdUser.role.toLowerCase(), picture, phone };
            setUser(userToSet);
            localStorage.setItem('loansphere_user', JSON.stringify(userToSet));
            return { success: true, user: userToSet };
        } catch (error) {
            return { success: false, message: error.message || 'Google registration failed.' };
        }
    }, []);

    const updateUser = (data) => {
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem('loansphere_user', JSON.stringify(updatedUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('loansphere_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, updateUser, googleLogin, completeGoogleRegistration, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
