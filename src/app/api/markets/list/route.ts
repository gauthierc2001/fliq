import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateOdds } from '@/lib/betting'
import { getCurrentPrice, getCoinGeckoId, startBackgroundRetries } from '@/lib/prices'

// Start background retries for failed price fetches
let backgroundRetryStarted = false
if (!backgroundRetryStarted) {
  startBackgroundRetries()
  backgroundRetryStarted = true
  console.log('🔄 Started background CoinGecko retry mechanism')
}

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
    
    // Process markets in parallel for better performance
    const resolutionPromises = marketsToResolve.map(async (market) => {
      try {
        // Get current price with timeout
        const coinId = getCoinGeckoId(market.symbol)
        const currentPrice = await Promise.race([
          getCurrentPrice(coinId),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Price fetch timeout')), 2000)
          )
        ]) as number
        
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
        
        console.log(`✅ Resolved market ${market.symbol} with outcome ${outcome}`)
        return { success: true, marketId: market.id }
      } catch (error) {
        console.error(`❌ Error resolving market ${market.id}:`, error)
        return { success: false, marketId: market.id, error }
      }
    })
    
    // Wait for all resolutions to complete
    const results = await Promise.allSettled(resolutionPromises)
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length
    
    if (marketsToResolve.length > 0) {
      console.log(`📊 Auto-resolved ${successful}/${marketsToResolve.length} expired markets`)
    }
  } catch (error) {
    console.error('❌ Error in auto-resolution:', error)
  }
}

// Simple in-memory cache for market list
let cachedMarkets: { data: any; timestamp: number } | null = null
const CACHE_TTL = 10000 // 10 seconds (reduced for more real-time updates)

export async function GET() {
  try {
    // First, trigger resolution of any expired markets
    await resolveExpiredMarkets()
    
    // Check cache first
    if (cachedMarkets && Date.now() - cachedMarkets.timestamp < CACHE_TTL) {
      console.log('[Markets API] Serving from cache')
      return NextResponse.json(cachedMarkets.data)
    }
    
    // Get active markets with timeout and connection resilience
    // Add 5-second buffer so users have time to bet (reduced from 15s)
    const minEndTime = new Date(Date.now() + 5000) // 5 seconds from now
    
    const markets = await Promise.race([
      prisma.market.findMany({
        where: {
          resolved: false,
          endTime: {
            gt: minEndTime
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
        },
        take: 50 // Limit results for performance
      }),
      // 3 second timeout for database query
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database query timeout')), 3000)
      )
    ]) as any[]
    
    const marketsWithOdds = markets.map(market => {
      const odds = calculateOdds(market.yesBets, market.noBets)
      return {
        ...market,
        ...odds,
        timeLeft: Math.max(0, market.endTime.getTime() - Date.now())
      }
    })
    
    // Trigger market rotation if we have too few markets OR low diversity
    const MIN_MARKETS_THRESHOLD = 12 // Increased from 8 for better diversity
    const uniqueCoinsInMarkets = new Set(marketsWithOdds.map(m => m.symbol)).size
    const MIN_UNIQUE_COINS_THRESHOLD = 8 // Need at least 8 different coins
    
    if (marketsWithOdds.length < MIN_MARKETS_THRESHOLD || uniqueCoinsInMarkets < MIN_UNIQUE_COINS_THRESHOLD) {
      console.log(`⚠️ Triggering rotation: ${marketsWithOdds.length} markets (need ${MIN_MARKETS_THRESHOLD}), ${uniqueCoinsInMarkets} unique coins (need ${MIN_UNIQUE_COINS_THRESHOLD})`)
      console.log(`Current coins: ${Array.from(new Set(marketsWithOdds.map(m => m.symbol))).join(', ')}`)
      
      // Clear cache to force fresh data after rotation
      cachedMarkets = null
      
      // Trigger market rotation in background (don't wait for it)
      fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/cron/market-rotation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }).catch(err => {
        console.error('❌ Failed to trigger market rotation:', err)
      })
    }
    
    const response = { markets: marketsWithOdds }
    
    // Cache the response
    cachedMarkets = {
      data: response,
      timestamp: Date.now()
    }
    
    console.log(`[Markets API] Served ${markets.length} markets, cached for ${CACHE_TTL/1000}s`)
    return NextResponse.json(response)
  } catch (error) {
    console.error('[API] Error fetching markets:', error)
    console.error('[API] Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    console.error('[API] DATABASE_URL exists:', !!process.env.DATABASE_URL)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const isDatabaseError = errorMessage.includes('DATABASE_URL') || errorMessage.includes('prisma') || errorMessage.includes('connect') || errorMessage.includes('timeout')
    
    // For database/timeout errors, return cached data if available, otherwise empty array
    if (isDatabaseError) {
      console.warn('[API] Database issue, checking for cached data...')
      
      if (cachedMarkets) {
        console.log('[API] Serving stale cached data due to database error')
        return NextResponse.json({
          ...cachedMarkets.data,
          warning: 'Using cached data due to database connectivity issues'
        })
      }
      
      // Last resort: return empty markets to prevent app crash
      console.warn('[API] No cached data available, returning empty markets')
      return NextResponse.json({ 
        markets: [],
        error: 'Database temporarily unavailable',
        message: 'Please try again in a few moments'
      })
    }
    
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'production' ? {
        type: isDatabaseError ? 'database' : 'unknown',
        message: errorMessage
      } : undefined
    }, { status: 500 })
  }
}
