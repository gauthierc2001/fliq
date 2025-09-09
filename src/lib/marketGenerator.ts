import { getCoinDetails } from './prices'

export interface CoinData {
  symbol: string
  name: string
  ticker: string
  coinGeckoId: string
}

// Verified CoinGecko coins with correct IDs and available logos
export const MAJOR_COINS: CoinData[] = [
  { symbol: 'bitcoin', name: 'Bitcoin', ticker: 'BTC', coinGeckoId: 'bitcoin' },
  { symbol: 'ethereum', name: 'Ethereum', ticker: 'ETH', coinGeckoId: 'ethereum' },
  { symbol: 'solana', name: 'Solana', ticker: 'SOL', coinGeckoId: 'solana' },
  { symbol: 'cardano', name: 'Cardano', ticker: 'ADA', coinGeckoId: 'cardano' },
  { symbol: 'binancecoin', name: 'BNB', ticker: 'BNB', coinGeckoId: 'binancecoin' },
  { symbol: 'chainlink', name: 'Chainlink', ticker: 'LINK', coinGeckoId: 'chainlink' }
]

export const RESOLUTION_TIMES = [1, 3, 5] // minutes - updated to match new durations

export interface MarketData {
  symbol: string
  title: string
  durationMin: number
  startTime: Date
  endTime: Date
  startPrice: number
  ticker: string
  logoUrl?: string
}

export async function generateMarketData(): Promise<MarketData[]> {
  const markets: MarketData[] = []
  
  for (const coin of MAJOR_COINS) {
    try {
      const details = await getCoinDetails(coin.coinGeckoId)
      
      for (const duration of RESOLUTION_TIMES) {
        const startTime = new Date()
        const endTime = new Date(startTime.getTime() + duration * 60 * 1000)
        
        markets.push({
          symbol: coin.symbol,
          title: `Will ${coin.ticker} go ↑ in ${duration}m?`,
          durationMin: duration,
          startTime,
          endTime,
          startPrice: details.price,
          ticker: coin.ticker,
          logoUrl: details.image
        })
      }
    } catch (error) {
      console.error(`Failed to fetch details for ${coin.ticker}:`, error)
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
      title: 'Will BTC go ↑ in 1m?',
      durationMin: 1,
      startTime: now,
      endTime: new Date(now.getTime() + 1 * 60 * 1000),
      startPrice: 90000,
      ticker: 'BTC',
      logoUrl: undefined // Will show fallback logo
    },
    {
      symbol: 'ethereum',
      title: 'Will ETH go ↑ in 3m?',
      durationMin: 3,
      startTime: now,
      endTime: new Date(now.getTime() + 3 * 60 * 1000),
      startPrice: 3200,
      ticker: 'ETH',
      logoUrl: undefined // Will show fallback logo
    },
    {
      symbol: 'solana',
      title: 'Will SOL go ↑ in 5m?',
      durationMin: 5,
      startTime: now,
      endTime: new Date(now.getTime() + 5 * 60 * 1000),
      startPrice: 200,
      ticker: 'SOL',
      logoUrl: undefined // Will show fallback logo
    }
  ]
}
