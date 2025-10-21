// src/components/providers/RootProvider.tsx
'use client';

import React from 'react';
import { AuthProvider } from '@/lib/AuthContext'; // Import provider yang sudah kamu buat

// Komponen wrapper ini hanya bertugas untuk membungkus children dengan semua Context
export default function RootProvider({ children }: { children: React.ReactNode }) {
    // Di sini kamu bisa menempatkan semua Context/Providers yang menggunakan Client Hooks
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    );
}