import { PublicKey } from '@solana/web3.js'
import { sign } from 'tweetnacl'
import bs58 from 'bs58'

export function generateNonce(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}

export function createSignMessage(nonce: string): string {
  return `Sign this message to authenticate with Fliq: ${nonce}`
}

export function verifySignature(
  message: string,
  signature: string,
  publicKey: string
): boolean {
  try {
    const messageBytes = new TextEncoder().encode(message)
    const signatureBytes = bs58.decode(signature)
    const publicKeyBytes = new PublicKey(publicKey).toBytes()
    
    return sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes)
  } catch {
    return false
  }
}
