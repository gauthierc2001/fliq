const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3'
const TIMEOUT_MS = 3000 // 3 second timeout (reduced for faster failure)
const RETRY_DELAY_MS = 500 // 500ms between retries (faster recovery)
const BACKGROUND_RETRY_INTERVAL = 30000 // 30 seconds between background retries

// Global retry queue for failed price fetches
const retryQueue = new Map<string, { lastAttempt: number; attempts: number }>()

// Circuit breaker to prevent cascading failures
let failureCount = 0
let lastFailureTime = 0
const CIRCUIT_BREAKER_THRESHOLD = 3
const CIRCUIT_BREAKER_TIMEOUT = 30000 // 30 seconds

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

function isCircuitBreakerOpen(): boolean {
  if (failureCount >= CIRCUIT_BREAKER_THRESHOLD) {
    if (Date.now() - lastFailureTime < CIRCUIT_BREAKER_TIMEOUT) {
      return true
    } else {
      // Reset circuit breaker after timeout
      failureCount = 0
      lastFailureTime = 0
    }
  }
  return false
}

export async function getCurrentPrice(coinId: string, retries = 2): Promise<number> {
  // Check circuit breaker
  if (isCircuitBreakerOpen()) {
    throw new Error('CoinGecko API circuit breaker is open')
  }
  
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
    
    // Reset failure count on success
    failureCount = 0
    return price
  } catch (error) {
    // Increment failure count
    failureCount++
    lastFailureTime = Date.now()
    
    if (error instanceof Error && error.name === 'AbortError') {
      console.error(`CoinGecko request timeout for ${coinId}`)
      throw new Error('Price fetch timeout')
    }
    console.error('Error fetching price:', error)
    
    // For critical price fetching failures, don't completely fail
    if (retries === 0) {
      console.warn(`All retries exhausted for ${coinId}, this will likely cause market creation to fail`)
    }
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
    
    // Ensure we have valid image URLs and prefer larger images
    let imageUrl = ''
    if (data.image) {
      imageUrl = data.image.large || data.image.small || data.image.thumb || ''
      // Validate that the image URL is actually a URL
      if (imageUrl && !imageUrl.startsWith('http')) {
        console.warn(`Invalid image URL for ${coinId}:`, imageUrl)
        imageUrl = ''
      }
    }
    
    const price = data.market_data?.current_price?.usd || 0
    console.log(`📊 Fetched price for ${coinId}: $${price}`)
    
    return {
      price,
      image: imageUrl
    }
  } catch (error) {
    console.error('Error fetching coin details:', error)
    // Graceful fallback - always try to get price at minimum
    try {
      const price = await getCurrentPrice(coinId)
      return { price, image: '' }
    } catch (priceError) {
      console.error('CoinGecko API completely unavailable for', coinId)
      
      // Add to retry queue for background retries
      const now = Date.now()
      const existing = retryQueue.get(coinId)
      retryQueue.set(coinId, {
        lastAttempt: now,
        attempts: (existing?.attempts || 0) + 1
      })
      
      console.log(`⚠️ Added ${coinId} to retry queue (attempt ${retryQueue.get(coinId)?.attempts})`)
      
      // Return -1 to indicate API failure (will hide starting price in UI)
      // This prevents creating markets with inaccurate prices
      console.log(`⚠️ Returning price -1 for ${coinId} to hide starting price until API recovers`)
      return { price: -1, image: '' }
    }
  }
}

// Background retry mechanism for failed price fetches
export function startBackgroundRetries() {
  setInterval(async () => {
    if (retryQueue.size === 0) return
    
    console.log(`🔄 Background retry: ${retryQueue.size} coins in retry queue`)
    
    for (const [coinId, retryInfo] of retryQueue.entries()) {
      // Only retry every 30 seconds per coin
      if (Date.now() - retryInfo.lastAttempt < BACKGROUND_RETRY_INTERVAL) {
        continue
      }
      
      try {
        console.log(`🔄 Retrying price fetch for ${coinId} (attempt ${retryInfo.attempts + 1})`)
        const price = await getCurrentPrice(coinId)
        
        if (price > 0) {
          console.log(`✅ ${coinId} price recovered: $${price}`)
          retryQueue.delete(coinId) // Remove from retry queue on success
        }
      } catch (error) {
        // Update retry info
        retryQueue.set(coinId, {
          lastAttempt: Date.now(),
          attempts: retryInfo.attempts + 1
        })
        
        // Remove from queue after 10 failed attempts to prevent infinite retries
        if (retryInfo.attempts >= 10) {
          console.warn(`❌ Removing ${coinId} from retry queue after 10 failed attempts`)
          retryQueue.delete(coinId)
        }
      }
    }
  }, 10000) // Check every 10 seconds
}

// Get retry queue status for monitoring
export function getRetryQueueStatus() {
  return {
    queueSize: retryQueue.size,
    coins: Array.from(retryQueue.entries()).map(([coinId, info]) => ({
      coinId,
      attempts: info.attempts,
      lastAttempt: new Date(info.lastAttempt).toISOString()
    }))
  }
}
