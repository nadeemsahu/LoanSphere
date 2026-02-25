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
        const foundUser = allUsers.find(u => u.email === email && u.password === password);
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
        <AuthContext.Provider value={{ user, login, logout, register, updateUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
