'use client'

import { useState, useEffect, useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
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
  username?: string
  avatar?: string
}

export default function PredictionsPage() {
  const { connected } = useWallet()
  const [markets, setMarkets] = useState<Market[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSwipeLoading, setIsSwipeLoading] = useState(false)
  const [marketError, setMarketError] = useState<string | null>(null)
  const [isGeneratingMarkets, setIsGeneratingMarkets] = useState(false)
  const [wagerAmount, setWagerAmount] = useState(100) // Default wager amount
  const [tempWagerInput, setTempWagerInput] = useState('100') // For input field

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const { user } = await response.json()
        setUser(user)
      } else {
        console.error('Auth check failed - staying in app')
        // Don't redirect, just clear user state
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      // Don't redirect, just clear user state
      setUser(null)
    }
  }, [])

  const fetchMarkets = useCallback(async () => {
    try {
      setMarketError(null)
      
      const response = await fetch('/api/markets/list')
      if (response.ok) {
        const { markets } = await response.json()
        
        // If no markets available, generate some
        if (markets.length === 0) {
          setIsGeneratingMarkets(true)
          
          try {
            const generateResponse = await fetch('/api/markets/generate', { method: 'POST' })
            if (generateResponse.ok) {
              const generationResult = await generateResponse.json()
              
              // Show warning if using fallback data
              if (generationResult.warning) {
                setMarketError(generationResult.warning)
              }
              
              // Fetch markets again after generation
              const retryResponse = await fetch('/api/markets/list')
              if (retryResponse.ok) {
                const { markets: newMarkets } = await retryResponse.json()
                setMarkets(newMarkets)
              } else {
                throw new Error('Failed to fetch markets after generation')
              }
            } else {
              throw new Error('Failed to generate markets')
            }
          } finally {
            setIsGeneratingMarkets(false)
          }
        } else {
          setMarkets(markets)
        }
      } else {
        throw new Error(`API error: ${response.status}`)
      }
    } catch (error) {
      console.error('Failed to fetch markets:', error)
      setMarketError(error instanceof Error ? error.message : 'Failed to load markets')
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

    if (user.balance < wagerAmount) {
      alert(`Insufficient balance! You need at least ${wagerAmount} $FLIQ to bet.`)
      return
    }

    setIsSwipeLoading(true)
    
    try {
      const response = await fetch('/api/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ marketId, side, stake: wagerAmount }),
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

  const handleSkip = () => {
    // Skip functionality handled in SwipeDeck component
  }

  const handleSetWager = () => {
    const amount = parseInt(tempWagerInput)
    if (isNaN(amount) || amount < 1 || amount > 100000) {
      alert('Please enter a valid wager amount between 1 and 100,000 FLIQ')
      return
    }
    
    if (user && amount > user.balance) {
      alert(`You don't have enough balance. Your current balance is ${user.balance} FLIQ`)
      return
    }
    
    setWagerAmount(amount)
    alert(`Wager amount set to ${amount} FLIQ`)
  }

  if (isLoading || isGeneratingMarkets) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-brand-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <div className="text-lg font-semibold text-brand-gray">
              {isGeneratingMarkets ? 'Generating live markets...' : 'Loading markets...'}
            </div>
            {isGeneratingMarkets && (
              <div className="text-sm text-brand-lightGray mt-2">
                Fetching live crypto prices from CoinGecko
              </div>
            )}
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

      {/* Wager Amount Input */}
      {user && (
        <div className="max-w-sm mx-auto mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-fliq-border p-4">
            <h3 className="text-lg font-semibold text-fliq-dark mb-3 text-center">Set Wager Amount</h3>
            <div className="flex space-x-2">
              <input
                type="number"
                value={tempWagerInput}
                onChange={(e) => setTempWagerInput(e.target.value)}
                min="1"
                max="100000"
                placeholder="Enter amount"
                className="flex-1 px-3 py-2 border border-fliq-border rounded-lg focus:outline-none focus:ring-2 focus:ring-fliq-green text-center"
              />
              <button
                onClick={handleSetWager}
                className="px-4 py-2 bg-fliq-green text-white font-semibold rounded-lg hover:bg-fliq-green-dark transition-colors"
              >
                Set
              </button>
            </div>
            <div className="text-center mt-2">
              <div className="text-sm text-fliq-gray">
                Current wager: <span className="font-bold text-fliq-dark">{wagerAmount} $FLIQ</span>
              </div>
              <div className="text-xs text-fliq-gray">
                Range: 1 - 100,000 FLIQ
              </div>
            </div>
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
              You can explore the markets below, but you&apos;ll need to connect to place bets.
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {marketError && (
        <div className="max-w-md mx-auto mb-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="text-yellow-600 text-sm">⚠️</div>
              <div className="text-sm text-yellow-800">{marketError}</div>
            </div>
            <button
              onClick={() => {
                setMarketError(null)
                fetchMarkets()
              }}
              className="mt-2 text-xs text-yellow-700 hover:text-yellow-900 underline"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Swipe Deck */}
      <div className="max-w-md mx-auto">
        <SwipeDeck 
          markets={markets} 
          onSwipe={handleSwipe}
          onSkip={handleSkip}
          isLoading={isSwipeLoading}
          wagerAmount={wagerAmount}
        />
      </div>

      {/* Instructions */}
      <div className="mt-12 max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-fliq-border p-6">
          <h2 className="text-lg font-semibold mb-4 text-center text-fliq-dark">How to Play</h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white">
                ←
              </div>
              <div>
                <div className="font-medium text-fliq-dark">Swipe Left = NO</div>
                <div className="text-fliq-gray">Price will go down</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                ↑
              </div>
              <div>
                <div className="font-medium text-fliq-dark">Swipe Up = SKIP</div>
                <div className="text-fliq-gray">Skip this market</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-brand-green rounded-full flex items-center justify-center text-white">
                →
              </div>
              <div>
                <div className="font-medium text-fliq-dark">Swipe Right = YES</div>
                <div className="text-fliq-gray">Price will go up</div>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center text-xs text-[#B5B5B5]">
            Each bet costs {wagerAmount} $FLIQ • Multipliers based on market sentiment
          </div>
        </div>
      </div>
    </div>
  )
}
