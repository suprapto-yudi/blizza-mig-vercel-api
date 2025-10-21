import LoginForm from '@/components/auth/LoginForm'; // Menggunakan Path Alias

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-grid-pattern flex flex-col items-center justify-center p-4 text-gray-800">
        
        {/* Header Link to Home */}
        <a href="/" className="text-3xl font-bold text-rose-gold mb-8" aria-label="Back to Blizza homepage">
            Blizza
        </a>

        {/* Render Komponen Form */}
        <LoginForm /> 
    </div>
  );
}