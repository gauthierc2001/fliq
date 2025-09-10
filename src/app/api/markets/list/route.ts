import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateOdds } from '@/lib/betting'
import { getCurrentPrice, getCoinGeckoId } from '@/lib/prices'

// Force dynamic rendering - this route uses database
export const dynamic = 'force-dynamic'

async function resolveExpiredMarkets() {
  try {
    // Find markets that need resolution
    const marketsToResolve = await prisma.market.findMany({
      where: {
        resolved: false,
        endTime: {
          lte: new Date()
        }
      }
    })
    
    for (const market of marketsToResolve) {
      try {
        // Get current price
        const coinId = getCoinGeckoId(market.symbol)
        const currentPrice = await getCurrentPrice(coinId)
        
        // Determine outcome
        let outcome: 'YES' | 'NO' | 'PUSH'
        if (currentPrice > market.startPrice) {
          outcome = 'YES'
        } else if (currentPrice < market.startPrice) {
          outcome = 'NO'
        } else {
          outcome = 'PUSH'
        }
        
        // Update market
        await prisma.market.update({
          where: { id: market.id },
          data: {
            endPrice: currentPrice,
            resolved: true,
            outcome
          }
        })
        
        // Get all swipes for this market
        const swipes = await prisma.swipe.findMany({
          where: {
            marketId: market.id,
            settled: false
          }
        })
        
        // Process each swipe
        for (const swipe of swipes) {
          let win: boolean
          let pnl: number
          
          if (outcome === 'PUSH') {
            // Refund original stake
            win = true
            pnl = 0
          } else {
            win = swipe.side === outcome
            pnl = win ? Math.round(swipe.stake * swipe.payoutMult) - swipe.stake : -swipe.stake
          }
          
          // Update swipe
          await prisma.swipe.update({
            where: { id: swipe.id },
            data: {
              settled: true,
              win,
              pnl
            }
          })
          
          // Update user balance and totalPnL
          await prisma.user.update({
            where: { id: swipe.userId },
            data: {
              balance: {
                increment: win ? Math.round(swipe.stake * swipe.payoutMult) : 0
              },
              totalPnL: {
                increment: pnl
              }
            }
          })
        }
        
        console.log(`✅ Resolved market ${market.symbol} with outcome ${outcome} (${marketsToResolve.length} markets)`)
      } catch (error) {
        console.error(`❌ Error resolving market ${market.id}:`, error)
      }
    }
    
    if (marketsToResolve.length > 0) {
      console.log(`📊 Auto-resolved ${marketsToResolve.length} expired markets`)
    }
  } catch (error) {
    console.error('❌ Error in auto-resolution:', error)
  }
}

export async function GET() {
  try {
    // First, resolve any expired markets
    await resolveExpiredMarkets()
    
    // Then get active markets
    const markets = await prisma.market.findMany({
      where: {
        resolved: false,
        endTime: {
          gt: new Date()
        }
      },
      orderBy: {
        endTime: 'asc'
      },
      select: {
        id: true,
        symbol: true,
        title: true,
        durationMin: true,
        startTime: true,
        endTime: true,
        startPrice: true,
        yesBets: true,
        noBets: true,
        logoUrl: true // Explicitly select logoUrl
      }
    })
    
    const marketsWithOdds = markets.map(market => {
      const odds = calculateOdds(market.yesBets, market.noBets)
      // Debug logging
      console.log(`Market ${market.symbol} logoUrl:`, market.logoUrl)
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
