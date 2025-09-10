import { getCurrentPrice, getCoinDetails } from './prices'
import { getCryptoLogo, getCryptoTicker, getCryptoName } from './cryptoAssets'

export interface CoinData {
  symbol: string
  name: string
  ticker: string
  coinGeckoId: string
}

export const MAJOR_COINS: CoinData[] = [
  // Major Cryptocurrencies
  { symbol: 'bitcoin', name: 'Bitcoin', ticker: 'BTC', coinGeckoId: 'bitcoin' },
  { symbol: 'ethereum', name: 'Ethereum', ticker: 'ETH', coinGeckoId: 'ethereum' },
  { symbol: 'solana', name: 'Solana', ticker: 'SOL', coinGeckoId: 'solana' },
  { symbol: 'cardano', name: 'Cardano', ticker: 'ADA', coinGeckoId: 'cardano' },
  { symbol: 'avalanche-2', name: 'Avalanche', ticker: 'AVAX', coinGeckoId: 'avalanche-2' },
  { symbol: 'binancecoin', name: 'BNB', ticker: 'BNB', coinGeckoId: 'binancecoin' },
  { symbol: 'chainlink', name: 'Chainlink', ticker: 'LINK', coinGeckoId: 'chainlink' },
  { symbol: 'polygon', name: 'Polygon', ticker: 'MATIC', coinGeckoId: 'polygon' },
  
  // Top Solana Memecoins & Popular Memes
  { symbol: 'dogwifcoin', name: 'Dogwifhat', ticker: 'WIF', coinGeckoId: 'dogwifcoin' },
  { symbol: 'bonk', name: 'Bonk', ticker: 'BONK', coinGeckoId: 'bonk' },
  { symbol: 'book-of-meme', name: 'Book of Meme', ticker: 'BOME', coinGeckoId: 'book-of-meme' },
  { symbol: 'jeo-boden', name: 'Jeo Boden', ticker: 'BODEN', coinGeckoId: 'jeo-boden' },
  { symbol: 'cat-in-a-dogs-world', name: 'MEW', ticker: 'MEW', coinGeckoId: 'cat-in-a-dogs-world' },
  { symbol: 'popcat', name: 'Popcat', ticker: 'POPCAT', coinGeckoId: 'popcat' },
  { symbol: 'jupiter-exchange-solana', name: 'Jupiter', ticker: 'JUP', coinGeckoId: 'jupiter-exchange-solana' },
  { symbol: 'wen-4', name: 'Wen', ticker: 'WEN', coinGeckoId: 'wen-4' },
  { symbol: 'mother-iggy', name: 'Mother Iggy', ticker: 'MOTHER', coinGeckoId: 'mother-iggy' },
  { symbol: 'pepe', name: 'Pepe', ticker: 'PEPE', coinGeckoId: 'pepe' },
  { symbol: 'dogecoin', name: 'Dogecoin', ticker: 'DOGE', coinGeckoId: 'dogecoin' },
  { symbol: 'shiba-inu', name: 'Shiba Inu', ticker: 'SHIB', coinGeckoId: 'shiba-inu' },
  { symbol: 'floki', name: 'Floki', ticker: 'FLOKI', coinGeckoId: 'floki' },
  { symbol: 'goatseus-maximus', name: 'Goatseus Maximus', ticker: 'GOAT', coinGeckoId: 'goatseus-maximus' },
  { symbol: 'peanut-the-squirrel', name: 'Peanut the Squirrel', ticker: 'PNUT', coinGeckoId: 'peanut-the-squirrel' },
  { symbol: 'act-i-the-ai-prophecy', name: 'Act I', ticker: 'ACT', coinGeckoId: 'act-i-the-ai-prophecy' },
  { symbol: 'gigachad', name: 'GIGA', ticker: 'GIGA', coinGeckoId: 'gigachad-2' },
  { symbol: 'retardio', name: 'Retardio', ticker: 'RETARDIO', coinGeckoId: 'retardio' },
  { symbol: 'first-convicted-raccon', name: 'First Convicted Racoon', ticker: 'FRED', coinGeckoId: 'first-convicted-raccon' },
  { symbol: 'moo-deng', name: 'Moo Deng', ticker: 'MOODENG', coinGeckoId: 'moo-deng' },
  { symbol: 'fwog', name: 'Fwog', ticker: 'FWOG', coinGeckoId: 'fwog' },
  { symbol: 'smoking-chicken-fish', name: 'Smoking Chicken Fish', ticker: 'SCF', coinGeckoId: 'smoking-chicken-fish' },
  { symbol: 'troll-2', name: 'Troll', ticker: 'TROLL', coinGeckoId: 'troll-2' },
  { symbol: 'aura-on-sol', name: 'Aura', ticker: 'AURA', coinGeckoId: 'aura-on-sol' },
  { symbol: 'useless-3', name: 'Useless', ticker: 'USELESS', coinGeckoId: 'useless-3' },
  { symbol: 'fartcoin', name: 'Fartcoin', ticker: 'FARTCOIN', coinGeckoId: 'fartcoin' },
  { symbol: 'neet', name: 'Neet', ticker: 'NEET', coinGeckoId: 'neet' },
  { symbol: 'pump-fun', name: 'PumpFun', ticker: 'PUMP', coinGeckoId: 'pump-fun' }
]

