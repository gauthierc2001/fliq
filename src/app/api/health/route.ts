import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    checks: {
      env_vars: {
        DATABASE_URL: !!process.env.DATABASE_URL,
        JWT_SECRET: !!process.env.JWT_SECRET,
        JWT_SECRET_LENGTH: process.env.JWT_SECRET?.length || 0,
        NEXT_PUBLIC_SOLANA_NETWORK: process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'not set',
        COINGECKO_API_KEY: !!process.env.COINGECKO_API_KEY
      },
      database: {
        connected: false,
        error: null as string | null
      },
      prisma: {
        initialized: false,
        error: null as string | null
      }
    }
  }

  // Test database connection
  try {
    const startTime = Date.now()
    await prisma.$queryRaw`SELECT 1`
    const duration = Date.now() - startTime
    
    checks.checks.database.connected = true
    checks.checks.prisma.initialized = true
    
    // Add response time
    Object.assign(checks.checks.database, { response_time_ms: duration })
    
    // Test if tables exist
    try {
      const userCount = await prisma.user.count()
      const marketCount = await prisma.market.count()
      Object.assign(checks.checks.database, {
        tables_exist: true,
        user_count: userCount,
        market_count: marketCount
      })
    } catch (tableError) {
      Object.assign(checks.checks.database, {
        tables_exist: false,
        table_error: tableError instanceof Error ? tableError.message : 'Unknown error'
      })
    }
  } catch (error) {
    checks.checks.database.connected = false
    checks.checks.database.error = error instanceof Error ? error.message : 'Unknown error'
    checks.checks.prisma.error = error instanceof Error ? error.stack || error.message : 'Unknown error'
  }

  // Determine overall health
  const isHealthy = checks.checks.database.connected && 
                   checks.checks.env_vars.DATABASE_URL && 
                   checks.checks.env_vars.JWT_SECRET &&
                   checks.checks.env_vars.JWT_SECRET_LENGTH >= 32

  return NextResponse.json({
    status: isHealthy ? 'healthy' : 'unhealthy',
    ...checks
  }, {
    status: isHealthy ? 200 : 503
  })
}
