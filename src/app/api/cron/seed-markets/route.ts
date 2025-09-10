import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCoinDetails } from '@/lib/prices'
import { MAJOR_COINS } from '@/lib/marketGenerator'
import { getCryptoLogo, getCryptoTicker } from '@/lib/cryptoAssets'

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
        const logoUrl = getCryptoLogo(coin.symbol)
        const ticker = getCryptoTicker(coin.symbol)
        
        // Skip if CoinGecko API failed
        if (coinDetails.price <= 0 || coinDetails.price === -1) {
          if (coinDetails.price === -1) {
            console.warn(`⚠️ CoinGecko API failed for ${ticker}, skipping until API recovers`)
          } else {
            console.warn(`⚠️ Invalid price ${coinDetails.price} for ${ticker}, skipping`)
          }
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
                title: `${ticker} ↑ in ${duration}m?`,
                durationMin: duration,
                startTime,
                endTime,
                startPrice: coinDetails.price,
                logoUrl: logoUrl
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
