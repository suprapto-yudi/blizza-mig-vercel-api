// src/lib/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { User, AuthService } from './Auth'; // Asumsi: User type & AuthService ada di src/lib/Auth.ts

// <<< TAMBAHKAN TIPE USER DI SINI (Atau impor dari src/types/user.ts jika ada) >>>
interface User {
    id: number;
    email: string;
    fullName: string;
    phone: string;
    // Tambahkan semua field user lainnya yang kamu gunakan
}
// <<< ------------------------------------------------------------------------ >>>

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

    // --- HELPER LOCAL STORAGE (Pindahkan dari AuthService) ---
    const getStoredAuth = () => {
        try {
            const token = localStorage.getItem('token');
            const userString = localStorage.getItem('user');
            if (token && userString) {
                return { token, user: JSON.parse(userString) as User };
            }
            return { token: null, user: null };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_error) {
            return { token: null, user: null };
        }
    };

    const setStoredAuth = (token: string, userData: User) => {
        try {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_error) {
            // Tindakan Darurat: Karena gagal simpan ke Local Storage, 
            // kita hapus token di memori dan Local Storage (jika ada) 
            // untuk mencegah inkonsistensi.
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    };

    const clearStoredAuth = () => {
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_error) {
            // Handle error
        }
    };
    // -----------------------------------------------------

    // [a] EFFECT: Cek Local Storage saat mount pertama kali
    useEffect(() => {
        const storedAuth = getStoredAuth();
        
        if (storedAuth.token && storedAuth.user) {
            setUser(storedAuth.user);
            setToken(storedAuth.token);
        }
        setIsLoading(false);
    }, []);

    // [b] FUNGSI LOGIN: Dipanggil saat user berhasil login atau update profile
    const login = (newToken: string, userData: User) => {
        setStoredAuth(newToken, userData); // Panggil helper baru
        setUser(userData);
        setToken(newToken);
    };

    // [c] FUNGSI LOGOUT: Dipanggil saat user klik Logout
    const logout = () => {
        clearStoredAuth(); // Panggil helper baru
        setUser(null);
        setToken(null);
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