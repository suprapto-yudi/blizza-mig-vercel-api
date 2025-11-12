// src/app/api/signup/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Sesuaikan path ini jika perlu
// import { hashPassword } from '@/lib/auth-helper'; // Jika kamu punya helper hash password

export async function POST(request: Request) {
    try {
        const body = await request.json();
        // Ambil data yang dibutuhkan dari body
        const { fullName, email, password, phone, shopeeAccount, address } = body; 

        // 1. Validasi Input (Walaupun sudah ada di FE, ini wajib di BE)
        if (!email || !password || !fullName) {
            return new NextResponse(JSON.stringify({ message: 'Data wajib tidak lengkap.' }), { status: 400 });
        }

        // 2. Cek apakah pengguna sudah ada
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return new NextResponse(JSON.stringify({ message: 'Email sudah terdaftar.' }), { status: 409 }); // 409 Conflict
        }

        // 3. Hash Password (Wajib sebelum disimpan!)
        // const hashedPassword = await hashPassword(password); // Gunakan helper yang sudah kamu buat

        // 4. Buat User Baru di Database
        const newUser = await prisma.user.create({
            data: {
                fullName,
                email,
                // password: hashedPassword, // Simpan password yang sudah di-hash
                password: password, // Simpan raw password HANYA untuk testing cepat
                phone,
                shopeeAccount,
                address,
            },
            select: { id: true, email: true, fullName: true }, // Jangan kirim password kembali
        });

        // 5. Response Sukses
        return new NextResponse(JSON.stringify({ 
            message: 'Pendaftaran sukses.',
            user: newUser 
        }), { 
            status: 201, // 201 Created
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error("Error creating new user:", error);
        return new NextResponse(JSON.stringify({ message: 'Gagal memproses pendaftaran.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}