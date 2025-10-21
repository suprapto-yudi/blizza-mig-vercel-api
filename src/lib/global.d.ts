// src/lib/global.d.ts
import { PrismaClient } from '@prisma/client';

declare global {
  // Ini memberitahu TypeScript bahwa globalThis dapat memiliki properti 'prisma'
  // yang merupakan PrismaClient atau undefined
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined; 
}