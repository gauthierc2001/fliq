import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

function buildDatabaseUrl(): string | undefined {
  const base = process.env.DATABASE_URL
  
  // Log environment info for debugging
  if (process.env.NODE_ENV === 'production') {
    console.log('[Prisma] Production mode detected')
    console.log('[Prisma] DATABASE_URL exists:', !!base)
    console.log('[Prisma] DATABASE_URL length:', base?.length || 0)
  }
  
  if (!base) {
    // Only throw in production or when actually trying to use the database
    if (process.env.NODE_ENV === 'production') {
      console.error('[Prisma] DATABASE_URL is not set in production environment')
      console.error('[Prisma] Available env vars:', Object.keys(process.env).filter(k => k.includes('DATABASE') || k.includes('PG')))
      throw new Error('DATABASE_URL is not set in production')
    }
    // Return undefined for build time
    return undefined
  }
  
  if (process.env.NODE_ENV !== 'production') return base
  
  const hasQuery = base.includes('?')
  const params = 'connection_limit=5&pool_timeout=5&connect_timeout=10&socket_timeout=3'
  const finalUrl = hasQuery ? `${base}&${params}` : `${base}?${params}`
  
  console.log('[Prisma] Database URL configured with connection pooling')
  return finalUrl
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
