// src/app/leaderboard/page.tsx

import DashboardLayout from "@/components/layout/DashboardLayout";
import React from "react";

const LeaderboardContent = () => {
    // --- Pastikan tidak ada tag yang salah tutup atau children yang bertabrakan ---
    return (
        <> {/* <-- Wajib dibungkus Fragment karena me-return header dan div terpisah */}
            <header className="mb-8">
                <h1 className="text-3xl font-bold">Affiliate Leaderboard 🏆</h1>
                <p className="text-gray-500 mt-1">"See who is leading the pack and get inspired!"</p>
            </header>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Global Rankings</h2>
                    <div className="flex space-x-2">
                        <button className="bg-pale-pink text-rose-gold font-semibold px-4 py-2 rounded-lg text-sm">This Month</button>
                        <button className="bg-gray-100 text-gray-600 font-semibold px-4 py-2 rounded-lg text-sm">All Time</button>
                    </div>
                </div>
                {/* Leaderboard Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-sm text-gray-500 border-b-2">
                                <th className="py-3 px-3">Rank</th>
                                <th className="py-3 px-3">Affiliate</th>
                                <th className="py-3 px-3">Tier</th>
                                <th className="py-3 px-3">Total Sales</th>
                                <th className="py-3 px-3 text-right">Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Top 3 with special styling */}
                            <tr className="border-b bg-yellow-50"><td className="p-4 font-bold">🥇 1</td><td className="p-4 font-semibold">suryaniputri007</td><td className="p-4"><span className="bg-yellow-200 text-yellow-800 text-xs font-bold mr-2 px-2.5 py-0.5 rounded-full">Gold</span></td><td className="p-4">Rp 3.083.431</td><td className="p-4 font-bold text-right">32</td></tr>
                            <tr className="border-b bg-gray-50"><td className="p-4 font-bold">🥈 2</td><td className="p-4 font-semibold">Nuralaithifaq</td><td className="p-4"><span className="bg-yellow-200 text-yellow-800 text-xs font-bold mr-2 px-2.5 py-0.5 rounded-full">Gold</span></td><td className="p-4">Rp 3.221.084</td><td className="p-4 font-bold text-right">32</td></tr>
                            <tr className="border-b bg-orange-50"><td className="p-4 font-bold">🥉 3</td><td className="p-4 font-semibold">Mbakranah001</td><td className="p-4"><span className="bg-yellow-200 text-yellow-800 text-xs font-bold mr-2 px-2.5 py-0.5 rounded-full">Gold</span></td><td className="p-4">Rp 2.876.500</td><td className="p-4 font-bold text-right">31</td></tr>
                            {/* Other ranks */}
                            <tr className="border-b hover:bg-pale-pink transition-colors"><td className="p-4 font-bold">4</td><td className="p-4 font-semibold">blizzababy.id</td><td className="p-4"><span className="bg-gray-200 text-gray-800 text-xs font-bold mr-2 px-2.5 py-0.5 rounded-full">Classic</span></td><td className="p-4">Rp 2.543.120</td><td className="p-4 font-bold text-right">29</td></tr>
                            <tr className="border-b hover:bg-pale-pink transition-colors"><td className="p-4 font-bold">5</td><td className="p-4 font-semibold">mommy.review</td><td className="p-4"><span className="bg-gray-200 text-gray-800 text-xs font-bold mr-2 px-2.5 py-0.5 rounded-full">Classic</span></td><td className="p-4">Rp 2.110.000</td><td className="p-4 font-bold text-right">25</td></tr>
                            <tr className="hover:bg-pale-pink transition-colors"><td className="p-4 font-bold">6</td><td className="p-4 font-semibold">cerita.bunda</td><td className="p-4"><span className="bg-gray-200 text-gray-800 text-xs font-bold mr-2 px-2.5 py-0.5 rounded-full">Classic</span></td><td className="p-4">Rp 1.850.500</td><td className="p-4 font-bold text-right">22</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default function LeaderboardPage() {
    return (
        <DashboardLayout>
            <LeaderboardContent />
        </DashboardLayout>
    );
}