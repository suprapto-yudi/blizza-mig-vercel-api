// src/app/api/todos/[id]/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken'; 

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
    request: Request, 
    { params }: { params: { id: string } } // Menerima parameter { id }
) {
    const verifiedUserId = authenticateRequest(request);
    
    if (!verifiedUserId) {
        return new NextResponse(JSON.stringify({ message: 'Unauthorized.' }), { status: 401 });
    }

    try {
        const todoId = parseInt(params.id); // Konversi string ID dari URL ke integer
        const body = await request.json();
        const { isCompleted } = body; // Kita hanya butuh isCompleted dari body

        // 3. Update data di Prisma:
        const updatedTodo = await prisma.todo.update({
            where: { 
                id: todoId, 
                userId: verifiedUserId // WAJIB: Hanya user pemilik yang bisa update
            }, 
            data: { 
                isCompleted: isCompleted, // Perubahan status
                // Kamu bisa menambahkan updatedAt: new Date(), jika ada di skema
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
    request: Request, 
    { params }: { params: { id: string } }
) {
    const verifiedUserId = authenticateRequest(request);

    if (!verifiedUserId) {
        return new NextResponse(JSON.stringify({ message: 'Unauthorized.' }), { status: 401 });
    }

    try {
        const todoId = parseInt(params.id);

        // Hapus data di Prisma:
        await prisma.todo.delete({
            where: { 
                id: todoId, 
                userId: verifiedUserId // WAJIB: Hanya user pemilik yang bisa hapus
            }, 
        });

        // Response Sukses (204 No Content)
        return new NextResponse(JSON.stringify({ 
            message: 'To-Do berhasil dihapus.'
        }), { status: 204 }); 

    } catch (error) {
        console.error("Error deleting ToDo:", error);
        return new NextResponse(JSON.stringify({ message: 'Server error saat menghapus To-Do.' }), { status: 500 });
    }
}