import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { getCurrentPrice, getCoinGeckoId } from '@/lib/prices'

// Force dynamic rendering - this route uses database and auth
export const dynamic = 'force-dynamic'

async function resolveUserMarkets(userId: string) {
  try {
    // Get user's unsettled swipes on expired markets
    const unsettledSwipes = await prisma.swipe.findMany({
      where: {
        userId,
        settled: false,
        market: {
          resolved: false,
          endTime: {
            lte: new Date()
          }
        }
      },
      include: {
        market: true
      }
    })

    for (const swipe of unsettledSwipes) {
      const market = swipe.market
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
        
        // Calculate P&L
        let win: boolean
        let pnl: number
        
        if (outcome === 'PUSH') {
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
          where: { id: userId },
          data: {
            balance: {
              increment: win ? Math.round(swipe.stake * swipe.payoutMult) : 0
            },
            totalPnL: {
              increment: pnl
            }
          }
        })
        
        console.log(`✅ Resolved user market ${market.symbol} with outcome ${outcome}, user ${win ? 'won' : 'lost'} ${Math.abs(pnl)} FLIQ`)
      } catch (error) {
        console.error(`❌ Error resolving market ${market.id} for user:`, error)
      }
    }
  } catch (error) {
    console.error('❌ Error in user market resolution:', error)
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Resolve any expired markets for this user first
    await resolveUserMarkets(user.id)
    
    // Get updated user data after potential balance changes
    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id }
    })
    
    const swipes = await prisma.swipe.findMany({
      where: { userId: user.id },
      include: {
        market: {
          select: {
            title: true,
            symbol: true,
            resolved: true,
            outcome: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    })
    
    return NextResponse.json({
      user: {
        id: updatedUser?.id || user.id,
        wallet: updatedUser?.wallet || user.wallet,
        balance: updatedUser?.balance || user.balance,
        totalPnL: updatedUser?.totalPnL || user.totalPnL,
        username: (updatedUser?.username || user.username) || `${user.wallet.slice(0, 4)}...${user.wallet.slice(-4)}`,
        avatar: updatedUser?.avatar || user.avatar
      },
      history: swipes
    })
  } catch (error) {
    console.error('Error fetching user history:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
