import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentPrice, getCoinGeckoId } from '@/lib/prices'

const COINS = [
  { symbol: 'bitcoin', name: 'Bitcoin', ticker: 'BTC' },
  { symbol: 'ethereum', name: 'Ethereum', ticker: 'ETH' },
  { symbol: 'solana', name: 'Solana', ticker: 'SOL' },
  { symbol: 'cardano', name: 'Cardano', ticker: 'ADA' },
  { symbol: 'avalanche-2', name: 'Avalanche', ticker: 'AVAX' },
  { symbol: 'chainlink', name: 'Chainlink', ticker: 'LINK' }
]

const DURATIONS = [5, 15, 30] // minutes

export async function POST() {
  try {
    console.log('Starting market generation...')
    let createdCount = 0
    
    // Always ensure we have at least a few active markets
    const activeMarkets = await prisma.market.count({
      where: {
        resolved: false,
        endTime: {
          gt: new Date()
        }
      }
    })
    
    console.log(`Found ${activeMarkets} active markets`)
    
    // Generate markets for each coin and duration
    for (const coin of COINS) {
      try {
        const coinId = getCoinGeckoId(coin.symbol)
        const currentPrice = await getCurrentPrice(coinId)
        
        console.log(`${coin.ticker}: $${currentPrice}`)
        
        for (const duration of DURATIONS) {
          const startTime = new Date()
          const endTime = new Date(startTime.getTime() + duration * 60 * 1000)
          
          // Check if market already exists for this combination
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
            await prisma.market.create({
              data: {
                symbol: coin.symbol,
                title: `Will ${coin.ticker} price go ↑ in ${duration}m?`,
                durationMin: duration,
                startTime,
                endTime,
                startPrice: currentPrice
              }
            })
            createdCount++
            console.log(`Created market: ${coin.ticker} ${duration}m`)
          }
        }
      } catch (error) {
        console.error(`Error processing ${coin.ticker}:`, error)
        // Continue with other coins
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
    
    console.log(`Market generation complete. Created: ${createdCount}, Total active: ${finalCount}`)
    
    return NextResponse.json({
      success: true,
      message: `Created ${createdCount} new markets`,
      createdCount,
      totalActiveMarkets: finalCount
    })
  } catch (error) {
    console.error('Error generating markets:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Failed to generate markets',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  // Allow GET requests to trigger market generation for testing
  return POST()
}
