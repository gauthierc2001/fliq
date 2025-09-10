// Test script to verify crypto asset system
const { getCryptoLogo, getCryptoTicker, getCryptoName, hasCryptoAsset, getAllCryptoSymbols } = require('../src/lib/cryptoAssets.ts')

console.log('🧪 Testing Crypto Asset System\n')

// Test all available symbols
const symbols = getAllCryptoSymbols()
console.log(`📊 Total crypto assets available: ${symbols.length}`)

// Test specific coins
const testCoins = ['bitcoin', 'ethereum', 'solana', 'bonk', 'dogwifcoin', 'popcat']

console.log('\n🔍 Testing specific cryptocurrencies:')
testCoins.forEach(symbol => {
  const hasAsset = hasCryptoAsset(symbol)
  const logo = getCryptoLogo(symbol)
  const ticker = getCryptoTicker(symbol)
  const name = getCryptoName(symbol)
  
  console.log(`\n${ticker} (${symbol}):`)
  console.log(`  Name: ${name}`)
  console.log(`  Has Asset: ${hasAsset}`)
  console.log(`  Logo: ${logo || 'No logo'}`)
  console.log(`  Type: ${logo?.startsWith('/assets') ? 'Local' : logo?.startsWith('http') ? 'External' : 'None'}`)
})

// Count local vs external logos
let localCount = 0
let externalCount = 0
let noLogoCount = 0

symbols.forEach(symbol => {
  const logo = getCryptoLogo(symbol)
  if (!logo) {
    noLogoCount++
  } else if (logo.startsWith('/assets')) {
    localCount++
  } else {
    externalCount++
  }
})

console.log('\n📈 Logo Summary:')
console.log(`  Local logos: ${localCount}`)
console.log(`  External (CoinGecko) fallbacks: ${externalCount}`)
console.log(`  No logos: ${noLogoCount}`)

console.log('\n✅ Crypto asset system test complete!')

module.exports = { testCryptoAssets: () => console.log('Test function available') }
