const fs = require('fs')
const path = require('path')
const https = require('https')

// Read our crypto assets configuration
const cryptoLogosPath = path.join(__dirname, '..', 'public', 'assets', 'logos', 'crypto-logos.json')
const cryptoLogos = JSON.parse(fs.readFileSync(cryptoLogosPath, 'utf8'))

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

async function downloadLogoFromUrl(symbol, asset) {
  const filename = `${symbol}.png`
  const filepath = path.join(LOGOS_DIR, filename)
  
  // Skip if file already exists
  if (fs.existsSync(filepath)) {
    console.log(`⏭️  Logo already exists: ${asset.ticker}`)
    return { symbol, success: true, skipped: true }
  }
  
  try {
    console.log(`🔍 Downloading logo for ${asset.ticker} from fallback URL...`)
    
    await downloadImage(asset.fallbackUrl, filepath)
    console.log(`✅ Downloaded logo for ${asset.ticker}: ${filename}`)
    
    // Update the crypto-logos.json to mark this as having a local logo
    asset.hasLocalLogo = true
    asset.logoFile = filename
    
    return { symbol, success: true, skipped: false }
    
  } catch (error) {
    console.error(`❌ Failed to download logo for ${asset.ticker}:`, error.message)
    return { symbol, success: false, error: error.message }
  }
}

async function downloadAllRemainingLogos() {
  console.log('🚀 Starting download of remaining crypto logos...')
  console.log(`📁 Saving logos to: ${LOGOS_DIR}`)
  
  const symbols = Object.keys(cryptoLogos)
  const results = []
  
  // Process logos in smaller batches with longer delays to avoid issues
  const batchSize = 2
  for (let i = 0; i < symbols.length; i += batchSize) {
    const batch = symbols.slice(i, i + batchSize)
    console.log(`\n📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(symbols.length / batchSize)}`)
    
    const batchResults = await Promise.all(
      batch.map(symbol => downloadLogoFromUrl(symbol, cryptoLogos[symbol]))
    )
    
    results.push(...batchResults)
    
    // Longer delay between batches to be respectful
    if (i + batchSize < symbols.length) {
      console.log('⏳ Waiting 3 seconds between batches...')
      await new Promise(resolve => setTimeout(resolve, 3000))
    }
  }
  
  // Update the crypto-logos.json file with new local logo information
  fs.writeFileSync(cryptoLogosPath, JSON.stringify(cryptoLogos, null, 2))
  console.log(`\n📄 Updated crypto-logos.json with local logo information`)
  
  // Generate summary
  const successful = results.filter(r => r.success && !r.skipped)
  const skipped = results.filter(r => r.skipped)
  const failed = results.filter(r => !r.success)
  
  console.log('\n📊 Download Summary:')
  console.log(`✅ Successfully downloaded: ${successful.length}`)
  console.log(`⏭️  Already existed (skipped): ${skipped.length}`)
  console.log(`❌ Failed: ${failed.length}`)
  console.log(`📄 Total assets: ${symbols.length}`)
  
  if (failed.length > 0) {
    console.log('\n❌ Failed downloads:')
    failed.forEach(f => console.log(`  - ${cryptoLogos[f.symbol]?.ticker}: ${f.error}`))
  }
  
  console.log('\n🎉 Logo download process complete!')
  console.log(`💾 Local logos now available: ${successful.length + skipped.length}/${symbols.length}`)
}

// Run the download if this script is executed directly
if (require.main === module) {
  downloadAllRemainingLogos().catch(console.error)
}

module.exports = { downloadAllRemainingLogos }
