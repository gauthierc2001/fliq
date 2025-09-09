import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCoinDetails, getCoinGeckoId } from '@/lib/prices'

// Force dynamic rendering - this route uses database
export const dynamic = 'force-dynamic'

// Verified CoinGecko coins with correct IDs and available logos
const COINS = [
  { symbol: 'bitcoin', name: 'Bitcoin', ticker: 'BTC' },
  { symbol: 'ethereum', name: 'Ethereum', ticker: 'ETH' },
  { symbol: 'solana', name: 'Solana', ticker: 'SOL' },
  { symbol: 'cardano', name: 'Cardano', ticker: 'ADA' },
  { symbol: 'binancecoin', name: 'BNB', ticker: 'BNB' },
  { symbol: 'chainlink', name: 'Chainlink', ticker: 'LINK' }
]

const DURATIONS = [1, 3, 5] // minutes - quick resolution times

export async function POST() {
  try {
    let createdCount = 0
    
    for (const coin of COINS) {
      try {
        // Get current price and logo from CoinGecko
        const coinId = getCoinGeckoId(coin.symbol)
        const { price: currentPrice, image: logoUrl } = await getCoinDetails(coinId)
        
        if (currentPrice === 0) {
          console.warn(`Skipping ${coin.symbol} - price fetch failed`)
          continue
        }
        
        for (const duration of DURATIONS) {
          const startTime = new Date()
          const endTime = new Date(startTime.getTime() + duration * 60 * 1000)
          
          // Check if market already exists for this timeframe
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
                title: `${coin.ticker} ↑ in ${duration}m?`,
                durationMin: duration,
                startTime,
                endTime,
                startPrice: currentPrice,
                logoUrl: logoUrl || null // Store logo URL from CoinGecko
              }
            })
            createdCount++
          }
        }
      } catch (error) {
        console.error(`Error processing coin ${coin.symbol}:`, error)
        // Continue with other coins
      }
    }
    }
    
    return NextResponse.json({
      message: `Created ${createdCount} new markets`,
      createdCount
    })
  } catch (error) {
    console.error('Error seeding markets:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
