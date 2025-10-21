// src/components/layout/DashboardLayout.tsx (Koreksi Final)
'use client'; 
import React, { useEffect } from 'react';
// import React, { useEffect, useState } from 'react'; // <<< TAMBAH useState DI SINI
import Link from 'next/link'; 
import { useRouter, usePathname } from 'next/navigation'; // <<< TAMBAH usePathname
// import { AuthService } from '@/lib/Auth'; 

// <<< IMPORT BARU >>>
import { useAuth } from '@/lib/AuthContext'; 
// <<< ------------ >>>

// --- Icon Definitions (di luar komponen utama) ---
const HomeIcon = (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>);
const LeaderboardIcon = (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>);
const RewardsIcon = (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c1.657 0 3-1.343 3-3S13.657 2 12 2 9 3.343 9 5s1.343 3 3 3zm0 2c-2.21 0-4 1.79-4 4v1a2 2 0 002 2h4a2 2 0 002-2v-1c0-2.21-1.79-4-4-4zm0 6H9v2h6v-2z" /></svg>);
const SettingsIcon = (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>);
const LogoutIcon = (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>);


// NavLink Component: Diubah untuk menggunakan usePathname
const NavLink = ({ href, icon, children }: { href: string, icon: React.ReactNode, children: React.ReactNode }) => {
    const pathname = usePathname(); // <<< MENGGUNAKAN HOOK PATHNAME
    const isActive = pathname === href;
    const activeClass = isActive 
        ? 'bg-pale-pink text-rose-gold font-semibold' 
        : 'text-gray-500 hover:bg-pale-pink hover:text-rose-gold';

    return (
        <Link 
            href={href} 
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeClass}`}
        >
            {icon}
            <span>{children}</span>
        </Link>
    );
};


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    // 1. Tambahkan state untuk mengontrol apakah klien sudah siap render
    // const [isClientReady, setIsClientReady] = useState(false); 

    // <<< GANTI LOGIC LAMA DENGAN useAuth() >>>
    // Kita ambil token, user (opsional), isLoading, dan logout handler dari Context
    const { token, isLoading, logout } = useAuth(); 
    // <<< -------------------------------- >>>

    // HANDLER LOGOUT
    // const handleLogout = () => {
    //     AuthService.logout(); 
    //     router.push('/login');
    // };

    // HANDLER LOGOUT BARU
    const handleLogout = () => {
        // <<< PANGGIL LOGOUT DARI CONTEXT >>>
        logout(); 
        // <<< --------------------------- >>>
        router.push('/login');
 };

    // HAPUS SELURUH BLOK useEffect LAMA YANG MEMERIKSA isClientReady/AuthService.isLoggedIn()
    // 1. LOGIC PROTEKSI AUTH dan HYDRATION FIX
    // LOGIC PROTEKSI AUTH dan HYDRATION FIX
    // useEffect(() => {
        // Cek Auth di sisi klien (setelah mount)
    //     if (!AuthService.isLoggedIn()) {
            // Jika tidak ada token, langsung redirect
    //         router.push('/login'); 
    //     } else {
            // Jika token ada, kita set state siap render
    //         setIsClientReady(true); 
    //     }
    // }, [router]);

    // <<< KODE PROTEKSI BARU (YANG HILANG) >>>
    useEffect(() => {
        // Hanya jalankan redirect jika loading sudah selesai dan tidak ada token
        if (!isLoading && !token) { 
            router.push('/login'); 
        }
    }, [token, isLoading, router]);
    // <<< -------------------------------- >>>

    // 2. TUNDA RENDER: Tampilkan loading/null jika belum siap (saat SSR)
    // if (!isClientReady) {
    //     return <div className="min-h-screen flex items-center justify-center bg-pale-pink">Loading...</div>;
    // }

    // [1] Tampilkan Loading State jika Context belum selesai cek Local Storage
    if (isLoading) {
        return (
            // Pastikan loading screen mengisi seluruh layar
            <div className="min-h-screen flex items-center justify-center bg-pale-pink">
                Memeriksa otentikasi...
            </div>
        );
    }
    
    // [2] Redirect jika TIDAK ADA token setelah loading selesai
    if (!token) {
        // Redirect sudah dipanggil di useEffect di atas, jadi kita hanya return null di sini
        // router.push('/login');
        return null; 
    }

    // 3. RENDER FINAL: Hanya render jika token sudah ada
    return (
        <div className="flex h-screen bg-pale-pink overflow-hidden">
            {/* Sidebar */}
            <aside id="sidebar" className="w-64 bg-white p-6 shadow-lg transform -translate-x-full md:translate-x-0 transition-transform duration-300 ease-in-out z-30 fixed md:relative h-full flex flex-col">
                <div className="flex items-center space-x-4 mb-10">
                    <Link href="/" className="text-3xl font-bold text-rose-gold" aria-label="Blizza homepage">
                        Blizza
                    </Link>
                </div>
                <nav className="space-y-2 flex-grow">
                    {/* NAVIGASI DENGAN LOGIC HIGHLIGHT TERBARU */}
                    <NavLink href="/dashboard" icon={HomeIcon}>Dashboard</NavLink>
                    <NavLink href="/leaderboard" icon={LeaderboardIcon}>Leaderboard</NavLink>
                    <NavLink href="/rewards" icon={RewardsIcon}>Rewards</NavLink>
                    <NavLink href="/settings" icon={SettingsIcon}>Settings</NavLink>
                </nav>
                
                {/* TOMBOL LOGOUT */}
                <div className="p-4 mt-auto">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center p-3 rounded-xl text-gray-500 border border-gray-200 hover:bg-red-50 hover:text-red-500 transition-colors font-semibold justify-center"
                    >
                        {LogoutIcon}
                        <span className="ml-3">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto bg-grid-pattern">
                {/* Hamburger Menu Button (Mobile) - Tidak diubah */}
                <button className="md:hidden fixed top-4 right-4 p-2 rounded-md text-gray-500 bg-white shadow z-40">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
                
                {/* PAGE CONTENT CONTAINER */}
                <div id="content-container" className="p-6 md:p-10">
                    {children}
                </div>
            </main>
        </div>
    );
}