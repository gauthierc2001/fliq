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

const DURATIONS = [5, 15, 30] // minutes - quick resolution times

export async function POST() {
  try {
    let createdCount = 0
    
    for (const coin of COINS) {
      // Get current price
      const coinId = getCoinGeckoId(coin.symbol)
      const currentPrice = await getCurrentPrice(coinId)
      
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
              startPrice: currentPrice
            }
          })
          createdCount++
        }
      }
    }
    
    return NextResponse.json({
      message: `Created ${createdCount} new markets`,
      createdCount
    })
  } catch (error) {
    console.error('Error seeding markets:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
