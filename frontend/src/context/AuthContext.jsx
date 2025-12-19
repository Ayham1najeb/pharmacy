import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [pharmacy, setPharmacy] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Fetch user data on mount if token exists
    useEffect(() => {
        if (token) {
            fetchUserData();
        } else {
            setLoading(false);
        }
    }, [token]);

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${API_BASE}/api/v1/auth/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setUser(response.data.data.user);
                setPharmacy(response.data.data.pharmacy);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${API_BASE}/api/v1/auth/login`, {
                email,
                password
            });

            if (response.data.success) {
                const { user, pharmacy, token } = response.data.data;
                setUser(user);
                setPharmacy(pharmacy);
                setToken(token);
                localStorage.setItem('token', token);
                return response.data;
            }
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            if (token) {
                await axios.post(`${API_BASE}/api/v1/auth/logout`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            setPharmacy(null);
            setToken(null);
            localStorage.removeItem('token');
        }
    };

    const isAdmin = () => user?.role === 'admin';
    const isPharmacist = () => user?.role === 'pharmacist';

    return (
        <AuthContext.Provider value={{
            user,
            pharmacy,
            token,
            loading,
            login,
            logout,
            isAuthenticated: !!token,
            isAdmin,
            isPharmacist,
            fetchUserData
        }}>
            {children}
        </AuthContext.Provider>
    );
};
