// src/app/api/todos/[id]/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken'; 

// Deklarasikan interface yang diharapkan Next.js secara internal
interface RouteContext {
    params: {
        id: string;
    }
}

const SECRET = process.env.JWT_SECRET;
if (!SECRET) throw new Error('JWT_SECRET is not defined');

// Helper untuk otentikasi
const getUserIdFromToken = (token: string) => {
    try {
        const decoded = jwt.verify(token, SECRET) as { userId: number };
        return decoded.userId;
    } catch (e) {
        return null;
    }
};

// Middleware untuk mendapatkan User ID
const authenticateRequest = (request: Request) => {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    return token ? getUserIdFromToken(token) : null;
};


// ===============================================
// 1. HANDLER PUT (UPDATE STATUS isCompleted)
// ===============================================
export async function PUT(
    request: NextRequest, 
    // PERBAIKAN FINAL: Gunakan interface RouteContext yang didefinisikan di atas
    context: RouteContext // Menggunakan nama argumen 'context' secara konvensional
) {
    const verifiedUserId = authenticateRequest(request);
    
    if (!verifiedUserId) {
        return new NextResponse(JSON.stringify({ message: 'Unauthorized.' }), { status: 401 });
    }

    try {
        const todoId = parseInt(context.params.id); // Menggunakan context.params.id
        const body = await request.json();
        const { isCompleted } = body; 

        // 3. Update data di Prisma:
        const updatedTodo = await prisma.todo.update({
            where: { 
                id: todoId, 
                userId: verifiedUserId
            }, 
            data: { 
                isCompleted: isCompleted,
            },
        });

        // 4. Response Sukses
        return new NextResponse(JSON.stringify({ 
            message: 'To-Do berhasil diperbarui.',
            todo: updatedTodo 
        }), { status: 200 });

    } catch (error) {
        console.error("Error updating ToDo:", error);
        return new NextResponse(JSON.stringify({ message: 'Server error saat memperbarui To-Do.' }), { status: 500 });
    }
}


// ===============================================
// 2. HANDLER DELETE (HAPUS TO-DO)
// ===============================================
export async function DELETE(
    request: NextRequest, 
    context: RouteContext // Menggunakan interface RouteContext
) {
    const verifiedUserId = authenticateRequest(request);

    if (!verifiedUserId) {
        return new NextResponse(JSON.stringify({ message: 'Unauthorized.' }), { status: 401 });
    }

    try {
        const todoId = parseInt(context.params.id);

        // Hapus data di Prisma:
        await prisma.todo.delete({
            where: { 
                id: todoId, 
                userId: verifiedUserId
            }, 
        });

        // Response Sukses (204 No Content)
        return new NextResponse(null, { status: 204 }); 

    } catch (error) {
        console.error("Error deleting ToDo:", error);
        return new NextResponse(JSON.stringify({ message: 'Server error saat menghapus To-Do.' }), { status: 500 });
    }
}