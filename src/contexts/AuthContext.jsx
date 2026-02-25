import React, { createContext, useContext, useState, useEffect } from 'react';
import { users } from '../data/mockData';

const AuthContext = createContext(null);

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

    const login = (email, password) => {
        const foundUser = users.find(u => u.email === email && u.password === password);
        if (foundUser) {
            const { password: _pw, ...userWithoutPassword } = foundUser;
            setUser(userWithoutPassword);
            localStorage.setItem('user', JSON.stringify(userWithoutPassword));
            return { success: true, user: userWithoutPassword };
        }
        return { success: false, message: 'Invalid credentials' };
    };

    const updateUser = (data) => {
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));

        const storedUsers = localStorage.getItem('fsad_users');
        if (storedUsers) {
            try {
                const allUsers = JSON.parse(storedUsers);
                const updatedAllUsers = allUsers.map(u => u.id === updatedUser.id ? { ...u, ...data } : u);
                localStorage.setItem('fsad_users', JSON.stringify(updatedAllUsers));
            } catch { /* ignore */ }
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
