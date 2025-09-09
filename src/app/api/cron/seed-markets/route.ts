import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCoinDetails } from '@/lib/prices'
import { MAJOR_COINS } from '@/lib/marketGenerator'

// Force dynamic rendering - this route uses database
export const dynamic = 'force-dynamic'

const DURATIONS = [1, 3, 5] // minutes - quick resolution times

export async function POST() {
  try {
    let createdCount = 0
    
    for (const coin of MAJOR_COINS) {
      try {
        // Get current price and logo
        const coinDetails = await getCoinDetails(coin.coinGeckoId)
        
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
                startPrice: coinDetails.price,
                logoUrl: coinDetails.image
              }
            })
            createdCount++
          }
        }
      } catch (error) {
        console.error(`Failed to fetch details for ${coin.ticker}:`, error)
        // Continue with other coins - don't fail completely
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
