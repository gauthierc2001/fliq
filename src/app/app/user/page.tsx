'use client'

import { useState, useEffect, useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useRouter } from 'next/navigation'
import UserHistory from '@/components/UserHistory'

interface User {
  id: string
  wallet: string
  balance: number
  totalPnL: number
}

interface Swipe {
  id: string
  side: 'YES' | 'NO'
  stake: number
  payoutMult: number
  settled: boolean
  win: boolean | null
  pnl: number | null
  createdAt: string
  market: {
    title: string
    symbol: string
    resolved: boolean
    outcome: 'YES' | 'NO' | 'PUSH' | null
  }
}

export default function UserPage() {
  const { connected } = useWallet()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [history, setHistory] = useState<Swipe[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchUserData = useCallback(async () => {
    try {
      const response = await fetch('/api/user/history')
      if (response.ok) {
        const { user, history } = await response.json()
        setUser(user)
        setHistory(history)
      } else {
        router.push('/')
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error)
      router.push('/')
    } finally {
      setIsLoading(false)
    }
  }, [router])

  useEffect(() => {
    if (!connected) {
      router.push('/')
      return
    }
    
    fetchUserData()
  }, [connected, fetchUserData, router])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <div className="text-lg font-semibold text-gray-600">Loading profile...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-600">Failed to load profile</div>
        </div>
      </div>
    )
  }

  const winRate = history.length > 0 
    ? (history.filter(h => h.win === true).length / history.filter(h => h.settled).length * 100) || 0
    : 0

  const totalBets = history.length
  const settledBets = history.filter(h => h.settled).length
  const pendingBets = totalBets - settledBets

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Profile Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Profile</h1>
        
        {/* Wallet Display */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 max-w-md mx-auto">
          <div className="text-lg font-mono text-gray-600 mb-2">
            {user.wallet.slice(0, 8)}...{user.wallet.slice(-8)}
          </div>
          <div className="text-xs text-gray-500">Connected Wallet</div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-purple-600">{user.balance}</div>
            <div className="text-sm text-gray-500">$FLIQ Balance</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className={`text-2xl font-bold ${
              user.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {user.totalPnL >= 0 ? '+' : ''}{user.totalPnL}
            </div>
            <div className="text-sm text-gray-500">Total P&L</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-blue-600">{winRate.toFixed(1)}%</div>
            <div className="text-sm text-gray-500">Win Rate</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-gray-900">{totalBets}</div>
            <div className="text-sm text-gray-500">Total Bets</div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-lg font-semibold text-yellow-600">{pendingBets}</div>
            <div className="text-sm text-gray-500">Pending</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-lg font-semibold text-gray-600">{settledBets}</div>
            <div className="text-sm text-gray-500">Settled</div>
          </div>
        </div>
      </div>

      {/* Betting History */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Betting History</h2>
        <UserHistory history={history} />
      </div>

      {/* Quick Actions */}
      <div className="mt-12 text-center">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => router.push('/app/predictions')}
              className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
            >
              Start Predicting
            </button>
            <button
              onClick={() => router.push('/app/leaderboard')}
              className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              View Leaderboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
