const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3'

export interface CoinPrice {
  symbol: string
  price: number
  timestamp: number
}

export async function getCurrentPrice(coinId: string): Promise<number> {
  try {
    const response = await fetch(
      `${COINGECKO_BASE_URL}/simple/price?ids=${coinId}&vs_currencies=usd`,
      {
        headers: process.env.COINGECKO_API_KEY ? {
          'X-CG-Demo-API-Key': process.env.COINGECKO_API_KEY
        } : {}
      }
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data[coinId]?.usd || 0
  } catch (error) {
    console.error('Error fetching price:', error)
    throw error
  }
}

export function getCoinGeckoId(symbol: string): string {
  const mapping: Record<string, string> = {
    'bitcoin': 'bitcoin',
    'ethereum': 'ethereum', 
    'solana': 'solana'
  }
  return mapping[symbol] || symbol
}
