// Crypto asset management utility
// This file manages local crypto logos and fallback URLs

export interface CryptoAsset {
  name: string
  ticker: string
  symbol: string
  hasLocalLogo: boolean
  logoFile: string | null
  fallbackUrl: string
}

// Import the crypto logos data
import cryptoLogosData from '../../public/assets/logos/crypto-logos.json'

// Type assertion to ensure proper typing
const CRYPTO_ASSETS: Record<string, CryptoAsset> = cryptoLogosData as Record<string, CryptoAsset>

/**
 * Get the logo URL for a cryptocurrency symbol
 * Only uses local assets - no external fallbacks
 */
export function getCryptoLogo(symbol: string): string | null {
  const asset = CRYPTO_ASSETS[symbol]
  
  if (!asset) {
    // If we don't have data for this symbol, return null
    return null
  }
  
  // Only use local logo files - no external fallbacks
  if (asset.hasLocalLogo && asset.logoFile) {
    return `/assets/logos/${asset.logoFile}`
  }
  
  // If no local logo is available, return null instead of fallback
  return null
}

/**
 * Get crypto asset information by symbol
 */
export function getCryptoAsset(symbol: string): CryptoAsset | null {
  return CRYPTO_ASSETS[symbol] || null
}

/**
 * Get the display name for a cryptocurrency
 */
export function getCryptoName(symbol: string): string {
  const asset = CRYPTO_ASSETS[symbol]
  return asset?.name || symbol.toUpperCase()
}

/**
 * Get the ticker for a cryptocurrency
 */
export function getCryptoTicker(symbol: string): string {
  const asset = CRYPTO_ASSETS[symbol]
  return asset?.ticker || symbol.toUpperCase()
}

/**
 * Check if we have asset data for a symbol
 */
export function hasCryptoAsset(symbol: string): boolean {
  return symbol in CRYPTO_ASSETS
}

/**
 * Get all available crypto symbols
 */
export function getAllCryptoSymbols(): string[] {
  return Object.keys(CRYPTO_ASSETS)
}

/**
 * Generate a fallback logo URL for unknown cryptocurrencies
 */
export function generateFallbackLogo(symbol: string): string {
  // Use a generic crypto icon service or generate based on symbol
  const firstTwo = symbol.slice(0, 2).toUpperCase()
  // For now, return null to use the built-in fallback UI
  return `/assets/logos/fallback-${firstTwo}.png`
}
