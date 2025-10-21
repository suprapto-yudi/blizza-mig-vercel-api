// src/lib/auth-helpers.ts
import jwt from 'jsonwebtoken';

// Definisikan tipe untuk data yang disimpan di dalam token JWT
interface JwtPayload {
    userId: number;
    // Kamu bisa tambahkan data lain di sini (misalnya: email, role)
}

// 1. FUNGSI UNTUK MEMBUAT TOKEN
export const signToken = (userId: number): string => {
    // Pastikan JWT_SECRET ada di Environment Variables (.env)
    const secret = process.env.JWT_SECRET; 
    
    if (!secret) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const payload: JwtPayload = { userId };
    
    // Token akan kedaluwarsa dalam 7 hari (sesuaikan jika perlu)
    return jwt.sign(payload, secret, { expiresIn: '7d' });
};

// 2. FUNGSI UNTUK MEMVERIFIKASI TOKEN
// Memeriksa apakah token valid (tidak rusak dan belum kedaluwarsa)
export const verifyToken = (token: string): boolean => {
    const secret = process.env.JWT_SECRET;
    if (!secret) return false;

    try {
        jwt.verify(token, secret);
        return true;
    } catch (error) {
        // console.error("Token verification failed:", error);
        return false;
    }
};

// 3. FUNGSI UNTUK MENDAPATKAN DATA (DECODE) DARI TOKEN
export const decodeToken = (token: string): JwtPayload | null => {
    try {
        // jwt.decode hanya membaca data tanpa memverifikasi signature/expiry.
        const decoded = jwt.decode(token) as JwtPayload;
        return decoded;
    } catch (error) {
        return null;
    }
};