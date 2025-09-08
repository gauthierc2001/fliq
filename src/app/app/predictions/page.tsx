'use client'

import { useState, useEffect, useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useRouter } from 'next/navigation'
import SwipeDeck from '@/components/SwipeDeck'

interface Market {
  id: string
  symbol: string
  title: string
  durationMin: number
  startTime: string
  endTime: string
  startPrice: number
  yesBets: number
  noBets: number
  yesMultiplier: number
  noMultiplier: number
  yesShare: number
  timeLeft: number
}

interface User {
  id: string
  wallet: string
  balance: number
  totalPnL: number
}

export default function PredictionsPage() {
  const { connected } = useWallet()
  const router = useRouter()
  const [markets, setMarkets] = useState<Market[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSwipeLoading, setIsSwipeLoading] = useState(false)

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const { user } = await response.json()
        setUser(user)
      } else {
        router.push('/')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/')
    }
  }, [router])

  const fetchMarkets = useCallback(async () => {
    try {
      const response = await fetch('/api/markets/list')
      if (response.ok) {
        const { markets } = await response.json()
        setMarkets(markets)
      }
    } catch (error) {
      console.error('Failed to fetch markets:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (connected) {
      checkAuth()
    }
    
    fetchMarkets()
    
    // Set up intervals for real-time updates
    const marketInterval = setInterval(fetchMarkets, 10000) // Every 10 seconds
    
    return () => {
      clearInterval(marketInterval)
    }
  }, [connected, checkAuth, fetchMarkets])

  const handleSwipe = async (marketId: string, side: 'YES' | 'NO') => {
    if (!connected) {
      alert('Please connect your wallet to place bets!')
      return
    }
    
    if (!user || isSwipeLoading) return

    if (user.balance < 100) {
      alert('Insufficient balance! You need at least 100 $FLIQ to bet.')
      return
    }

    setIsSwipeLoading(true)
    
    try {
      const response = await fetch('/api/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ marketId, side }),
      })

      if (response.ok) {
        const { newBalance } = await response.json()
        setUser(prev => prev ? { ...prev, balance: newBalance } : null)
        
        // Refresh markets to update odds
        await fetchMarkets()
      } else {
        const { error } = await response.json()
        alert(error || 'Failed to place bet')
      }
    } catch (error) {
      console.error('Swipe error:', error)
      alert('Failed to place bet')
    } finally {
      setIsSwipeLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-fliq-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <div className="text-lg font-semibold text-fliq-gray">Loading markets...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Balance */}
      {user && (
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-fliq-dark mb-2">Predict & Earn</h1>
          <div className="bg-white rounded-lg shadow-sm border border-fliq-border p-4 max-w-sm mx-auto">
            <div className="text-2xl font-bold text-fliq-green">{user.balance} $FLIQ</div>
            <div className="text-sm text-fliq-gray">Available Balance</div>
            {user.totalPnL !== 0 && (
              <div className={`text-sm font-medium ${
                user.totalPnL > 0 ? 'text-fliq-green' : 'text-fliq-dark'
              }`}>
                {user.totalPnL > 0 ? '+' : ''}{user.totalPnL} Total P&L
              </div>
            )}
          </div>
        </div>
      )}

      {/* Wallet Connection Required */}
      {!connected && (
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-fliq-dark mb-4">Welcome to Fliq!</h1>
          <div className="bg-white rounded-lg shadow-sm border border-fliq-border p-6 max-w-md mx-auto">
            <div className="text-lg font-semibold text-fliq-dark mb-2">Connect Your Wallet</div>
            <p className="text-fliq-gray mb-4">To start predicting and earning, please connect your Solana wallet.</p>
            <div className="text-sm text-fliq-gray">
              You can explore the markets below, but you'll need to connect to place bets.
            </div>
          </div>
        </div>
      )}

      {/* Swipe Deck */}
      <div className="max-w-md mx-auto">
        <SwipeDeck 
          markets={markets} 
          onSwipe={handleSwipe}
          isLoading={isSwipeLoading}
        />
      </div>

      {/* Instructions */}
      <div className="mt-12 max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-fliq-border p-6">
          <h2 className="text-lg font-semibold mb-4 text-center text-fliq-dark">How to Play</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-fliq-bg-gray rounded-full flex items-center justify-center text-fliq-dark">
                ←
              </div>
              <div>
                <div className="font-medium text-fliq-dark">Swipe Left = NO</div>
                <div className="text-fliq-gray">Price will go down</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#57C84D] rounded-full flex items-center justify-center text-white">
                →
              </div>
              <div>
                <div className="font-medium text-fliq-dark">Swipe Right = YES</div>
                <div className="text-fliq-gray">Price will go up</div>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center text-xs text-[#B5B5B5]">
            Each bet costs 100 $FLIQ • Multipliers based on market sentiment
          </div>
        </div>
      </div>
    </div>
  )
}
