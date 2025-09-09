import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

function buildDatabaseUrl(): string {
  const base = process.env.DATABASE_URL
  if (!base) throw new Error('DATABASE_URL is not set')
  if (process.env.NODE_ENV !== 'production') return base
  const hasQuery = base.includes('?')
  const params = 'connection_limit=10&pool_timeout=10'
  return hasQuery ? `${base}&${params}` : `${base}?${params}`
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: { db: { url: buildDatabaseUrl() } },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

if (process.env.NODE_ENV === 'production') {
  process.on('SIGINT', async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
  process.on('SIGTERM', async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
}
