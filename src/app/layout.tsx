// src/app/layout.tsx
import type { Metadata } from 'next';
// --- (1) Pertahankan Import Font Geist ---
import { Geist, Geist_Mono } from 'next/font/google'; 
import "./globals.css";
import RootProvider from '@/components/providers/RootProvider'; // Import provider wrapper

// <<< TAMBAHKAN IMPORT AuthProvider INI >>>
// <<< GANTI IMPORT LAMA >>>
// import { AuthProvider } from '@/lib/AuthContext'; 
// <<< -------------------------------- >>>

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Blizza Affiliate Program",
  description: "Join Blizza and earn commissions, rewards, and leaderboard spots!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <RootProvider>
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
