// src/app/api/change-password/route.ts
import { NextResponse } from 'next/server';
// Pastikan kamu sudah meng-copy file ini ke src/lib/
import { prisma } from '@/lib/prisma'; 
import bcrypt from 'bcryptjs';
import { verifyToken, decodeToken } from '@/lib/auth-helpers'; // Asumsi JWT helper

export async function PUT(request: Request) {
    // 1. Ambil Token dari Header (Authorization)
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    // 2. Middleware: Verifikasi Token
    if (!token || !verifyToken(token)) {
        return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    
    // Mendapatkan user ID dari token
    
    
    // 3. Ambil data dari Frontend
    // Koreksi yang lebih aman (pastikan userId benar-benar ada)
    const decodedPayload = decodeToken(token);
    const userId = decodedPayload?.userId; // Tipe: number | undefined

    if (userId === undefined || userId === null) { 
        return new NextResponse(JSON.stringify({ message: 'Invalid token payload: User ID missing.' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
     }

    // Ganti parseInt(userId as any, 10) dengan pengecekan
    // PENTING: Jika ID di DB kamu number, pastikan userId dari token adalah number/string yang valid.
    const userIdNumber = Number(userId); // Atau pakai parseInt(userId, 10) jika ID selalu string
    // Pastikan semua panggilan prisma.user.findUnique menggunakan userIdNumber.

    const { currentPassword, newPassword } = await request.json();


    // 4. Validasi Input Dasar
    if (!currentPassword || !newPassword) {
        return new NextResponse(JSON.stringify({ message: 'Password saat ini dan Password baru wajib diisi.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    if (newPassword.length < 6) {
        return new NextResponse(JSON.stringify({ message: 'Password baru minimal harus 6 karakter.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        // 5. Ambil user (termasuk password hash-nya)
        const user = await prisma.user.findUnique({
            where: { id: userId }, // <<< GUNAKAN userIdInt
            select: { password: true }
        });

        if (!user) {
            return new NextResponse(JSON.stringify({ message: 'Pengguna tidak ditemukan.' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // 6. Verifikasi Current Password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return new NextResponse(JSON.stringify({ message: 'Password saat ini salah.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // 7. Hash New Password
        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(newPassword, salt);

        // 8. Update Password di Database
        await prisma.user.update({
            where: { id: userId }, // <<< GUNAKAN userIdInt
            data: { password: newHashedPassword }
        });

        // 9. Respon Sukses
        return new NextResponse(JSON.stringify({ 
            success: true, 
            message: 'Password berhasil diperbarui! Anda harus login kembali.' 
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error("Error Change Password:", error);
        return new NextResponse(JSON.stringify({ message: 'Server error saat mengganti password.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

// Catatan: Jika kamu menggunakan POST untuk change-password, ganti 'export async function PUT' menjadi 'export async function POST'. 
// Berdasarkan kode frontend kita, kita menggunakan PUT, jadi biarkan PUT.