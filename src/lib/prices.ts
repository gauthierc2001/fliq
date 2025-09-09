const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3'
const TIMEOUT_MS = 5000 // 5 second timeout
const RETRY_DELAY_MS = 1000 // 1 second between retries

export interface CoinPrice {
  symbol: string
  price: number
  timestamp: number
}

async function fetchWithTimeout(url: string, options: RequestInit, timeout: number): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}

export async function getCurrentPrice(coinId: string, retries = 2): Promise<number> {
  try {
    const response = await fetchWithTimeout(
      `${COINGECKO_BASE_URL}/simple/price?ids=${coinId}&vs_currencies=usd`,
      {
        headers: process.env.COINGECKO_API_KEY ? {
          'X-CG-Demo-API-Key': process.env.COINGECKO_API_KEY
        } : {}
      },
      TIMEOUT_MS
    )
    
    if (!response.ok) {
      if (response.status === 429 && retries > 0) {
        // Rate limited - wait and retry
        console.warn(`CoinGecko rate limit hit, retrying in ${RETRY_DELAY_MS}ms...`)
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS))
        return getCurrentPrice(coinId, retries - 1)
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    const price = data[coinId]?.usd
    
    if (price === undefined || price === null) {
      throw new Error(`Price not found for ${coinId}`)
    }
    
    return price
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error(`CoinGecko request timeout for ${coinId}`)
      throw new Error('Price fetch timeout')
    }
    console.error('Error fetching price:', error)
    throw error
  }
}

export function getCoinGeckoId(symbol: string): string {
  const mapping: Record<string, string> = {
    'bitcoin': 'bitcoin',
    'ethereum': 'ethereum', 
    'solana': 'solana',
    'cardano': 'cardano',
    'avalanche-2': 'avalanche-2',
    'chainlink': 'chainlink'
  }
  return mapping[symbol] || symbol
}
