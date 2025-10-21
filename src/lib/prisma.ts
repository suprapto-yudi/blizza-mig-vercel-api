// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// Ini mencegah inisialisasi PrismaClient berkali-kali di development (Hot Reload)
const prismaClientSingleton = () => {
  return new PrismaClient();
};

const prisma = globalThis.prisma || prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

export { prisma }; // Export bernama