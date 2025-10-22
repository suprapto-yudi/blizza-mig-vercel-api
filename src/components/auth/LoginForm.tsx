'use client'; 

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
// import { AuthService } from '@/lib/Auth';

// <<< GANTI DENGAN IMPORT CONTEXT BARU >>>
import { useAuth } from '@/lib/AuthContext'; 
// <<< -------------------------------- >>>

// Catatan: Dummy DB dihapus, sekarang kita panggil backend.

export default function LoginForm() {
    const router = useRouter(); 
    // <<< 1. AMBIL HANDLER DARI CONTEXT >>>
    const { login } = useAuth(); 
    // <<< ------------------------------ >>>

    const [formData, setFormData] = useState({
        email: '', 
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // 1. Validasi Input Kosong
        if (!formData.email || !formData.password) {
            setError('Email dan Password wajib diisi, Bro-Sis! Jangan sampai kosong ya.');
            setIsLoading(false);
            return;
        }

        try {
            // 2. Pemanggilan API ke Backend Express (Port 4000)
            // const response = await fetch('http://localhost:4000/api/login', { // <<< AKAN KITA BUAT
            // <<< 2. GANTI URL LENGKAP DENGAN PATH RELATIF >>>
            const response = await fetch('/api/login', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            // <<< ---------------------------------------- >>>

            const data = await response.json();

            if (!response.ok) {
                // Jika server merespon 400 (Kredensial salah) atau 500
                // Pesan error datang dari server.
                setError(data.message || 'Login gagal. Email atau Password salah.');
                return;
            }
            
            // 3. Sukses: Simpan Token menggunakan Context
            if (data.token && data.user) {
                // GANTI: AuthService.setAuth(data.token, data.user); 
                login(data.token, data.user); // <<< GUNAKAN LOGIN DARI CONTEXT
            }

            // Redirect ke Dashboard setelah login sukses
            router.push('/dashboard'); 

            return; // <<< PENTING: HENTIKAN EKSEKUSI DI SINI

        } catch (err) {
            // Error Jaringan (misal, backend belum running)
            console.error('Network/Fetch Error:', err);
            setError('Gagal terhubung ke server. Pastikan server backend sudah berjalan (Port 5000).');

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div id="login-form-container" className="w-full max-w-md">
            <div className="glassmorphism p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-6">Affiliate Login</h2>
                
                {/* Tampilkan Error Global */}
                {error && (
                    <p className="text-center error-message mb-4 font-semibold" style={{ display: 'block' }}>
                        {error}
                    </p>
                )}

                <form onSubmit={handleLogin} noValidate>
                    <div className="space-y-4">
                        {/* Email Input */}
                        <div>
                            <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input 
                                type="email" 
                                id="login-email" 
                                name="email" 
                                className="input mt-1 block w-full px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-soft-pink focus:border-rose-gold" 
                                required 
                                aria-label="Email Address" 
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        {/* Password Input */}
                        <div>
                            <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input 
                                type="password" 
                                id="login-password" 
                                name="password" 
                                className="input mt-1 block w-full px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-soft-pink focus:border-rose-gold" 
                                required 
                                aria-label="Password" 
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="mt-8">
                        <button 
                            type="submit" 
                            className="w-full bg-soft-pink text-white font-bold py-3 px-4 rounded-lg shadow-md transform hover:-translate-y-0.5 transition-all duration-300 hover-gradient disabled:opacity-50" 
                            aria-label="Log in to your account"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Processing...' : 'Login'}
                        </button>
                    </div>
                </form>
                <p className="text-center text-sm text-gray-600 mt-6">
                    Don't have an account? 
                    <a href="/signup" className="font-medium text-rose-gold hover:underline" aria-label="Switch to Sign Up page">Sign up here</a>
                </p>
            </div>
        </div>
    );
}