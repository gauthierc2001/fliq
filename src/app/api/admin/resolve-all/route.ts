import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentPrice, getCoinGeckoId } from '@/lib/prices'

// Force dynamic rendering - this route uses database
export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    // Find ALL markets that need resolution (including very old ones)
    const marketsToResolve = await prisma.market.findMany({
      where: {
        resolved: false
      }
    })
    
    let resolvedCount = 0
    let results = []
    
    console.log(`🔍 Found ${marketsToResolve.length} unresolved markets`)
    
    for (const market of marketsToResolve) {
      try {
        // Check if market has expired
        const isExpired = market.endTime <= new Date()
        if (!isExpired) {
          results.push({
            market: market.symbol,
            status: 'skipped',
            reason: 'Not expired yet',
            endTime: market.endTime
          })
          continue
        }
        
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
        
        let userUpdates = 0
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
          
          userUpdates++
        }
        
        results.push({
          market: market.symbol,
          status: 'resolved',
          outcome,
          startPrice: market.startPrice,
          endPrice: currentPrice,
          swipesProcessed: userUpdates,
          endTime: market.endTime
        })
        
        resolvedCount++
        console.log(`✅ Resolved ${market.symbol}: ${outcome} (${userUpdates} swipes processed)`)
      } catch (error) {
        console.error(`❌ Error resolving market ${market.id}:`, error)
        results.push({
          market: market.symbol,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }
    
    return NextResponse.json({
      message: `Admin resolved ${resolvedCount} out of ${marketsToResolve.length} markets`,
      resolvedCount,
      totalMarkets: marketsToResolve.length,
      results
    })
  } catch (error) {
    console.error('Error in admin resolve:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Allow GET requests for manual testing
export async function GET() {
  return POST()
}
