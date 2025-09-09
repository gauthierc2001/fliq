const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding initial markets...')
  
  const coins = [
    { symbol: 'bitcoin', name: 'Bitcoin', ticker: 'BTC' },
    { symbol: 'ethereum', name: 'Ethereum', ticker: 'ETH' },
    { symbol: 'solana', name: 'Solana', ticker: 'SOL' }
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
            startPrice: mockPrice
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
