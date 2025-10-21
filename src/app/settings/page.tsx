// src/app/settings/page.tsx
'use client';
import { useRouter } from 'next/navigation'; // <<< INI PENTING: Import hook router
import DashboardLayout from '@/components/layout/DashboardLayout';
import React, { useState, useEffect } from 'react';
// <<< TAMBAHKAN BARIS INI >>>
// import { apiFetch } from '@/lib/ApiService'; 
// <<< ----------------- >>>
// import { AuthService, User } from '@/lib/Auth'; // <<< Ambil AuthService dan Tipe User

// <<< IMPORT BARU DARI CONTEXT >>>
import { useAuth } from '@/lib/AuthContext'; 
// <<< ----------------------- >>>

/*
// <<< TAMBAHKAN INTERFACE BARU INI >>>
interface ProfileUpdateResponse {
    success: boolean;
    message: string;
    user: User; // User adalah objek user lengkap yang dikembalikan backend
}
// <<< --------------------------- >>>
*/

const SettingsContent = () => {
    // 1. DEKLARASI HOOKS DI AWAL KOMPONEN
    // 1. AMBIL SEMUA DARI CONTEXT
    const { user: authUser, token, login, logout } = useAuth();
    const router = useRouter(); // <<< TAMBAHKAN DEKLARASI INI DI SINI
    
    /*
    // State untuk menyimpan data profil yang dimuat
    const [profile, setProfile] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false); // State untuk tombol Save Profile
    */

    // State lokal untuk Form Profile
    const [formData, setFormData] = useState({
        // Langsung ambil nilai awal dari Context (authUser)
        fullName: authUser?.fullName || '',
        email: authUser?.email || '',
        phone: authUser?.phone || '',
    });

    // [1] PENEMPATAN STATE PASSWORD BARU: Di sini
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
    });

    // Deklarasi state loading khusus Password
    const [isSaving, setIsSaving] = useState(false);
    const [isPasswordSaving, setIsPasswordSaving] = useState(false);
    // ------------------------------------------

    /*
    useEffect(() => {
        // Ambil data user dari AuthService (Local Storage)
        const user = AuthService.getUser();
        if (user) {
            setProfile(user);
        }
        setIsLoading(false);
    }, []);
    */

    /*
    // Placeholder untuk state form (untuk diimplementasi fitur edit nanti)
    const [formData, setFormData] = useState({
        fullName: profile?.fullName || '',
        email: profile?.email || '',
        phone: profile?.phone || '',
        // tambahkan field lain jika ada
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                fullName: profile.fullName || '',
                email: profile.email || '',
                phone: profile.phone || '',
            });
        }
    }, [profile]);
    */
    
    // EFEK UNTUK SINKRONISASI (penting saat user berhasil login atau data user dimuat pertama)
    useEffect(() => {
        // Hanya update formData jika Context user sudah ada dan berbeda
        if (authUser) {
            setFormData({
                fullName: authUser.fullName || '',
                email: authUser.email || '',
                phone: authUser.phone || '',
            });
        }
        // Dependensi: authUser memastikan state lokal sinkron dengan state global
    }, [authUser]);

    // Handler untuk simulasi Update (nantinya memanggil API PUT /api/profile)
    // const handleUpdateProfile = (e: React.FormEvent) => {
    //     e.preventDefault();
    //     alert('Fitur Update Profil belum terhubung ke API backend! Data saat ini dari Local Storage.');
    // };

    // --- MODIFIKASI: HANDLER UPDATE PROFILE ---
    // --- HANDLER 1: UPDATE PROFILE (Menggunakan Context.login) ---
    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const dataToSend = {
            fullName: formData.fullName,
            phone: formData.phone,
            // Tambahkan field lain yang bisa diupdate (misal: shopeeAccount, address)
            // (email tidak diizinkan diubah)
        };

        // Cek token dari Context
        // const token = AuthService.getToken();
        if (!token) {
            alert("Sesi berakhir. Mohon login ulang.");
            // Anda bisa tambahkan redirect ke /login di sini
            setIsSaving(false);
            logout(); // Panggil logout dari Context
            router.push('/login');
            return;
        }
        
        try {
            const response = await fetch('${process.env.NEXT_PUBLIC_API_URL}/api/profile', { // <<< GUNAKAN URL BACKEND LENGKAP
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(dataToSend),
            });
            
            // 1. Coba parse JSON
            const result = await response.json();

            // 2. Cek apakah respons sukses (Status 200-299)
            if (response.ok && result.success && result.user) {
                // **BLOK SUKSES:** Server mengirim 200 OK
                // if (result.success && result.user) {
                    // AuthService.setAuth(token, result.user); 
                    // setProfile(result.user);
                alert('✅ Profil berhasil diperbarui!');
                // } else {
                    // Ini seharusnya tidak terjadi jika backend benar
                    // alert('⚠️ Gagal: Respons sukses tapi data user tidak lengkap.');
                // }
                // 3. PERBARUI CONTEXT dengan data user terbaru
                login(token, result.user); // Panggil login dari Context untuk update user

            } else {
                // **BLOK GAGAL:** Status Code 4xx atau 5xx
                const errorMessage = result.message || response.statusText;
                alert(`❌ Gagal memperbarui profil: ${errorMessage}`);
            }

        } catch (error: any) {
            // **BLOK GAGAL TEKNIS:** Kegagalan Jaringan/Koneksi
            /*
            let errorMessage = 'Gagal terhubung ke server. Pastikan server Express berjalan.';
            if (error.message) {
                errorMessage = error.message;
            }
            */
            alert('❌ Gagal terhubung ke server. Pastikan server Express berjalan.');
        } finally {
            setIsSaving(false);
        }
    };
    // ------------------------------------------
    
    // Handler untuk Change Password (nantinya memanggil API POST /api/change-password)
    // --- HANDLER 2: CHANGE PASSWORD (Menggunakan Context.logout) ---
    // Ganti fungsi ini di page.tsx
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        const { currentPassword, newPassword } = passwordData;

        // 1. Validasi input di sisi klien
        if (!currentPassword || !newPassword) {
            alert('Password saat ini dan Password baru wajib diisi.');
            return;
        }

        // const token = AuthService.getToken();

        // **2. Cek Token dari Context**
        if (!token) {
            alert("Sesi berakhir. Mohon login ulang.");
            logout(); // Panggil logout dari Context
            router.push('/login');
            return;
        }

        // Menggunakan state loading baru
        setIsPasswordSaving(true);

        try {
            const response = await fetch('${process.env.NEXT_PUBLIC_API_URL}/api/change-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            // Coba parse JSON
            const result = await response.json();

            if (response.ok) {
                // Sukses: Password diganti
                alert(`✅ ${result.message}`); 

                // Hapus token dan redirect ke login (sesi lama kadaluarsa)
                // AuthService.logout();
                logout(); // Panggil logout dari Context
                router.push('/login');
            } else {
                // Gagal: Password lama salah, atau validasi gagal
                const errorMessage = result.message || 'Gagal mengubah password karena kesalahan server.';
                alert(`❌ ${errorMessage}`);
            }

        } catch (error) {
            alert('❌ Gagal terhubung ke server untuk mengubah password.');
        } finally {
            // Bersihkan form
            setPasswordData({ currentPassword: '', newPassword: '' });
            // Menonaktifkan state loading
            setIsPasswordSaving(false);
        }
    };
    // <<< ------------------------------------ >>>

    /*
    if (isLoading) {
        return <div className="text-center py-10 text-gray-500">Loading Profile...</div>;
    }
    */

    return (
        <>
            <h1 className="text-3xl font-bold mb-6 text-pink-600">Account Settings ⚙️</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Bagian Kiri: Profile Information & Password */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* --- Profile Information --- */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-bold mb-4 border-b pb-2">Profile Information</h2>
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input
                                    type="text"
                                    name="fullName" // <<< TAMBAHKAN NAMA FIELD
                                    value={formData.fullName} // Tampil dari state profil
                                    // disabled // Saat ini hanya display, tidak bisa diubah
                                    // <<< TAMBAHKAN HANDLER ONCHANGE INI >>>
                                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                                <input
                                    type="email"
                                    value={formData.email} // Tampil dari state profil
                                    disabled
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                <input
                                    type="text"
                                    name="phone" // <<< TAMBAHKAN NAMA FIELD
                                    value={formData.phone || ''} // Tampil dari state profil
                                    // disabled
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
                                />
                            </div>
                            <button
                                type="submit"
                                // <<< KOREKSI: Atribut disabled dan className harus di sini >>>
                                disabled={isSaving} 
                                className="bg-soft-pink text-white font-bold py-2 px-4 rounded-lg transition-colors hover:bg-rose-gold disabled:bg-gray-400"
                                // -----------------------------------------------------------
                            >
                                {/* Teks dinamis saat loading */}
                                {isSaving ? 'Saving...' : 'Save Profile'}
                            </button>
                        </form>
                    </div>

                    {/* --- Change Password --- */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-bold mb-4 border-b pb-2">Change Password</h2>
                        
                        {/* PASTIKAN FORM INI TERTUTUP DAN HANYA ADA INPUT & BUTTON DI DALAMNYA */}
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            
                            {/* Input Current Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                                <input 
                                    type="password" 
                                    value={passwordData.currentPassword} 
                                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} 
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
                                />
                            </div>
                            
                            {/* Input New Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">New Password</label>
                                <input 
                                    type="password" 
                                    value={passwordData.newPassword} 
                                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} 
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
                                />
                            </div>
                            
                            {/* <<< TAMBAHKAN KEMBALI TOMBOL SUBMIT INI >>> */}
                            <button
                                type="submit"
                                // <<< HUBUNGKAN STATE DI SINI >>>
                                disabled={isPasswordSaving} // Nonaktifkan tombol saat loading
                                className="bg-soft-pink text-white font-bold py-2 px-4 rounded-lg transition-colors hover:opacity-90 disabled:bg-gray-400"
                            >
                                {/* <<< TEKS DINAMIS DI SINI >>> */}
                                {isPasswordSaving ? 'Updating...' : 'Update Password'} 
                            </button>
                            {/* <<< ----------------------------------- >>> */}

                        </form> {/* PASTIKAN TAG FORM TERTUTUP DI SINI */}
                    </div>
                </div>
                
                {/* Bagian Kanan: Notifications (Mockup Statis) */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-bold mb-4 border-b pb-2">Notifications</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium">Email Notifications</p>
                                    <p className="text-sm text-gray-500">Get emails about your performance.</p>
                                </div>
                                <input type="checkbox" className="toggle toggle-sm bg-rose-gold" defaultChecked />
                            </div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium">Weekly Reports</p>
                                    <p className="text-sm text-gray-500">Receive a weekly summary.</p>
                                </div>
                                <input type="checkbox" className="toggle toggle-sm bg-rose-gold" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default function SettingsPage() {
    return (
        <DashboardLayout>
            <SettingsContent />
        </DashboardLayout>
    );
}