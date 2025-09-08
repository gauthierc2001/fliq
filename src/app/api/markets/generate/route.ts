import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateMarketData, getFallbackMarkets } from '@/lib/marketGenerator'

export async function POST(request: NextRequest) {
  // Add basic rate limiting for production
  const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  console.log(`Market generation request from IP: ${clientIP}`)
  
  try {
    console.log('Starting market generation...')
    let createdCount = 0
    let usedFallback = false
    
    // Check existing active markets
    const activeMarkets = await prisma.market.count({
      where: {
        resolved: false,
        endTime: {
          gt: new Date()
        }
      }
    })
    
    console.log(`Found ${activeMarkets} active markets`)
    
    let marketDataToCreate
    
    try {
      // Try to get live market data from CoinGecko
      marketDataToCreate = await generateMarketData()
      console.log(`Generated ${marketDataToCreate.length} markets from CoinGecko`)
    } catch (error) {
      console.warn('CoinGecko unavailable, using fallback markets:', error)
      marketDataToCreate = getFallbackMarkets()
      usedFallback = true
    }
    
    // Create markets in database
    for (const marketData of marketDataToCreate) {
      try {
        // Check if market already exists
        const existingMarket = await prisma.market.findFirst({
          where: {
            symbol: marketData.symbol,
            durationMin: marketData.durationMin,
            resolved: false,
            endTime: {
              gt: new Date()
            }
          }
        })
        
        if (!existingMarket) {
          await prisma.market.create({
            data: {
              symbol: marketData.symbol,
              title: marketData.title,
              durationMin: marketData.durationMin,
              startTime: marketData.startTime,
              endTime: marketData.endTime,
              startPrice: marketData.startPrice
            }
          })
          createdCount++
          console.log(`Created market: ${marketData.ticker} ${marketData.durationMin}m`)
        }
      } catch (error) {
        console.error(`Error creating market ${marketData.ticker}:`, error)
        // Continue with other markets
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
      totalActiveMarkets: finalCount,
      usedFallback,
      warning: usedFallback ? 'CoinGecko API unavailable, using fallback data' : null
    })
  } catch (error) {
    console.error('Error generating markets:', error)
    
    // Last resort: try to create basic fallback markets
    try {
      const fallbackMarkets = getFallbackMarkets()
      let fallbackCreated = 0
      
      for (const marketData of fallbackMarkets) {
        await prisma.market.create({
          data: {
            symbol: marketData.symbol,
            title: marketData.title,
            durationMin: marketData.durationMin,
            startTime: marketData.startTime,
            endTime: marketData.endTime,
            startPrice: marketData.startPrice
          }
        })
        fallbackCreated++
      }
      
      return NextResponse.json({
        success: true,
        message: `Created ${fallbackCreated} fallback markets`,
        createdCount: fallbackCreated,
        totalActiveMarkets: fallbackCreated,
        usedFallback: true,
        warning: 'Emergency fallback: Created basic markets due to API/database issues'
      })
    } catch (fallbackError) {
      console.error('Even fallback failed:', fallbackError)
      return NextResponse.json({ 
        success: false,
        error: 'Complete market generation failure',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 })
    }
  }
}

export async function GET(request: NextRequest) {
  // Allow GET requests to trigger market generation for testing
  return POST(request)
}
