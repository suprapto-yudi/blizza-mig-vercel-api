// src/app/api/login/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken'; // Pastikan kamu sudah npm install jsonwebtoken
// import bcrypt from 'bcryptjs'; // Jika kamu menggunakan hashing

export async function POST(request: Request) {
    // Ambil secret dari environment variable
    const SECRET = process.env.JWT_SECRET;

    // Pastikan JWT_SECRET ada
    if (!SECRET) {
        // Ini akan melempar error di runtime jika SECRET hilang dari Vercel ENV
        // Ini lebih baik daripada membiarkan jwt.sign() gagal dengan typing error.
        console.error('FATAL: JWT_SECRET is not defined in environment variables.');
        // KARENA INI TERJADI DI SERVERLESS, KITA RETURN ERROR 500
        return new NextResponse(JSON.stringify({ message: 'Server configuration error.' }), { status: 500 });
    }

    try {
        const body = await request.json();
        const { email, password } = body; 

        // 1. Validasi Input
        if (!email || !password) {
            return new NextResponse(JSON.stringify({ message: 'Email dan Password wajib diisi.' }), { status: 400 });
        }

        // 2. Cari User di Database
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return new NextResponse(JSON.stringify({ message: 'Email tidak terdaftar atau kredensial salah.' }), { status: 401 }); // 401 Unauthorized
        }

        // 3. Verifikasi Password
        // CATATAN: Karena Sign Up kamu menyimpan password mentah, kita bandingkan langsung.
        // Jika kamu menggunakan bcrypt, ganti baris ini dengan:
        // const isPasswordValid = await bcrypt.compare(password, user.password);
        
        const isPasswordValid = (password === user.password); // <-- Untuk testing cepat

        if (!isPasswordValid) {
            return new NextResponse(JSON.stringify({ message: 'Password salah.' }), { status: 401 }); // 401 Unauthorized
        }

        // 4. Generate Token JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            SECRET,
            { expiresIn: '7d' } 
        );

        // 5. Response Sukses
        // Hapus password dari objek user sebelum dikirim ke front-end
        const { password: _, ...userWithoutPassword } = user;

        return new NextResponse(JSON.stringify({ 
            message: 'Login sukses.',
            token,
            user: userWithoutPassword
        }), { 
            status: 200, // 200 OK
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error("Error during login:", error);
        return new NextResponse(JSON.stringify({ message: 'Server error saat proses login.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}