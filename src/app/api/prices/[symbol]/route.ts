import { NextRequest, NextResponse } from 'next/server'
import { getCurrentPrice, getCoinGeckoId, getCoinDetails } from '@/lib/prices'

export async function GET(
  _request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    const { symbol } = params
    const coinId = getCoinGeckoId(symbol)
    
    // Get detailed price info for debugging
    const coinDetails = await getCoinDetails(coinId)
    const basicPrice = await getCurrentPrice(coinId)
    
    return NextResponse.json({
      symbol,
      coinId,
      detailedPrice: coinDetails.price,
      basicPrice,
      image: coinDetails.image,
      timestamp: new Date().toISOString(),
      debug: {
        priceFromDetails: coinDetails.price,
        priceFromBasic: basicPrice,
        hasImage: !!coinDetails.image
      }
    })
  } catch (error) {
    console.error('Error fetching price:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch price',
      details: error instanceof Error ? error.message : 'Unknown error',
      symbol,
      coinId: getCoinGeckoId(symbol),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
