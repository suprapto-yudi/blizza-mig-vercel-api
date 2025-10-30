// src/app/page.tsx 
// 'use client'; 
// import React from 'react';
import HeaderClient from '@/components/layout/HeaderClient';
export default function Page() {
  return (
    // Container for the entire page
    <div className="min-h-screen bg-grid-pattern overflow-hidden text-gray-800">
      {/* Header Section */}
      <HeaderClient />

      {/* Hero Section */}
      <main className="container mx-auto px-6 text-center mt-16 md:mt-24">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
          Join the <span className="text-rose-gold">Blizza</span><br className="hidden md:block" /> Affiliate Program
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
          Turn your influence into income. Partner with Blizza to earn commissions, win exclusive rewards, and grow with a community of creators.
        </p>
        <div className="mt-10">
          {/* PERUBAHAN 2: Tombol Sign Up Now mengarah ke /signup */}
          <a 
            href="/signup" 
            className="inline-block bg-soft-pink text-white font-bold text-lg px-10 py-4 rounded-full shadow-lg transform hover:-translate-y-1 transition-all duration-300 hover-gradient"
          >
            Sign Up Now
          </a>
        </div>
      </main>

      {/* Benefits Section (Tidak ada perubahan) */}
      <section className="container mx-auto px-6 py-24 md:py-32">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Why Partner With Us?</h2>
          <p className="mt-4 text-gray-600">Unlock your potential with unbeatable benefits.</p>
        </div>
        
        {/* Responsive 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Card 1: Commission */}
          <div className="glassmorphism p-8 rounded-2xl shadow-lg text-center transform hover:scale-105 transition-transform duration-300">
            <div className="inline-block p-4 bg-pale-pink rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-rose-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 6v-1h4v1h-4zm-2 18h4v-1h-4v1zm-2-2h8v-1h-8v1zm-2-2h12v-1h-12v1zm2-2h8v-1h-8v1zm2-2h4v-1h-4v1zm-2-12h8v-1h-8v1zM4 6h16v12H4V6z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">Generous Commissions</h3>
            <p className="text-gray-600">
              Earn up to <span className="font-semibold">Rp 2.000.000/month</span> plus content appreciation fees. Our tiered system rewards your growth—the more you sell, the higher your earnings.
            </p>
          </div>

          {/* Card 2: Rewards */}
          <div className="glassmorphism p-8 rounded-2xl shadow-lg text-center transform hover:scale-105 transition-transform duration-300">
            <div className="inline-block p-4 bg-pale-pink rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-rose-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-5.197-5.923M12 11a4 4 0 110-5.292M12 11a4 4 0 000 5.292m0 0a4 4 0 010 5.292M12 11a4 4 0 010-5.292" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">Exclusive Rewards</h3>
            <p className="text-gray-600">
              Win amazing monthly prizes, from product packages to shopping vouchers. Reach the Platinum tier for a chance to win a <span className="font-semibold">trip to Bali</span> and a Brand Ambassador contract!
            </p>
          </div>

          {/* Card 3: Leaderboard */}
          <div className="glassmorphism p-8 rounded-2xl shadow-lg text-center transform hover:scale-105 transition-transform duration-300">
            <div className="inline-block p-4 bg-pale-pink rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-rose-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">Live Leaderboard</h3>
            <p className="text-gray-600">
              Track your sales and points with a <span className="font-semibold">transparent, real-time dashboard</span>. Compete with other affiliates, climb the ranks, and see your name at the top.
            </p>
          </div>
        </div>
      </section>

      {/* Footer (Tidak ada perubahan) */}
      <footer className="container mx-auto px-6 py-12 text-center text-gray-500">
        <p className="font-bold text-2xl text-rose-gold mb-4">Blizza</p>
        <p>&copy; 2025 Blizza. All Rights Reserved.</p>
        <div className="mt-4">
          <a href="#" className="text-rose-gold hover:underline">Learn More</a>
          <span className="mx-2">&bull;</span>
          <a href="#" className="text-rose-gold hover:underline">Privacy Policy</a>
          <span className="mx-2">&bull;</span>
          <a href="#" className="text-rose-gold hover:underline">Terms of Service</a>
        </div>
      </footer>

    </div>
  );
}