import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCoinDetails } from '@/lib/prices'
import { getCryptoLogo, getCryptoTicker } from '@/lib/cryptoAssets'
import { MAJOR_COINS } from '@/lib/marketGenerator'

// Force dynamic rendering - this route uses database
export const dynamic = 'force-dynamic'

// Market configuration
const DURATIONS = [1, 3, 5] // minutes - quick resolution times
const TARGET_MARKETS_PER_COIN = 1 // Reduced to create more diversity (was 2)
const MIN_TOTAL_MARKETS = 20 // Increased minimum for better variety

// Shuffle function to randomize coin selection
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Get a random subset of coins for diversity
function getRandomCoins(count: number) {
  return shuffleArray(MAJOR_COINS).slice(0, count)
}

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
    
    // Check current coin diversity - how many unique coins are in active markets
    const uniqueCoins = new Set(currentMarkets.map(m => m.symbol))
    const coinsInMarkets = Array.from(uniqueCoins)
    console.log(`📊 Current active coins: ${coinsInMarkets.length} unique coins:`, coinsInMarkets.join(', '))
    
    // If we have low diversity (same coins appearing too much), force diversity
    const MIN_UNIQUE_COINS = 12 // Minimum different coins we want to see
    const shouldForceDiversity = uniqueCoins.size < MIN_UNIQUE_COINS || currentMarkets.length < MIN_TOTAL_MARKETS
    
    if (shouldForceDiversity) {
      console.log(`🎲 Forcing diversity: Only ${uniqueCoins.size} unique coins, need at least ${MIN_UNIQUE_COINS}`)
      
      // Get coins that are NOT currently in markets for maximum diversity
      const coinsNotInMarkets = MAJOR_COINS.filter(coin => !uniqueCoins.has(coin.symbol))
      const diversityCoins = coinsNotInMarkets.length > 0 
        ? shuffleArray(coinsNotInMarkets).slice(0, 10) // Priority to unused coins
        : getRandomCoins(15) // Fallback to random selection
      
      console.log(`🎯 Priority coins for diversity:`, diversityCoins.map(c => c.ticker).join(', '))
      
      // Create markets for diversity coins (force creation)
      for (const coin of diversityCoins) {
        for (const duration of DURATIONS) {
          try {
            // Force create at least one market per coin/duration for diversity
            const existingCount = currentMarkets.filter(m => 
              m.symbol === coin.symbol && 
              m.durationMin === duration
            ).length
            
            if (existingCount === 0) { // Only create if this coin/duration combo doesn't exist
              // Get current price and logo
              const coinDetails = await getCoinDetails(coin.coinGeckoId)
              const logoUrl = getCryptoLogo(coin.symbol)
              const ticker = getCryptoTicker(coin.symbol)
              
              // Log price details for debugging
              console.log(`💰 ${ticker} price details:`, { 
                symbol: coin.symbol, 
                coinGeckoId: coin.coinGeckoId, 
                price: coinDetails.price 
              })
              
              // Validate price before creating market
              if (coinDetails.price <= 0 || coinDetails.price === -1) {
                if (coinDetails.price === -1) {
                  console.warn(`⚠️ CoinGecko API failed for ${ticker}, skipping market creation until API recovers`)
                } else {
                  console.warn(`⚠️ Invalid price ${coinDetails.price} for ${ticker}, skipping market creation`)
                }
                continue
              }
              
              // Create market for diversity
              const startTime = new Date(now.getTime() + (createdCount * 2000)) // 2 second intervals
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
              console.log(`✅ Created diversity market: ${ticker} ${duration}m (price: $${coinDetails.price})`)
            }
          } catch (error) {
            console.error(`❌ Failed to create diversity market for ${coin.ticker}:`, error)
            // Continue with other coins - don't fail completely
          }
        }
      }
    } else {
      console.log(`✅ Good diversity: ${uniqueCoins.size} unique coins in ${currentMarkets.length} markets`)
      
      // Regular rotation logic for maintenance when diversity is good
      const selectedCoins = getRandomCoins(8) // Smaller selection for maintenance
      
      for (const coin of selectedCoins) {
        for (const duration of DURATIONS) {
          try {
            const existingCount = currentMarkets.filter(m => 
              m.symbol === coin.symbol && 
              m.durationMin === duration
            ).length
            
            if (existingCount === 0) {
              const coinDetails = await getCoinDetails(coin.coinGeckoId)
              const logoUrl = getCryptoLogo(coin.symbol)
              const ticker = getCryptoTicker(coin.symbol)
              
              // Log and validate price
              console.log(`💰 ${ticker} maintenance price:`, coinDetails.price)
              if (coinDetails.price <= 0 || coinDetails.price === -1) {
                if (coinDetails.price === -1) {
                  console.warn(`⚠️ CoinGecko API failed for ${ticker}, skipping until API recovers`)
                } else {
                  console.warn(`⚠️ Invalid price ${coinDetails.price} for ${ticker}, skipping`)
                }
                continue
              }
              
              const startTime = new Date(now.getTime() + (createdCount * 2000))
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
              console.log(`✅ Created maintenance market: ${ticker} ${duration}m (price: $${coinDetails.price})`)
            }
          } catch (error) {
            console.error(`❌ Failed to create maintenance market for ${coin.ticker}:`, error)
          }
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
    // Create emergency markets using a diverse mix of coins
    const emergencyCoins = getRandomCoins(8) // Use 8 random coins instead of just 3
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
