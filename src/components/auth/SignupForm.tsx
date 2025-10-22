'use client'; 

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// === DUMMY DATABASE (Dihapus karena sekarang pakai Backend) ===
// DUMMY_AFFILIATE_DB_SIGNUP sudah dihilangkan dari sini.
// ======================================

export default function SignupForm() {
    const router = useRouter(); 

    const [formData, setFormData] = useState({
        fullName: '', email: '', password: '', phone: '', shopeeAccount: '', address: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Untuk tombol loading

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e: React.FormEvent) => { // Fungsi sekarang ASYNC
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        // 1. Validasi Input Kosong (Tetap di Frontend)
        for (const key in formData) {
            if (!formData[key as keyof typeof formData]) {
                setError('Ups! Semua data wajib diisi, Bro. Yuk, lengkapi dulu formulirnya ya!');
                setIsLoading(false);
                return;
            }
        }

        try {
            // 2. Pemanggilan API ke Backend Express (Port 4000)
            const response = await fetch('http://localhost:4000/api/signup', { // <<< PANGGIL BACKEND
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            // <<< PERBAIKAN: Ambil JSON response HANYA SEKALI >>>
            const data = await response.json(); 
            // ----------------------------------------------------

            if (response.ok) {
                // Asumsi: Backend mengirimkan token dan user saat Sign Up sukses
                // NOTE: Kita fokus pada redirect ke Login dulu, autologin diabaikan sementara
                // if (data.token && data.user) {
                //     AuthService.setAuth(data.token, data.user); 
                // }
                
                // 3. Sukses: Redirect ke Login
                setSuccess("Pendaftaran Berhasil! Mengarahkanmu ke halaman Login...");
                
                setTimeout(() => {
                    router.push('/login?success=true'); // Redirect ke Login
                }, 1500); 
                return;

            } else {
                // 4. Gagal: Tampilkan pesan error dari backend
                // Data dijamin ada karena kita panggil response.json() di atas
                setError(data.message || "Pendaftaran gagal karena masalah server.");
                setIsLoading(false);
                return;
            }

        } catch (err) {
            // Error Jaringan (misal, backend belum running)
            console.error('Network/Fetch Error:', err);
            setError("Gagal terhubung ke server. Pastikan server backend sudah berjalan (Port 5000).");
            setIsLoading(false);

        } finally {
            // Catatan: setIsLoading(false) akan dijalankan di try/catch
            // Kecuali jika ada redirect
        }
    };

    return (
        <div id="signup-form-container" className="w-full max-w-md">
            <div className="glassmorphism p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-6">Create Affiliate Account</h2>
                
                {/* Tampilkan Status Global */}
                {error && (
                    <p className="text-center error-message mb-4 font-semibold" style={{ display: 'block' }}>
                        {error}
                    </p>
                )}
                {success && (
                    <p className="text-center text-green-600 font-semibold mb-4" style={{ display: 'block' }}>
                        {success}
                    </p>
                )}

                <form onSubmit={handleSignup} noValidate>
                    <div className="space-y-4">
                        {/* Semua Input Fields */}
                        {/* ... (gunakan value={formData.field} dan onChange={handleChange} seperti sebelumnya) ... */}
                        
                        <div>
                            <label htmlFor="signup-name" className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input type="text" id="signup-name" name="fullName" className="input mt-1 block w-full px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-soft-pink focus:border-rose-gold" required aria-label="Full Name" value={formData.fullName} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" id="signup-email" name="email" className="input mt-1 block w-full px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-soft-pink focus:border-rose-gold" required aria-label="Email Address" value={formData.email} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input type="password" id="signup-password" name="password" className="input mt-1 block w-full px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-soft-pink focus:border-rose-gold" required aria-label="Password" value={formData.password} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="signup-phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <input type="tel" id="signup-phone" name="phone" className="input mt-1 block w-full px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-soft-pink focus:border-rose-gold" required aria-label="Phone Number" value={formData.phone} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="signup-shopee" className="block text-sm font-medium text-gray-700">Shopee Affiliate Account Name</label>
                            <input type="text" id="signup-shopee" name="shopeeAccount" className="input mt-1 block w-full px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-soft-pink focus:border-rose-gold" required aria-label="Shopee Affiliate Account Name" value={formData.shopeeAccount} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="signup-address" className="block text-sm font-medium text-gray-700">Home Address</label>
                            <textarea id="signup-address" name="address" rows={3} className="input mt-1 block w-full px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-soft-pink focus:border-rose-gold" required aria-label="Home Address" value={formData.address} onChange={handleChange}></textarea>
                        </div>
                    </div>
                    <div className="mt-8">
                        <button 
                            type="submit" 
                            className="w-full bg-soft-pink text-white font-bold py-3 px-4 rounded-lg shadow-md transform hover:-translate-y-0.5 transition-all duration-300 hover-gradient disabled:opacity-50" 
                            aria-label="Create your new account"
                            disabled={isLoading} // Tombol dinonaktifkan saat loading
                        >
                            {isLoading ? 'Processing...' : 'Sign Up'}
                        </button>
                    </div>
                </form>
                <p className="text-center text-sm text-gray-600 mt-6">
                    Already have an account? 
                    <Link href="/login" className="font-medium text-rose-gold hover:underline" aria-label="Switch to Login page">Login here</Link>
                </p>
            </div>
        </div>
    );
}