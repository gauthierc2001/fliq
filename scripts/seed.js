const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Real price fetching function (same as used in the app)
async function fetchWithTimeout(url, options, timeout) {
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

async function getCurrentPrice(coinId) {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`
  
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetchWithTimeout(url, {}, 10000)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      const price = data[coinId]?.usd
      
      if (typeof price !== 'number' || price <= 0) {
        throw new Error(`Invalid price data for ${coinId}: ${price}`)
      }
      
      return price
    } catch (error) {
      console.warn(`Price fetch attempt ${attempt} failed for ${coinId}:`, error.message)
      if (attempt === 3) {
        // Return fallback prices for major coins
        const fallbackPrices = {
          'bitcoin': 45000,
          'ethereum': 2500,
          'solana': 100,
          'dogwifcoin': 2,
          'bonk': 0.00002,
          'pepe': 0.000001,
          'dogecoin': 0.08,
          'shiba-inu': 0.000008
        }
        const fallbackPrice = fallbackPrices[coinId] || 1
        console.log(`Using fallback price $${fallbackPrice} for ${coinId}`)
        return fallbackPrice
      }
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
    }
  }
}

async function main() {
  console.log('🌱 Seeding initial markets with REAL prices...')
  
  // Use a subset of major coins for seeding (same as marketGenerator.ts)
  const coins = [
    { symbol: 'bitcoin', name: 'Bitcoin', ticker: 'BTC', coinGeckoId: 'bitcoin' },
    { symbol: 'ethereum', name: 'Ethereum', ticker: 'ETH', coinGeckoId: 'ethereum' },
    { symbol: 'solana', name: 'Solana', ticker: 'SOL', coinGeckoId: 'solana' },
    { symbol: 'dogwifcoin', name: 'Dogwifhat', ticker: 'WIF', coinGeckoId: 'dogwifcoin' },
    { symbol: 'bonk', name: 'Bonk', ticker: 'BONK', coinGeckoId: 'bonk' },
    { symbol: 'pepe', name: 'Pepe', ticker: 'PEPE', coinGeckoId: 'pepe' },
    { symbol: 'dogecoin', name: 'Dogecoin', ticker: 'DOGE', coinGeckoId: 'dogecoin' },
    { symbol: 'shiba-inu', name: 'Shiba Inu', ticker: 'SHIB', coinGeckoId: 'shiba-inu' }
  ]
  
  const durations = [1, 3, 5] // minutes
  
  for (const coin of coins) {
    console.log(`📊 Fetching real price for ${coin.ticker}...`)
    
    try {
      // Get REAL price from CoinGecko API
      const realPrice = await getCurrentPrice(coin.coinGeckoId)
      console.log(`💰 ${coin.ticker}: $${realPrice}`)
      
      for (const duration of durations) {
        const startTime = new Date()
        const endTime = new Date(startTime.getTime() + duration * 60 * 1000)
        
        // Check if market already exists
        const existingMarket = await prisma.market.findFirst({
          where: {
            symbol: coin.symbol,
            durationMin: duration,
            resolved: false,
            endTime: {
              gt: new Date()
            }
          }
        })
        
        if (!existingMarket) {
          // Use local asset system for logos
          const cryptoLogos = require('../public/assets/logos/crypto-logos.json')
          const cryptoAsset = cryptoLogos[coin.symbol]
          
          let logoUrl = null
          if (cryptoAsset) {
            if (cryptoAsset.hasLocalLogo && cryptoAsset.logoFile) {
              logoUrl = `/assets/logos/${cryptoAsset.logoFile}`
            } else {
              logoUrl = cryptoAsset.fallbackUrl
            }
          }
          
          await prisma.market.create({
            data: {
              symbol: coin.symbol,
              title: `${coin.ticker} ↑ in ${duration}m?`,
              durationMin: duration,
              startTime,
              endTime,
              startPrice: realPrice, // ✅ Now using REAL price instead of mockPrice
              logoUrl: logoUrl
            }
          })
          
          console.log(`✅ Created ${coin.ticker} ${duration}m market with REAL price $${realPrice}${logoUrl ? ' and logo' : ' (no logo)'}`)
        }
      }
    } catch (error) {
      console.error(`❌ Failed to process ${coin.ticker}:`, error.message)
      // Continue with other coins
    }
  }
  
  console.log('✅ Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
