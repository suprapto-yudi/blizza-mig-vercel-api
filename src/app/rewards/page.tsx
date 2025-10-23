import DashboardLayout from '@/components/layout/DashboardLayout';
import React from 'react';
import Image from 'next/image';

// Component utama untuk konten Rewards
const RewardsContent = () => {
    // --- Data Mockup yang Jelas (Mudah Diubah ke Data API) ---
    const rewards = [
        {
            name: "Blizza T-Shirt",
            points: 1100,
            description: "High-quality cotton T-shirt with our company logo.",
            image: "https://placehold.co/400x300/FCE7F3/B76E79?text=Blizza+T-Shirt",
        },
        {
            name: "$25 Gift Card",
            points: 2100,
            description: "A gift card for your favorite online store.",
            image: "https://placehold.co/400x300/FCE7F3/B76E79?text=Gift+Card",
        },
        {
            name: "Trip to Bali",
            points: 15000,
            description: "An all-expenses-paid dream vacation for two.",
            image: "https://placehold.co/400x300/FCE7F3/B76E79?text=Trip+to+Bali",
        },
    ];
    
    // Asumsi poin user saat ini (Placeholder yang akan diganti API)
    const userPoints = 8250; 
    const nextGoalPoints = 15000; 

    // Component Kartu Reward Reusable
    const RewardCard = ({ name, points, description, image }: typeof rewards[0]) => {
        const canRedeem = userPoints >= points;
        const pointsNeeded = points - userPoints;

        return (
            <div className="bg-white p-4 rounded-2xl shadow-xl flex flex-col justify-between transform transition duration-300 hover:scale-[1.02] border-2 border-pale-pink">
                <Image src={image} alt={name} className="w-full h-32 object-cover rounded-xl mb-4"/>
                <div className="flex flex-col flex-grow">
                    <h3 className="text-xl font-extrabold text-pink-600 mb-1">{name}</h3>
                    <p className="text-lg font-semibold text-rose-gold mb-3">{points.toLocaleString()} Points</p>
                    <p className="text-sm text-gray-500 mb-4 flex-grow">{description}</p>
                </div>
                
                <button 
                    className={`w-full mt-auto font-bold py-3 px-4 rounded-xl transition-colors ${
                        canRedeem 
                            ? 'bg-soft-pink text-white hover:bg-rose-gold'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={!canRedeem}
                >
                    {canRedeem ? 'Redeem Now' : 'Locked'}
                </button>
                
                {!canRedeem && (
                     <p className="text-xs text-red-500 text-center mt-2">
                        {pointsNeeded.toLocaleString()} points more needed
                     </p>
                )}
            </div>
        );
    };

    return (
        <div className='p-4'>
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-pink-600">Rewards Catalog 🎁</h1>
                <p className="text-gray-500 mt-1">Use your points to redeem exclusive rewards.</p>
            </header>

            {/* --- Poin Status Header --- */}
            <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 border-l-4 border-rose-gold">
                <p className="text-sm text-gray-500 font-semibold">Your Current Points</p>
                <p className="text-4xl font-extrabold mt-1 text-rose-gold">{userPoints.toLocaleString()}</p>
                <p className="text-sm text-blue-500 mt-2">Next Goal: Trip to Bali ({nextGoalPoints.toLocaleString()} points).</p>
            </div>

            {/* Grid Kartu Rewards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {rewards.map((reward, index) => (
                    <RewardCard key={index} {...reward} />
                ))}
            </div>
        </div>
    );
};

// Component Halaman Utama
export default function RewardsPage() {
    return (
        <DashboardLayout>
            <RewardsContent />
        </DashboardLayout>
    );
}