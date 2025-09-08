import { getCurrentPrice, getCoinGeckoId } from './prices'

export interface CoinData {
  symbol: string
  name: string
  ticker: string
  coinGeckoId: string
}

export const MAJOR_COINS: CoinData[] = [
  { symbol: 'bitcoin', name: 'Bitcoin', ticker: 'BTC', coinGeckoId: 'bitcoin' },
  { symbol: 'ethereum', name: 'Ethereum', ticker: 'ETH', coinGeckoId: 'ethereum' },
  { symbol: 'solana', name: 'Solana', ticker: 'SOL', coinGeckoId: 'solana' },
  { symbol: 'binancecoin', name: 'BNB', ticker: 'BNB', coinGeckoId: 'binancecoin' },
  { symbol: 'cardano', name: 'Cardano', ticker: 'ADA', coinGeckoId: 'cardano' },
  { symbol: 'avalanche-2', name: 'Avalanche', ticker: 'AVAX', coinGeckoId: 'avalanche-2' },
  { symbol: 'chainlink', name: 'Chainlink', ticker: 'LINK', coinGeckoId: 'chainlink' },
  { symbol: 'polygon', name: 'Polygon', ticker: 'MATIC', coinGeckoId: 'matic-network' }
]

export const RESOLUTION_TIMES = [5, 15, 30] // minutes

export interface MarketData {
  symbol: string
  title: string
  durationMin: number
  startTime: Date
  endTime: Date
  startPrice: number
  ticker: string
}

export async function generateMarketData(): Promise<MarketData[]> {
  const markets: MarketData[] = []
  
  for (const coin of MAJOR_COINS) {
    try {
      const price = await getCurrentPrice(coin.coinGeckoId)
      
      for (const duration of RESOLUTION_TIMES) {
        const startTime = new Date()
        const endTime = new Date(startTime.getTime() + duration * 60 * 1000)
        
        markets.push({
          symbol: coin.symbol,
          title: `Will ${coin.ticker} go ↑ in ${duration}m?`,
          durationMin: duration,
          startTime,
          endTime,
          startPrice: price,
          ticker: coin.ticker
        })
      }
    } catch (error) {
      console.error(`Failed to fetch price for ${coin.ticker}:`, error)
      // Continue with other coins - don't fail completely
    }
  }
  
  return markets
}

// Fallback markets when CoinGecko is unavailable
export function getFallbackMarkets(): MarketData[] {
  const now = new Date()
  
  return [
    {
      symbol: 'bitcoin',
      title: 'Will BTC go ↑ in 5m?',
      durationMin: 5,
      startTime: now,
      endTime: new Date(now.getTime() + 5 * 60 * 1000),
      startPrice: 45000,
      ticker: 'BTC'
    },
    {
      symbol: 'ethereum',
      title: 'Will ETH go ↑ in 15m?',
      durationMin: 15,
      startTime: now,
      endTime: new Date(now.getTime() + 15 * 60 * 1000),
      startPrice: 2800,
      ticker: 'ETH'
    },
    {
      symbol: 'solana',
      title: 'Will SOL go ↑ in 30m?',
      durationMin: 30,
      startTime: now,
      endTime: new Date(now.getTime() + 30 * 60 * 1000),
      startPrice: 85,
      ticker: 'SOL'
    }
  ]
}
