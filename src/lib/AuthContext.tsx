// src/lib/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthService } from './Auth'; // Asumsi: User type & AuthService ada di src/lib/Auth.ts

// 1. Definisikan Tipe Context
interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean; // True saat cek token pertama kali
    login: (token: string, userData: User) => void;
    logout: () => void;
}

// Default Value (digunakan saat Context dibuat)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Buat Provider Component
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // [a] EFFECT: Cek Local Storage saat mount pertama kali (Hydration)
    useEffect(() => {
        const storedToken = AuthService.getToken();
        const storedUser = AuthService.getUser();
        
        if (storedToken && storedUser) {
            setUser(storedUser);
            setToken(storedToken);
        }
        setIsLoading(false);
    }, []);

    // [b] FUNGSI LOGIN: Dipanggil saat user berhasil login atau update profile
    const login = (newToken: string, userData: User) => {
        AuthService.setAuth(newToken, userData); // Simpan ke Local Storage
        setUser(userData); // Update State
        setToken(newToken); // Update State
    };

    // [c] FUNGSI LOGOUT: Dipanggil saat user klik Logout
    const logout = () => {
        AuthService.logout(); // Hapus dari Local Storage
        setUser(null); // Clear State
        setToken(null); // Clear State
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// 3. Buat Custom Hook untuk Akses Context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};