export const RESOLUTION_TIMES = [1, 3, 5] // minutes

export interface MarketData {
  symbol: string
  title: string
  durationMin: number
  startTime: Date
  endTime: Date
  startPrice: number
  ticker: string
  logoUrl: string | null
}

export async function generateMarketData(): Promise<MarketData[]> {
  const markets: MarketData[] = []
  
  for (const coin of MAJOR_COINS) {
    try {
      const details = await getCoinDetails(coin.coinGeckoId)
      const cryptoLogo = getCryptoLogo(coin.symbol)
      const cryptoTicker = getCryptoTicker(coin.symbol)
      
      console.log(`Fetched ${cryptoTicker} details: price=${details.price}, logo=${cryptoLogo ? 'local' : 'fallback'}`)
      
      for (const duration of RESOLUTION_TIMES) {
        const startTime = new Date()
        const endTime = new Date(startTime.getTime() + duration * 60 * 1000)
        
        markets.push({
          symbol: coin.symbol,
          title: `Will ${cryptoTicker} go ↑ in ${duration}m?`,
          durationMin: duration,
          startTime,
          endTime,
          startPrice: details.price,
          ticker: cryptoTicker,
          logoUrl: cryptoLogo // Use our local asset system
        })
      }
    } catch (error) {
      console.error(`Failed to fetch details for ${coin.ticker}:`, error)
      // Continue with other coins - don't fail completely
      
      // Create fallback markets using our local asset system
      const cryptoLogo = getCryptoLogo(coin.symbol)
      const cryptoTicker = getCryptoTicker(coin.symbol)
      
      for (const duration of RESOLUTION_TIMES) {
        const startTime = new Date()
        const endTime = new Date(startTime.getTime() + duration * 60 * 1000)
        
        markets.push({
          symbol: coin.symbol,
          title: `Will ${cryptoTicker} go ↑ in ${duration}m?`,
          durationMin: duration,
          startTime,
          endTime,
          startPrice: 0, // Fallback price
          ticker: cryptoTicker,
          logoUrl: cryptoLogo // Use our local asset system even for fallbacks
        })
      }
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
      startPrice: 45000,
      ticker: 'BTC',
      logoUrl: null // Will show fallback logo
    },
    {
      symbol: 'ethereum',
      title: 'Will ETH go ↑ in 3m?',
      durationMin: 3,
      startTime: now,
      endTime: new Date(now.getTime() + 3 * 60 * 1000),
      startPrice: 2800,
      ticker: 'ETH',
      logoUrl: null // Will show fallback logo
    },
    {
      symbol: 'solana',
      title: 'Will SOL go ↑ in 5m?',
      durationMin: 5,
      startTime: now,
      endTime: new Date(now.getTime() + 5 * 60 * 1000),
      startPrice: 85,
      ticker: 'SOL',
      logoUrl: null // Will show fallback logo
    }
  ]
}
