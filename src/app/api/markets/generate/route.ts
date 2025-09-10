import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { MAJOR_COINS } from '@/lib/marketGenerator'
import { getCoinDetails } from '@/lib/prices'
import { getCryptoLogo, getCryptoTicker } from '@/lib/cryptoAssets'

// Force dynamic rendering - this route should not be statically generated
export const dynamic = 'force-dynamic'

const DURATIONS = [1, 3, 5] // minutes

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(_request: NextRequest) {
  try {
    console.log('🎯 Starting market generation with REAL prices only...')
    let createdCount = 0
    
    // Use a subset of major coins for generation
    const coinsToUse = MAJOR_COINS.slice(0, 8) // First 8 coins for initial generation
    
    for (const coin of coinsToUse) {
      try {
        // Get REAL price from CoinGecko API - NO FALLBACKS
        console.log(`📊 Fetching REAL price for ${coin.ticker}...`)
        const coinDetails = await getCoinDetails(coin.coinGeckoId)
        const logoUrl = getCryptoLogo(coin.symbol)
        const ticker = getCryptoTicker(coin.symbol)
        
        // Validate price is real and not a fallback
        if (coinDetails.price <= 0) {
          console.warn(`⚠️ Invalid price ${coinDetails.price} for ${coin.ticker}, skipping`)
          continue
        }
        
        console.log(`💰 ${coin.ticker}: $${coinDetails.price} (REAL price from CoinGecko)`)
        
        for (const duration of DURATIONS) {
          try {
            // Check if market already exists
            const existingMarket = await prisma.market.findFirst({
              where: {
                symbol: coin.symbol,
                durationMin: duration,
                resolved: false,
                endTime: {
                  gt: new Date()
                }
              }
            })
            
            if (!existingMarket) {
              const startTime = new Date()
              const endTime = new Date(startTime.getTime() + duration * 60 * 1000)
              
              await prisma.market.create({
                data: {
                  symbol: coin.symbol,
                  title: `Will ${ticker} go ↑ in ${duration}m?`,
                  durationMin: duration,
                  startTime,
                  endTime,
                  startPrice: coinDetails.price, // ✅ GUARANTEED real price
                  logoUrl: logoUrl
                }
              })
              createdCount++
              console.log(`✅ Created ${ticker} ${duration}m market with REAL price $${coinDetails.price}`)
            }
          } catch (error) {
            console.error(`❌ Failed to create ${coin.ticker} ${duration}m market:`, error)
            // Continue with other durations
          }
        }
      } catch (error) {
        console.error(`❌ Failed to process ${coin.ticker} - skipping:`, error.message)
        // Continue with other coins - NO FALLBACK PRICES
      }
    }
    
    // Get final count
    const finalCount = await prisma.market.count({
      where: {
        resolved: false,
        endTime: {
          gt: new Date()
        }
      }
    })
    
    // Get final count
    const finalCount = await prisma.market.count({
      where: {
        resolved: false,
        endTime: {
          gt: new Date()
        }
      }
    })
    
    if (createdCount === 0) {
      console.warn('⚠️ No markets were created - CoinGecko API may be unavailable')
      return NextResponse.json({
        success: false,
        message: 'No markets created - all prices failed to fetch or markets already exist',
        createdCount: 0,
        totalActiveMarkets: finalCount,
        warning: 'Unable to fetch real prices from CoinGecko API'
      }, { status: 503 }) // Service Unavailable
    }
    
    return NextResponse.json({
      success: true,
      message: `Created ${createdCount} new markets with REAL prices`,
      createdCount,
      totalActiveMarkets: finalCount,
      usedFallback: false,
      note: 'All prices fetched from CoinGecko API - no fallback prices used'
    })
  } catch (error) {
    console.error('❌ Market generation failed completely:', error)
    
    // NO FALLBACK MARKETS WITH FAKE PRICES - Fail gracefully instead
    return NextResponse.json({ 
      success: false,
      error: 'Market generation failed - CoinGecko API unavailable',
      details: error instanceof Error ? error.message : 'Unknown error',
      note: 'No fallback markets created to ensure only real prices are used'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  // Allow GET requests to trigger market generation for testing
  return POST(request)
}
