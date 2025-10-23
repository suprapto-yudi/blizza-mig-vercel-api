// src/lib/prisma.ts

import { PrismaClient } from '@prisma/client';

// 1. Tipe Global (untuk mencegah inisialisasi ganda di development/hot reload)
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// 2. Buat instance PrismaClient baru HANYA jika belum ada
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  // Tambahkan log level untuk debugging jika perlu
  log: ['warn', 'error'], 
});

// 3. Simpan di globalForPrisma HANYA di environment development
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Catatan: Di API Routes kamu, kamu harus mengimpornya dengan: 
// import { prisma } from '@/lib/prisma';