import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateOdds } from '@/lib/betting'

// Force dynamic rendering - this route uses database
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const markets = await prisma.market.findMany({
      where: {
        resolved: false,
        endTime: {
          gt: new Date()
        }
      },
      orderBy: {
        endTime: 'asc'
      }
    })
    
    const marketsWithOdds = markets.map(market => {
      const odds = calculateOdds(market.yesBets, market.noBets)
      return {
        ...market,
        ...odds,
        timeLeft: Math.max(0, market.endTime.getTime() - Date.now())
      }
    })
    
    return NextResponse.json({ markets: marketsWithOdds })
  } catch (error) {
    console.error('[API] Error fetching markets:', error)
    console.error('[API] Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    console.error('[API] DATABASE_URL exists:', !!process.env.DATABASE_URL)
    
    // Return more detailed error in production for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const isDatabaseError = errorMessage.includes('DATABASE_URL') || errorMessage.includes('prisma') || errorMessage.includes('connect')
    
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'production' ? {
        type: isDatabaseError ? 'database' : 'unknown',
        message: errorMessage
      } : undefined
    }, { status: 500 })
  }
}
