import { NextRequest, NextResponse } from 'next/server'
import { getCurrentPrice, getCoinGeckoId } from '@/lib/prices'

export async function GET(
  _request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    const { symbol } = params
    const coinId = getCoinGeckoId(symbol)
    const price = await getCurrentPrice(coinId)
    
    return NextResponse.json({
      symbol,
      price,
      timestamp: Date.now()
    })
  } catch (error) {
    console.error('Error fetching price:', error)
    return NextResponse.json({ error: 'Failed to fetch price' }, { status: 500 })
  }
}
