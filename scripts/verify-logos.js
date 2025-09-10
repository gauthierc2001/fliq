const fs = require('fs')
const path = require('path')

// Read our crypto assets configuration
const cryptoLogosPath = path.join(__dirname, '..', 'public', 'assets', 'logos', 'crypto-logos.json')
const cryptoLogos = JSON.parse(fs.readFileSync(cryptoLogosPath, 'utf8'))

const LOGOS_DIR = path.join(__dirname, '..', 'public', 'assets', 'logos')

console.log('🔍 Verifying crypto logo configuration...\n')

let localCount = 0
let externalCount = 0
let missingCount = 0

// Check each crypto asset
for (const [symbol, asset] of Object.entries(cryptoLogos)) {
  const logoFile = `${symbol}.png`
  const logoPath = path.join(LOGOS_DIR, logoFile)
  const fileExists = fs.existsSync(logoPath)
  
  if (fileExists && asset.hasLocalLogo) {
    console.log(`✅ ${asset.ticker.padEnd(8)} - Local logo configured and file exists`)
    localCount++
  } else if (fileExists && !asset.hasLocalLogo) {
    console.log(`⚠️  ${asset.ticker.padEnd(8)} - File exists but not marked as local!`)
    missingCount++
  } else if (!fileExists && asset.hasLocalLogo) {
    console.log(`❌ ${asset.ticker.padEnd(8)} - Marked as local but file missing!`)
    missingCount++
  } else {
    console.log(`🌐 ${asset.ticker.padEnd(8)} - Using external fallback (no local file)`)
    externalCount++
  }
}

console.log('\n📊 Summary:')
console.log(`✅ Local logos working: ${localCount}`)
console.log(`🌐 External fallbacks: ${externalCount}`)
console.log(`⚠️  Configuration issues: ${missingCount}`)
console.log(`📄 Total assets: ${localCount + externalCount + missingCount}`)

if (missingCount === 0) {
  console.log('\n🎉 All logos are properly configured!')
} else {
  console.log('\n⚠️  Some configuration issues found - run update script to fix')
}
