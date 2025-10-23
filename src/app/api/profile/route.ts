// src/app/api/profile/route.ts
import { NextResponse } from 'next/server';
// Pastikan file ini ada di folder /src/lib/
import { prisma } from '@/lib/prisma'; 
// Asumsi kamu membuat middleware atau helper untuk verifikasi token
import { verifyToken, decodeToken } from '@/lib/auth-helpers'; 

export async function PUT(request: Request) {
    // 1. Ambil Token dari Header
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (!token || !verifyToken(token)) {
        return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // const { userId } = decodeToken(token); // Mendapatkan user ID dari token
    // KOREKSI 1: Ambil payload dulu (payload bisa null)
    const payload = decodeToken(token);

    // KOREKSI 2: Cek payload dan ekstrak userId
    if (!payload || !payload.userId) { 
        // Jika payload kosong atau userId tidak ada di dalamnya
        return new NextResponse(JSON.stringify({ message: 'Invalid token payload or missing User ID.' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // KOREKSI 3: Deklarasikan userId dari payload yang sudah divalidasi
    // Asumsi userId di payload kamu adalah number atau string yang bisa di-parseInt
    const userId = payload.userId;
    const { fullName, phone } = await request.json();

    try {
        // 2. Update User di Database
        const updatedUser = await prisma.user.update({
            where: { id: parseInt(String(userId), 10) }, // Gunakan String(userId) agar pasti string sebelum parseInt
            data: {
                fullName,
                phone,
            },
            // Pilih field yang akan dikembalikan (tanpa password)
            select: { id: true, email: true, fullName: true, phone: true /* ... */ }
        });

        // 3. Kirim Respon Sukses
        return new NextResponse(JSON.stringify({ 
            success: true, 
            message: 'Profil berhasil diperbarui!', 
            user: updatedUser 
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error("Error Update Profile:", error);
        return new NextResponse(JSON.stringify({ message: 'Server error saat memperbarui profil.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}