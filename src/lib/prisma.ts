import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

function buildDatabaseUrl(): string | undefined {
  const base = process.env.DATABASE_URL
  if (!base) {
    // Only throw in production or when actually trying to use the database
    if (process.env.NODE_ENV === 'production') {
      throw new Error('DATABASE_URL is not set in production')
    }
    // Return undefined for build time
    return undefined
  }
  if (process.env.NODE_ENV !== 'production') return base
  const hasQuery = base.includes('?')
  const params = 'connection_limit=10&pool_timeout=10'
  return hasQuery ? `${base}&${params}` : `${base}?${params}`
}

// Create a lazy initialization wrapper
let prismaInstance: PrismaClient | null = null

export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop, receiver) {
    if (!prismaInstance) {
      const url = buildDatabaseUrl()
      if (!url && process.env.NODE_ENV === 'production') {
        throw new Error('DATABASE_URL is not set - cannot initialize Prisma Client')
      }
      
      if (!globalForPrisma.prisma) {
        globalForPrisma.prisma = new PrismaClient({
          datasources: url ? { db: { url } } : undefined,
          log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
        })
      }
      prismaInstance = globalForPrisma.prisma
    }
    return Reflect.get(prismaInstance, prop, receiver)
  }
})

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
