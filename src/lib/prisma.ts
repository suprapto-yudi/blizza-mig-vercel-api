// src/lib/prisma.ts (Revisi Akhir Final)

import { PrismaClient } from '@prisma/client'; 

// 1. Definisikan tipe global
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// 2. Buat instance dengan konfigurasi datasources
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    // Solusi Vercel: Memaksa Prisma menggunakan ENV di build time
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
    log: ['warn', 'error'],
});

// 3. Simpan di globalForPrisma HANYA di environment development
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}