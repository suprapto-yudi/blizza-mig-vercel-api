import SignupForm from '@/components/auth/SignupForm'; // Menggunakan Path Alias
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-grid-pattern flex flex-col items-center justify-center p-4 text-gray-800">
        
        {/* Header Link to Home */}
        <Link href="/" className="text-3xl font-bold text-rose-gold mb-8" aria-label="Back to Blizza homepage">
            Blizza
        </Link>

        {/* Render Komponen Form */}
        <SignupForm /> 
    </div>
  );
}