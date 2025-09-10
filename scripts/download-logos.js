const fs = require('fs')
const path = require('path')
const https = require('https')

// Comprehensive list of 30 major cryptocurrencies with their CoinGecko IDs
const CRYPTO_LOGOS = [
  // Major cryptocurrencies
  { symbol: 'bitcoin', name: 'Bitcoin', ticker: 'BTC', coinGeckoId: 'bitcoin' },
  { symbol: 'ethereum', name: 'Ethereum', ticker: 'ETH', coinGeckoId: 'ethereum' },
  { symbol: 'solana', name: 'Solana', ticker: 'SOL', coinGeckoId: 'solana' },
  { symbol: 'cardano', name: 'Cardano', ticker: 'ADA', coinGeckoId: 'cardano' },
  { symbol: 'avalanche-2', name: 'Avalanche', ticker: 'AVAX', coinGeckoId: 'avalanche-2' },
  { symbol: 'chainlink', name: 'Chainlink', ticker: 'LINK', coinGeckoId: 'chainlink' },
  { symbol: 'binancecoin', name: 'BNB', ticker: 'BNB', coinGeckoId: 'binancecoin' },
  { symbol: 'polygon', name: 'Polygon', ticker: 'MATIC', coinGeckoId: 'matic-network' },
  
  // Solana ecosystem & memecoins
  { symbol: 'dogwifcoin', name: 'Dogwifhat', ticker: 'WIF', coinGeckoId: 'dogwifcoin' },
  { symbol: 'bonk', name: 'Bonk', ticker: 'BONK', coinGeckoId: 'bonk' },
  { symbol: 'book-of-meme', name: 'Book of Meme', ticker: 'BOME', coinGeckoId: 'book-of-meme' },
  { symbol: 'jeo-boden', name: 'Jeo Boden', ticker: 'BODEN', coinGeckoId: 'jeo-boden' },
  { symbol: 'cat-in-a-dogs-world', name: 'MEW', ticker: 'MEW', coinGeckoId: 'cat-in-a-dogs-world' },
  { symbol: 'popcat', name: 'Popcat', ticker: 'POPCAT', coinGeckoId: 'popcat' },
  { symbol: 'jupiter-exchange-solana', name: 'Jupiter', ticker: 'JUP', coinGeckoId: 'jupiter-exchange-solana' },
  { symbol: 'wen-4', name: 'Wen', ticker: 'WEN', coinGeckoId: 'wen-4' },
  
  // Popular memecoins
  { symbol: 'pepe', name: 'Pepe', ticker: 'PEPE', coinGeckoId: 'pepe' },
  { symbol: 'dogecoin', name: 'Dogecoin', ticker: 'DOGE', coinGeckoId: 'dogecoin' },
  { symbol: 'shiba-inu', name: 'Shiba Inu', ticker: 'SHIB', coinGeckoId: 'shiba-inu' },
  { symbol: 'floki', name: 'Floki', ticker: 'FLOKI', coinGeckoId: 'floki' },
  
  // Additional trending coins
  { symbol: 'retardio', name: 'Retardio', ticker: 'RETARDIO', coinGeckoId: 'retardio' },
  { symbol: 'moo-deng', name: 'Moo Deng', ticker: 'MOODENG', coinGeckoId: 'moo-deng' },
  { symbol: 'fwog', name: 'Fwog', ticker: 'FWOG', coinGeckoId: 'fwog' },
  { symbol: 'smoking-chicken-fish', name: 'SCF', ticker: 'SCF', coinGeckoId: 'smoking-chicken-fish' },
  { symbol: 'gigachad', name: 'Gigachad', ticker: 'GIGA', coinGeckoId: 'gigachad' },
  { symbol: 'mother-iggy', name: 'Mother Iggy', ticker: 'MOTHER', coinGeckoId: 'mother-iggy' },
  { symbol: 'goatseus-maximus', name: 'Goatseus Maximus', ticker: 'GOAT', coinGeckoId: 'goatseus-maximus' },
  { symbol: 'first-convicted-raccon', name: 'First Convicted Racoon', ticker: 'FRED', coinGeckoId: 'first-convicted-raccon' },
  { symbol: 'peanut-the-squirrel', name: 'Peanut the Squirrel', ticker: 'PNUT', coinGeckoId: 'peanut-the-squirrel' },
  { symbol: 'act-i-the-ai-prophecy', name: 'ACT I', ticker: 'ACT', coinGeckoId: 'act-i-the-ai-prophecy' }
]

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3'
const LOGOS_DIR = path.join(__dirname, '..', 'public', 'assets', 'logos')

