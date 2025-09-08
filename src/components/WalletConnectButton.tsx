'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useEffect, useState, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import bs58 from 'bs58'

interface User {
  id: string
  wallet: string
  balance: number
  totalPnL: number
}

export default function WalletConnectButton() {
  const { publicKey, signMessage, connected } = useWallet()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleAuth = useCallback(async () => {
    if (!publicKey || !signMessage) return

    setIsLoading(true)
    try {
      const wallet = publicKey.toString()

      // Get nonce
      const nonceResponse = await fetch('/api/auth/nonce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet }),
      })

      if (!nonceResponse.ok) throw new Error('Failed to get nonce')

      const { nonce } = await nonceResponse.json()

      // Sign message
      const message = `Sign this message to authenticate with Fliq: ${nonce}`
      const encodedMessage = new TextEncoder().encode(message)
      const signature = await signMessage(encodedMessage)

      // Verify signature
      const verifyResponse = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet,
          signature: bs58.encode(signature),
          nonce,
        }),
      })

      if (!verifyResponse.ok) throw new Error('Failed to verify signature')

      const { user } = await verifyResponse.json()
      setUser(user)
      
      // Only redirect if we're on the landing page
      if (pathname === '/') {
        router.push('/app/predictions')
      }
      // If already in the app, just stay there and update the user state
    } catch (error) {
      console.error('Auth error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [publicKey, signMessage, router, pathname])

  useEffect(() => {
    if (connected && publicKey && signMessage && !user) {
      handleAuth()
    } else if (!connected && user) {
      // Wallet disconnected - clear user state but DON'T redirect
      setUser(null)
    }
  }, [connected, publicKey, signMessage, user, handleAuth])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    router.push('/')
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <div className="text-sm">
          <div className="font-medium">{user.balance} $FLIQ</div>
          <div className="text-gray-500 text-xs">
            {user.wallet.slice(0, 4)}...{user.wallet.slice(-4)}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    )
  }

  return (
    <div className="relative">
      <WalletMultiButton />
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}
