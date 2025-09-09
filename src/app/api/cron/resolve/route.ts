import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCoinDetails, getCoinGeckoId } from '@/lib/prices'

// Force dynamic rendering - this route uses database
export const dynamic = 'force-dynamic'

export async function POST() {
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
    
    let resolvedCount = 0
    
    for (const market of marketsToResolve) {
      try {
        // Get current price (with error handling)
        const coinId = getCoinGeckoId(market.symbol)
        const { price: currentPrice } = await getCoinDetails(coinId)
        
        if (currentPrice === 0) {
          console.warn(`Failed to get price for ${market.symbol}, skipping resolution`)
          continue
        }
        
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
          },
          include: { user: true }
        })
        
        // Process each swipe
        for (const swipe of swipes) {
          let win: boolean
          let pnl: number
          
          if (outcome === 'PUSH') {
            // Refund
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
        
        resolvedCount++
      } catch (error) {
        console.error(`Error resolving market ${market.id}:`, error)
        // Continue with other markets
      }
    }
    
    return NextResponse.json({
      message: `Resolved ${resolvedCount} markets`,
      resolvedCount
    })
  } catch (error) {
    console.error('Error in cron resolve:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Allow GET requests for manual testing
export async function GET() {
  return POST()
}