// src/app/api/signup/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        // Ambil data yang dibutuhkan dari body
        const { fullName, email, password, phone, shopeeAccount, address } = body; 

        // 1. Validasi Input (Walaupun sudah ada di FE, ini wajib di BE)
        if (!email || !password || !fullName) {
            return new NextResponse(JSON.stringify({ message: 'Data wajib tidak lengkap.' }), { status: 400 });
        }

        // 2. Buat User Baru di Database (Jika duplikat, akan masuk ke catch P2002)
        const newUser = await prisma.user.create({
            data: {
                fullName,
                email,
                password: password,
                phone,
                shopeeAccount,
                address,
            },
            select: { id: true, email: true, fullName: true },
        });

        // 3. Response Sukses
        return new NextResponse(JSON.stringify({ 
            message: 'Pendaftaran sukses.',
            user: newUser 
        }), { 
            status: 201, // 201 Created
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        // --- FINAL ERROR HANDLING: Menangani P2002 dan P2003 (Tanpa Typing Error) ---
        // Type Guard Generik untuk Error Database (memiliki properti 'code' dan 'meta')

        if (error && typeof error === 'object' && 'code' in error && 'message' in error) {
            // 4. Cek Error P2002 (Unique Constraint Failed)
            if (error.code === 'P2002') { 
                // Mengambil target field yang duplikat
                const target = (error as { meta?: { target?: string } }).meta?.target || 'field';
                console.error("Signup failed: Duplicate key error (P2002) on:", target);
                return new NextResponse(JSON.stringify({ 
                    message: `Gagal mendaftar: ${target} ini sudah terdaftar. Mohon ganti data.`
                }), { 
                    status: 409 // 409 Conflict
                });
            }

            // 5. Cek Error P2003 (Foreign Key/Not Null Failed)
             if (error.code === 'P2003') {
                console.error("Signup failed: NOT NULL/Foreign Key constraint failed.", error);
                return new NextResponse(JSON.stringify({ message: 'Gagal mendaftar: Kolom wajib di database kosong.' }), {
                    status: 500, 
                });
            }
        }
        
        // 6. Default Server Error (Status 500)
        if (error instanceof Error) {
            console.error("Unknown error creating new user:", error.message);
        } else {
            console.error("Unknown error creating new user:", error);
        }

        return new NextResponse(JSON.stringify({ message: 'Gagal memproses pendaftaran.' }), {
            status: 500, // Error 500 generik
            headers: { 'Content-Type': 'application/json' },
        });
    }
}