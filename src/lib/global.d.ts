// src/lib/global.d.ts

import { PrismaClient } from '@prisma/client';

declare global {
  // Ini memberitahu TypeScript bahwa globalThis dapat memiliki properti 'prisma'
  // yang merupakan PrismaClient atau undefined.
  var prisma: PrismaClient | undefined; 
}

// Catatan: File ini tidak perlu diekspor. TypeScript akan membacanya secara global.