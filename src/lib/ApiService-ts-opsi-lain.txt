// src/lib/ApiService.ts

import { AuthService } from "./Auth";

// Tipe data dasar untuk respons API
interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}

// URL dasar API (sesuai dengan backend NestJS kamu)
const BASE_URL = 'http://localhost:4000/api';

/**
 * Custom Fetch Wrapper untuk API yang memerlukan Token JWT.
 * @param endpoint - Endpoint API (contoh: '/todos')
 * @param options - Opsi standar fetch()
 */
export async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const token = AuthService.getToken();
    
    // Cek token, jika tidak ada, langsung tolak (kecuali kamu ingin menangani redirect di sini)
    if (!token) {
        // NOTE: Untuk kasus ini, redirect ke /login sudah dihandle oleh DashboardLayout.
        // Kita hanya melempar error agar komponen yang memanggil tahu.
        return { 
            success: false, 
            message: "Authentication token missing." 
        };
    }

    const url = `${BASE_URL}${endpoint}`;
    
    // Konfigurasi header standar
    const defaultHeaders = {
        'Content-Type': 'application/json',
        // --- INI KUNCI UTAMA: Menambahkan JWT ke header ---
        'Authorization': `Bearer ${token}`, 
    };

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers, // Memungkinkan override header
            },
        });

        // Parse body sebagai JSON
        const data = await response.json();

        // Jika respons HTTP bukan 2xx (misal 401 Unauthorized), anggap gagal.
        if (!response.ok) {
            // Jika 401/403 (Token Invalid/Expired), kita bisa panggil AuthService.logout()
            if (response.status === 401 || response.status === 403) {
                // AuthService.logout(); 
                // Redirect akan dihandle di komponen jika API call gagal
            }
            return {
                success: false,
                message: data.message || `API call failed with status: ${response.status}`,
            };
        }

        return {
            success: true,
            data: data as T,
        };

    } catch (error) {
        console.error('Network or parsing error:', error);
        return {
            success: false,
            message: "A network error occurred or the server is unreachable.",
        };
    }
}