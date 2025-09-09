'use client'

import { useState, useEffect, useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import UserHistory from '@/components/UserHistory'
import { User, Edit3, Save, X } from 'lucide-react'

interface UserData {
  id: string
  wallet: string
  balance: number
  totalPnL: number
  username?: string
  avatar?: string
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
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({ username: '', avatar: '' })

  const fetchUserData = useCallback(async () => {
    try {
      const response = await fetch('/api/user/history')
      if (response.ok) {
        const { user, history } = await response.json()
        setUser(user)
        setHistory(history)
        setEditForm({ username: user.username || '', avatar: user.avatar || '' })
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

  const handleProfileUpdate = useCallback(async () => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      })
      
      if (response.ok) {
        const { user: updatedUser } = await response.json()
        setUser(updatedUser)
        setIsEditing(false)
      } else {
        console.error('Failed to update profile')
      }
    } catch (error) {
      console.error('Profile update error:', error)
    }
  }, [editForm])

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
          <div className="bg-white rounded-lg shadow-sm border border-brand-border p-8 max-w-md mx-auto">
            <div className="text-lg font-semibold text-red-500 mb-2">Failed to load profile</div>
            <p className="text-brand-gray mb-4">There was an error loading your profile data.</p>
            <button
              onClick={fetchUserData}
              className="px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-brand-greenDark transition-colors"
            >
              Retry
            </button>
          </div>
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
            {user.avatar ? (
              <Image 
                src={user.avatar} 
                alt="Profile"
                width={80}
                height={80}
                className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-brand-green object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const fallback = target.nextElementSibling as HTMLElement
                  if (fallback) fallback.style.display = 'flex'
                }}
              />
            ) : null}
            <div className={`w-20 h-20 bg-brand-green rounded-full mx-auto mb-4 flex items-center justify-center ${
              user.avatar ? 'hidden' : 'flex'
            }`}>
              <span className="text-2xl font-bold text-white">
                {user.username 
                  ? user.username.slice(0, 2).toUpperCase()
                  : user.wallet.slice(0, 2).toUpperCase()
                }
              </span>
            </div>
            
            {/* User Info */}
            <div className="mb-4">
              <div className="text-lg font-bold text-brand-black">
                {user.username || `${user.wallet.slice(0, 4)}...${user.wallet.slice(-4)}`}
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center justify-center space-x-2 px-3 py-1 text-sm text-brand-green hover:bg-brand-bgGray rounded-lg transition-colors mx-auto mt-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            </div>

            {/* Edit Form */}
            {isEditing && (
              <div className="space-y-4 p-4 bg-brand-bgGray rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-brand-black mb-1">Username</label>
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                    placeholder={`${user.wallet.slice(0, 4)}...${user.wallet.slice(-4)}`}
                    className="w-full px-3 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-black mb-1">Avatar URL</label>
                  <input
                    type="url"
                    value={editForm.avatar}
                    onChange={(e) => setEditForm(prev => ({ ...prev, avatar: e.target.value }))}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full px-3 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleProfileUpdate}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-brand-greenDark transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center justify-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
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
