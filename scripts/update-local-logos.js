const fs = require('fs')
const path = require('path')

// Read our crypto assets configuration
const cryptoLogosPath = path.join(__dirname, '..', 'public', 'assets', 'logos', 'crypto-logos.json')
const cryptoLogos = JSON.parse(fs.readFileSync(cryptoLogosPath, 'utf8'))

const LOGOS_DIR = path.join(__dirname, '..', 'public', 'assets', 'logos')

console.log('🔍 Checking which logos are actually available locally...')

let updatedCount = 0
let totalAssets = 0

// Check each crypto asset
for (const [symbol, asset] of Object.entries(cryptoLogos)) {
  totalAssets++
  const logoFile = `${symbol}.png`
  const logoPath = path.join(LOGOS_DIR, logoFile)
  
  // Check if the logo file exists
  if (fs.existsSync(logoPath)) {
    if (!asset.hasLocalLogo) {
      console.log(`✅ Found local logo for ${asset.ticker}: ${logoFile}`)
      asset.hasLocalLogo = true
      asset.logoFile = logoFile
      updatedCount++
    } else {
      console.log(`⏭️  Already marked as local: ${asset.ticker}`)
    }
  } else {
    console.log(`❌ Missing logo file for ${asset.ticker}: ${logoFile}`)
    asset.hasLocalLogo = false
    asset.logoFile = null
  }
}

// Update the crypto-logos.json file
fs.writeFileSync(cryptoLogosPath, JSON.stringify(cryptoLogos, null, 2))

console.log('\n📊 Update Summary:')
console.log(`✅ Total assets: ${totalAssets}`)
console.log(`🔄 Updated to local: ${updatedCount}`)

// Count current status
const localCount = Object.values(cryptoLogos).filter(asset => asset.hasLocalLogo).length
const externalCount = totalAssets - localCount

console.log(`💾 Local logos: ${localCount}/${totalAssets}`)
console.log(`🌐 External fallbacks: ${externalCount}/${totalAssets}`)

console.log('\n📄 Updated crypto-logos.json successfully!')
console.log('🎉 All available local logos are now properly configured!')
