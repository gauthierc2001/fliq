'use client'

import { useState, useEffect, useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import UserHistory from '@/components/UserHistory'
import { User, Twitter } from 'lucide-react'

interface UserData {
  id: string
  wallet: string
  balance: number
  totalPnL: number
  twitterHandle?: string
  twitterName?: string
  twitterAvatar?: string
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
  const [user, setUser] = useState<UserData | null>(null)
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
        console.error('Failed to fetch user data - staying in app')
        // Don't redirect, just show error state
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error)
      // Don't redirect, just show error state
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (connected) {
      fetchUserData()
    } else {
      // If not connected, just show a message to connect wallet
      // Don't redirect - let them stay in the app
      setIsLoading(false)
    }
  }, [connected, fetchUserData])

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

  const handleTwitterConnect = async () => {
    try {
      const response = await fetch('/api/auth/twitter')
      if (response.ok) {
        const { authUrl } = await response.json()
        window.open(authUrl, 'twitter-auth', 'width=600,height=600')
      }
    } catch (error) {
      console.error('Twitter connect error:', error)
    }
  }

  if (!connected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-brand-black mb-6">User Profile</h1>
          <div className="bg-white rounded-lg shadow-sm border border-brand-border p-8 max-w-md mx-auto">
            <div className="mb-6">
              <div className="w-20 h-20 bg-brand-bgGray rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="w-10 h-10 text-brand-gray" />
              </div>
              <div className="text-lg font-semibold text-brand-black mb-2">Connect Your Wallet</div>
              <p className="text-brand-gray mb-4">To view your profile and start predicting, please connect your Solana wallet.</p>
            </div>
            <div className="text-sm text-brand-gray">
              Use the wallet button in the top navigation to get started.
            </div>
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
        <h1 className="text-3xl font-bold text-brand-black mb-6">User Profile</h1>
        
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-brand-border p-8 max-w-md mx-auto mb-6">
          {/* Avatar Section */}
          <div className="mb-6">
            {user.twitterAvatar ? (
              <Image 
                src={user.twitterAvatar} 
                alt="Profile"
                width={80}
                height={80}
                className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-brand-green"
              />
            ) : (
              <div className="w-20 h-20 bg-brand-bgGray rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="w-10 h-10 text-brand-gray" />
              </div>
            )}
            
            {/* Twitter Info */}
            {user.twitterHandle ? (
              <div className="mb-4">
                <div className="text-lg font-bold text-brand-black">{user.twitterName}</div>
                <div className="text-brand-green font-medium">@{user.twitterHandle}</div>
              </div>
            ) : (
              <button
                onClick={handleTwitterConnect}
                className="mb-4 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto"
              >
                <Twitter className="w-4 h-4" />
                <span>Connect Twitter</span>
              </button>
            )}
          </div>

          {/* Wallet Info */}
          <div className="mb-6 p-4 bg-brand-bgGray rounded-xl">
            <div className="text-xs text-brand-gray uppercase tracking-wide mb-1">Wallet Address</div>
            <div className="text-sm text-brand-black font-mono">
              {user.wallet.slice(0, 8)}...{user.wallet.slice(-8)}
            </div>
          </div>

          {/* Balance & P&L */}
          <div className="space-y-4">
            <div>
              <div className="text-3xl font-bold text-brand-green mb-1">{user.balance} $FLIQ</div>
              <div className="text-sm text-brand-gray">Available Balance</div>
            </div>
            
            <div className={`text-xl font-semibold ${
              user.totalPnL >= 0 ? 'text-brand-green' : 'text-red-500'
            }`}>
              {user.totalPnL >= 0 ? '+' : ''}{user.totalPnL} $FLIQ
              <div className="text-sm text-brand-gray font-normal">Total P&L</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-[#E5E5E5] p-6">
            <div className="text-2xl font-bold text-[#57C84D]">{user.balance}</div>
            <div className="text-sm text-[#555555]">$FLIQ Balance</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-[#E5E5E5] p-6">
            <div className={`text-2xl font-bold ${
              user.totalPnL >= 0 ? 'text-[#57C84D]' : 'text-[#0F0F0F]'
            }`}>
              {user.totalPnL >= 0 ? '+' : ''}{user.totalPnL}
            </div>
            <div className="text-sm text-[#555555]">Total P&L</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-[#E5E5E5] p-6">
            <div className="text-2xl font-bold text-[#57C84D]">{winRate.toFixed(1)}%</div>
            <div className="text-sm text-[#555555]">Win Rate</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-[#E5E5E5] p-6">
            <div className="text-2xl font-bold text-[#0F0F0F]">{totalBets}</div>
            <div className="text-sm text-[#555555]">Total Bets</div>
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
        <h2 className="text-2xl font-bold text-[#0F0F0F] mb-6">Betting History</h2>
        <UserHistory history={history} />
      </div>

      {/* Quick Actions */}
      <div className="mt-12 text-center">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => router.push('/app/predictions')}
              className="px-6 py-3 bg-[#57C84D] text-white font-semibold rounded-lg hover:bg-[#4AB844] transition-colors"
            >
              Start Predicting
            </button>
            <button
              onClick={() => router.push('/app/leaderboard')}
              className="px-6 py-3 bg-[#F5F5F5] text-[#0F0F0F] font-semibold rounded-lg hover:bg-[#E5E5E5] transition-colors border border-[#E5E5E5]"
            >
              View Leaderboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
