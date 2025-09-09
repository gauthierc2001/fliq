const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3'
const TIMEOUT_MS = 5000 // 5 second timeout
const RETRY_DELAY_MS = 1000 // 1 second between retries

export interface CoinPrice {
  symbol: string
  price: number
  timestamp: number
  image?: string
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
    // Major cryptos
    'bitcoin': 'bitcoin',
    'ethereum': 'ethereum', 
    'solana': 'solana',
    'cardano': 'cardano',
    'avalanche-2': 'avalanche-2',
    'chainlink': 'chainlink',
    'binancecoin': 'binancecoin',
    'polygon': 'matic-network',
    
    // Solana memecoins
    'dogwifcoin': 'dogwifcoin',
    'bonk': 'bonk',
    'book-of-meme': 'book-of-meme',
    'jeo-boden': 'jeo-boden',
    'cat-in-a-dogs-world': 'cat-in-a-dogs-world',
    'popcat': 'popcat',
    'Jupiter': 'jupiter-exchange-solana',
    'wen-4': 'wen-4',
    'slerf': 'slerf',
    'mother-iggy': 'mother-iggy',
    'daddy-tate': 'daddy-tate',
    'ponke': 'ponke',
    'myro': 'myro',
    'tensor': 'tensor',
    'jito-governance-token': 'jito-governance-token',
    'hivemapper': 'hivemapper',
    'goatseus-maximus': 'goatseus-maximus',
    'peanut-the-squirrel': 'peanut-the-squirrel',
    'act-i-the-ai-prophecy': 'act-i-the-ai-prophecy',
    'gigachad-2': 'gigachad-2',
    'retardio': 'retardio',
    'moo-deng': 'moo-deng',
    'fwog': 'fwog',
    'smoking-chicken-fish': 'smoking-chicken-fish',
    
    // Popular memecoins
    'mog-coin': 'mog-coin',
    'pepe': 'pepe',
    'dogecoin': 'dogecoin',
    'shiba-inu': 'shiba-inu'
  }
  return mapping[symbol] || symbol
}

export async function getCoinDetails(coinId: string): Promise<{ price: number; image: string }> {
  try {
    const response = await fetchWithTimeout(
      `${COINGECKO_BASE_URL}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
      {
        headers: process.env.COINGECKO_API_KEY ? {
          'X-CG-Demo-API-Key': process.env.COINGECKO_API_KEY
        } : {}
      },
      TIMEOUT_MS
    )
    
    if (!response.ok) {
      if (response.status === 429) {
        console.warn('CoinGecko rate limit hit for coin details')
        // Fallback to basic price fetch
        const price = await getCurrentPrice(coinId)
        return { price, image: '' }
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    return {
      price: data.market_data?.current_price?.usd || 0,
      image: data.image?.large || data.image?.small || ''
    }
  } catch (error) {
    console.error('Error fetching coin details:', error)
    // Graceful fallback - always try to get price at minimum
    try {
      const price = await getCurrentPrice(coinId)
      return { price, image: '' }
    } catch (priceError) {
      console.error('Even price fallback failed:', priceError)
      return { price: 0, image: '' }
    }
  }
}