// Ensure logos directory exists
if (!fs.existsSync(LOGOS_DIR)) {
  fs.mkdirSync(LOGOS_DIR, { recursive: true })
}

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath)
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`))
        return
      }
      
      response.pipe(file)
      
      file.on('finish', () => {
        file.close()
        resolve()
      })
      
      file.on('error', (err) => {
        fs.unlink(filepath, () => {}) // Delete the file on error
        reject(err)
      })
    }).on('error', (err) => {
      reject(err)
    })
  })
}

async function fetchCoinLogo(coin) {
  try {
    console.log(`🔍 Fetching logo for ${coin.ticker} (${coin.coinGeckoId})...`)
    
    const response = await fetch(
      `${COINGECKO_BASE_URL}/coins/${coin.coinGeckoId}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false`
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    const logoUrl = data.image?.large || data.image?.small || data.image?.thumb
    
    if (!logoUrl) {
      throw new Error('No logo URL found')
    }
    
    // Download and save the logo
    const filename = `${coin.symbol}.png`
    const filepath = path.join(LOGOS_DIR, filename)
    
    await downloadImage(logoUrl, filepath)
    console.log(`✅ Downloaded logo for ${coin.ticker}: ${filename}`)
    
    return {
      ...coin,
      logoFile: filename,
      success: true
    }
    
  } catch (error) {
    console.error(`❌ Failed to fetch logo for ${coin.ticker}:`, error.message)
    return {
      ...coin,
      success: false,
      error: error.message
    }
  }
}

async function downloadAllLogos() {
  console.log('🚀 Starting crypto logo download...')
  console.log(`📁 Saving logos to: ${LOGOS_DIR}`)
  
  const results = []
  
  // Process logos in batches to avoid rate limiting
  const batchSize = 3
  for (let i = 0; i < CRYPTO_LOGOS.length; i += batchSize) {
    const batch = CRYPTO_LOGOS.slice(i, i + batchSize)
    console.log(`\n📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(CRYPTO_LOGOS.length / batchSize)}`)
    
    const batchResults = await Promise.all(
      batch.map(coin => fetchCoinLogo(coin))
    )
    
    results.push(...batchResults)
    
    // Rate limiting delay between batches
    if (i + batchSize < CRYPTO_LOGOS.length) {
      console.log('⏳ Waiting 2 seconds to avoid rate limiting...')
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }
  
  // Generate summary
  const successful = results.filter(r => r.success)
  const failed = results.filter(r => !r.success)
  
  console.log('\n📊 Download Summary:')
  console.log(`✅ Successful: ${successful.length}/${CRYPTO_LOGOS.length}`)
  console.log(`❌ Failed: ${failed.length}/${CRYPTO_LOGOS.length}`)
  
  if (failed.length > 0) {
    console.log('\n❌ Failed downloads:')
    failed.forEach(f => console.log(`  - ${f.ticker}: ${f.error}`))
  }
  
  // Create a JSON file with the mapping
  const logoMapping = {}
  successful.forEach(coin => {
    logoMapping[coin.symbol] = {
      name: coin.name,
      ticker: coin.ticker,
      logoFile: coin.logoFile
    }
  })
  
  const mappingPath = path.join(LOGOS_DIR, 'mapping.json')
  fs.writeFileSync(mappingPath, JSON.stringify(logoMapping, null, 2))
  console.log(`\n📄 Created logo mapping: ${mappingPath}`)
  
  console.log('\n🎉 Logo download complete!')
}

// Run the download if this script is executed directly
if (require.main === module) {
  downloadAllLogos().catch(console.error)
}

module.exports = { downloadAllLogos, CRYPTO_LOGOS }
