// src/components/layout/HeaderClient.tsx

'use client'; 
// <<< KOREKSI: Impor React secara eksplisit jika VS Code tidak mengenalinya
import React from 'react'; 

export default function HeaderClient() {
    // Ini markup dari page.tsx yang kamu pindahkan
    return (
        <header className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-rose-gold">Blizza</div>
                {/* PERUBAHAN 1: Tombol Affiliate Login mengarah ke /login */}
                <a 
                    href="/login" 
                    className="hidden md:inline-block px-6 py-2 text-sm font-semibold text-rose-gold border border-rose-gold rounded-full hover:bg-rose-gold hover:text-white transition-colors duration-300"
                >
                    Affiliate Login
                </a>
            </div>
        </header>
    );
}