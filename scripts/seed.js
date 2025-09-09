const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding initial markets...')
  
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
        // Get a mock price for seeding (in production, this would fetch real prices)
        const mockPrice = Math.random() * 50000 + 20000 // Random price between 20k-70k
        
        await prisma.market.create({
          data: {
            symbol: coin.symbol,
            title: `${coin.ticker} ↑ in ${duration}m?`,
            durationMin: duration,
            startTime,
            endTime,
            startPrice: mockPrice,
            logoUrl: null // Will use fallback logo in UI
          }
        })
        
        console.log(`📊 Created ${coin.ticker} ${duration}m market`)
      }
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
