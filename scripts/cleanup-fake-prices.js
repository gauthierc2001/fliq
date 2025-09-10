const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Real price fetching function 
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
        throw error // Re-throw on final attempt
      }
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
    }
  }
}

// Map symbols to CoinGecko IDs
const symbolToCoinGeckoId = {
  'bitcoin': 'bitcoin',
  'ethereum': 'ethereum', 
  'solana': 'solana',
  'dogwifcoin': 'dogwifcoin',
  'bonk': 'bonk',
  'pepe': 'pepe',
  'dogecoin': 'dogecoin',
  'shiba-inu': 'shiba-inu',
  'cardano': 'cardano',
  'avalanche-2': 'avalanche-2',
  'binancecoin': 'binancecoin',
  'chainlink': 'chainlink',
  'polygon': 'polygon',
  'floki': 'floki'
}

async function main() {
  console.log('🔍 Scanning for markets with suspicious (fake) prices...')
  
  // Get all unresolved markets
  const markets = await prisma.market.findMany({
    where: {
      resolved: false
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  
  console.log(`📊 Found ${markets.length} unresolved markets`)
  
  let suspiciousCount = 0
  let updatedCount = 0
  const suspiciousMarkets = []
  
  for (const market of markets) {
    const coinGeckoId = symbolToCoinGeckoId[market.symbol]
    
    if (!coinGeckoId) {
      console.log(`⚠️ No CoinGecko ID found for ${market.symbol}, skipping`)
      continue
    }
    
    try {
      // Get current real price
      const realPrice = await getCurrentPrice(coinGeckoId)
      const marketPrice = market.startPrice
      
      // Check if the market price is suspicious (way off from real price)
      const priceDifference = Math.abs(marketPrice - realPrice) / realPrice
      const isSuspicious = priceDifference > 0.5 // More than 50% difference is suspicious
      
      if (isSuspicious) {
        suspiciousCount++
        suspiciousMarkets.push({
          id: market.id,
          symbol: market.symbol,
          marketPrice,
          realPrice,
          difference: `${(priceDifference * 100).toFixed(1)}%`,
          title: market.title,
          createdAt: market.createdAt
        })
        
        console.log(`🚨 SUSPICIOUS: ${market.symbol} - Market: $${marketPrice}, Real: $${realPrice} (${(priceDifference * 100).toFixed(1)}% diff)`)
      } else {
        console.log(`✅ OK: ${market.symbol} - Market: $${marketPrice}, Real: $${realPrice} (${(priceDifference * 100).toFixed(1)}% diff)`)
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200))
      
    } catch (error) {
      console.error(`❌ Failed to check ${market.symbol}:`, error.message)
    }
  }
  
  console.log(`\n📋 SUMMARY:`)
  console.log(`Total markets checked: ${markets.length}`)
  console.log(`Suspicious markets found: ${suspiciousCount}`)
  
  if (suspiciousCount > 0) {
    console.log(`\n🚨 SUSPICIOUS MARKETS:`)
    suspiciousMarkets.forEach((market, index) => {
      console.log(`${index + 1}. ${market.symbol} (${market.title})`)
      console.log(`   Market Price: $${market.marketPrice}`)
      console.log(`   Real Price: $${market.realPrice}`)
      console.log(`   Difference: ${market.difference}`)
      console.log(`   Created: ${market.createdAt}`)
      console.log(`   ID: ${market.id}\n`)
    })
    
    console.log(`\n💡 To fix these markets, you can:`)
    console.log(`1. Delete them: npx prisma studio (delete individually)`)
    console.log(`2. Update them with real prices using this script with --fix flag`)
    console.log(`3. Let the normal market rotation replace them`)
    
    // Check if --fix flag is provided
    if (process.argv.includes('--fix')) {
      console.log(`\n🔧 --fix flag detected, updating suspicious markets with real prices...`)
      
      for (const suspicious of suspiciousMarkets) {
        try {
          await prisma.market.update({
            where: { id: suspicious.id },
            data: { startPrice: suspicious.realPrice }
          })
          
          console.log(`✅ Updated ${suspicious.symbol} price from $${suspicious.marketPrice} to $${suspicious.realPrice}`)
          updatedCount++
        } catch (error) {
          console.error(`❌ Failed to update ${suspicious.symbol}:`, error.message)
        }
      }
      
      console.log(`\n✅ Updated ${updatedCount} markets with real prices`)
    }
  } else {
    console.log(`\n✅ All markets appear to have realistic prices!`)
  }
}

main()
  .catch((e) => {
    console.error('❌ Cleanup failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
