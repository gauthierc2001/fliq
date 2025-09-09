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
    console.error('Error fetching markets:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
