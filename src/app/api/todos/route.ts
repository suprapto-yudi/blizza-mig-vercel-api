// src/app/api/todos/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken'; 

const SECRET = process.env.JWT_SECRET;
if (!SECRET) throw new Error('JWT_SECRET is not defined');

// Tambahkan helper untuk memverifikasi token dan mendapatkan userId
const getUserIdFromToken = (token: string) => {
    try {
        const decoded = jwt.verify(token, SECRET) as { userId: number };
        return decoded.userId;
    } catch (e) {
        return null;
    }
};

export async function POST(request: Request) {
    try {
        // 1. Dapatkan Token dari Header
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
        
        const userId = token ? getUserIdFromToken(token) : null;

        if (!userId) {
            return new NextResponse(JSON.stringify({ message: 'Unauthorized: Token invalid atau hilang.' }), { status: 401 });
        }

        const body = await request.json();
        const { title, description } = body; 

        // 2. Validasi Input
        if (!title) {
            return new NextResponse(JSON.stringify({ message: 'Judul To-Do wajib diisi.' }), { status: 400 });
        }

        // 3. Buat To-Do Baru
        const newTodo = await prisma.todo.create({
            data: {
                title,
                description,
                userId: userId, // Gunakan userId yang didapat dari token
            },
        });

        // 4. Response Sukses
        return new NextResponse(JSON.stringify({ 
            message: 'To-Do berhasil ditambahkan.',
            todo: newTodo 
        }), { 
            status: 201, // 201 Created
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error("Error creating new ToDo:", error);
        return new NextResponse(JSON.stringify({ message: 'Server error saat membuat To-Do.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}