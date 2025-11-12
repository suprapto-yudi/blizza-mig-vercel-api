// src/app/api/signup/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Sesuaikan path ini jika perlu
import { Prisma } from '@prisma/client';

// Jika import di atas gagal, coba ganti menjadi:
// import { PrismaClientKnownRequestError } from '@prisma/client';
// Lalu gunakan 'error instanceof PrismaClientKnownRequestError'

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
        // Cek jika error adalah error unik Prisma (P2002)
        if (error && typeof error === 'object' && 'code' in error) {
            if (error.code === 'P2002') {
                // AMBIL DETAIL FIELD YANG DUPLIKAT DARI error.meta
                const target = (error as any).meta?.target || 'field'; // Ambil field yang bermasalah
                
                // Error duplikat (misal: email sudah ada)
                console.error("Signup failed: Duplicate key error (P2002) on:", target);
                return new NextResponse(JSON.stringify({ 
                    message: `Gagal mendaftar: ${target} ini sudah terdaftar. Mohon ganti data.`
                }), { 
                    status: 409 // 409 Conflict
                });
            }
        }
        // Type Guard untuk Unknown Error (sesuai standar TypeScript)
        if (error instanceof Error) {
            console.error("Error creating new user:", error.message);
        } else {
            console.error("Unknown error creating new user:", error);
        }
        
        return new NextResponse(JSON.stringify({ message: 'Gagal memproses pendaftaran.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}