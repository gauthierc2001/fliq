import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCoinDetails } from '@/lib/prices'
import { getCryptoLogo, getCryptoTicker } from '@/lib/cryptoAssets'

// Force dynamic rendering - this route uses database
export const dynamic = 'force-dynamic'

// Market configuration
const DURATIONS = [1, 3, 5] // minutes - quick resolution times
const TARGET_MARKETS_PER_COIN = 2 // Target 2 markets per coin per duration
const MIN_TOTAL_MARKETS = 15 // Minimum total markets to maintain
const MAJOR_COINS = [
  { symbol: 'bitcoin', ticker: 'BTC', coinGeckoId: 'bitcoin' },
  { symbol: 'ethereum', ticker: 'ETH', coinGeckoId: 'ethereum' },
  { symbol: 'solana', ticker: 'SOL', coinGeckoId: 'solana' },
  { symbol: 'dogwifcoin', ticker: 'WIF', coinGeckoId: 'dogwifcoin' },
  { symbol: 'bonk', ticker: 'BONK', coinGeckoId: 'bonk' },
  { symbol: 'pepe', ticker: 'PEPE', coinGeckoId: 'pepe' }
]

export async function POST() {
  try {
    console.log('🔄 Starting market rotation...')
    
    // First, resolve any expired markets by calling the proper resolution endpoint
    await triggerMarketResolution()
    
    // Check current market count
    const currentMarkets = await prisma.market.findMany({
      where: {
        resolved: false,
        endTime: {
          gt: new Date(Date.now() + 10000) // At least 10 seconds remaining
        }
      },
      select: {
        id: true,
        symbol: true,
        durationMin: true,
        endTime: true
      }
    })
    
    console.log(`📊 Current active markets: ${currentMarkets.length}`)
    
    let createdCount = 0
    const now = new Date()
    
    // Create markets for each coin and duration combination
    for (const coin of MAJOR_COINS) {
      for (const duration of DURATIONS) {
        try {
          // Count existing markets for this coin/duration
          const existingCount = currentMarkets.filter(m => 
            m.symbol === coin.symbol && 
            m.durationMin === duration
          ).length
          
          // Create new markets if needed
          const marketsToCreate = TARGET_MARKETS_PER_COIN - existingCount
          
          if (marketsToCreate > 0) {
            // Get current price and logo
            const coinDetails = await getCoinDetails(coin.coinGeckoId)
            const logoUrl = getCryptoLogo(coin.symbol)
            const ticker = getCryptoTicker(coin.symbol)
            
            for (let i = 0; i < marketsToCreate; i++) {
              // Stagger start times slightly to create variety
              const startTime = new Date(now.getTime() + (i * 5000)) // 5 second intervals
              const endTime = new Date(startTime.getTime() + duration * 60 * 1000)
              
              await prisma.market.create({
                data: {
                  symbol: coin.symbol,
                  title: `Will ${ticker} go ↑ in ${duration}m?`,
                  durationMin: duration,
                  startTime,
                  endTime,
                  startPrice: coinDetails.price,
                  logoUrl: logoUrl
                }
              })
              createdCount++
              console.log(`✅ Created ${ticker} ${duration}m market`)
            }
          }
        } catch (error) {
          console.error(`❌ Failed to create markets for ${coin.ticker}:`, error)
          // Continue with other coins - don't fail completely
        }
      }
    }
    
    // Final check - if we still don't have enough markets, create emergency markets
    const finalCount = await prisma.market.count({
      where: {
        resolved: false,
        endTime: {
          gt: new Date(Date.now() + 10000)
        }
      }
    })
    
    if (finalCount < MIN_TOTAL_MARKETS) {
      console.log(`⚠️ Only ${finalCount} markets available, creating emergency markets...`)
      await createEmergencyMarkets(MIN_TOTAL_MARKETS - finalCount)
    }
    
    console.log(`✨ Market rotation complete: Created ${createdCount} new markets`)
    
    return NextResponse.json({
      message: `Market rotation complete`,
      createdCount,
      totalActiveMarkets: finalCount + createdCount,
      timestamp: now.toISOString()
    })
  } catch (error) {
    console.error('❌ Error in market rotation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function triggerMarketResolution() {
  try {
    console.log('🔍 Triggering market resolution...')
    
    // Call the proper resolution endpoint internally
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/cron/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    
    if (response.ok) {
      const result = await response.json()
      console.log(`✅ Market resolution completed: ${result.resolvedCount} markets resolved`)
    } else {
      console.error('❌ Market resolution failed:', await response.text())
    }
  } catch (error) {
    console.error('❌ Error triggering market resolution:', error)
  }
}

async function createEmergencyMarkets(count: number) {
  try {
    // Create emergency markets using the most liquid coins
    const emergencyCoins = MAJOR_COINS.slice(0, 3) // BTC, ETH, SOL
    const emergencyDurations = [1, 3] // Shorter durations for quick resolution
    
    let created = 0
    const now = new Date()
    
    while (created < count) {
      for (const coin of emergencyCoins) {
        for (const duration of emergencyDurations) {
          if (created >= count) break
          
          try {
            const coinDetails = await getCoinDetails(coin.coinGeckoId)
            const logoUrl = getCryptoLogo(coin.symbol)
            const ticker = getCryptoTicker(coin.symbol)
            
            const startTime = new Date(now.getTime() + (created * 3000)) // 3 second intervals
            const endTime = new Date(startTime.getTime() + duration * 60 * 1000)
            
            await prisma.market.create({
              data: {
                symbol: coin.symbol,
                title: `Will ${ticker} go ↑ in ${duration}m?`,
                durationMin: duration,
                startTime,
                endTime,
                startPrice: coinDetails.price,
                logoUrl: logoUrl
              }
            })
            created++
            console.log(`🚨 Emergency market created: ${ticker} ${duration}m`)
          } catch (error) {
            console.error(`❌ Failed to create emergency market for ${coin.ticker}:`, error)
          }
        }
        if (created >= count) break
      }
      if (created >= count) break
    }
  } catch (error) {
    console.error('❌ Error creating emergency markets:', error)
  }
}
