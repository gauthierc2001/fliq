'use client'

import { useState, useEffect } from 'react'
import LeaderboardTable from '@/components/LeaderboardTable'

interface LeaderboardEntry {
  rank: number
  wallet: string
  balance: number
  totalPnL: number
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
    
    // Refresh leaderboard every 30 seconds
    const interval = setInterval(fetchLeaderboard, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard')
      if (response.ok) {
        const { leaderboard } = await response.json()
        setLeaderboard(leaderboard)
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <div className="text-lg font-semibold text-gray-600">Loading leaderboard...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#0F0F0F] mb-2">Leaderboard</h1>
        <p className="text-[#555555]">Top predictors ranked by total P&L and balance</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#57C84D] rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center">
            <div className="text-3xl mr-4">🥇</div>
            <div>
              <div className="text-lg font-semibold">Champion</div>
              <div className="text-white/90">
                {leaderboard[0] ? leaderboard[0].wallet : 'No champion yet'}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-[#0F0F0F] rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center">
            <div className="text-3xl mr-4">👥</div>
            <div>
              <div className="text-lg font-semibold">Total Players</div>
              <div className="text-white/90">{leaderboard.length} active</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-[#E5E5E5] rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">💰</div>
            <div>
              <div className="text-lg font-semibold text-[#0F0F0F]">Highest P&L</div>
              <div className="text-[#57C84D]">
                {leaderboard[0] ? `${leaderboard[0].totalPnL > 0 ? '+' : ''}${leaderboard[0].totalPnL}` : '0'} $FLIQ
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <LeaderboardTable leaderboard={leaderboard} />

      {/* Footer */}
      <div className="mt-12 text-center">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-2">Want to climb the ranks?</h3>
          <p className="text-gray-600 mb-4">
            Start predicting to earn your spot on the leaderboard!
          </p>
          <a
            href="/app/predictions"
            className="inline-block px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
          >
            Start Predicting
          </a>
        </div>
      </div>

      {/* How Rankings Work */}
      <div className="mt-8">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">How Rankings Work</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Primary Ranking: Total P&L</h4>
              <p className="text-gray-600">
                Players are ranked primarily by their total profit/loss from all settled bets.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Secondary Ranking: Current Balance</h4>
              <p className="text-gray-600">
                In case of tied P&L, players with higher current balance rank higher.
              </p>
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500 text-center">
            Rankings update in real-time as markets resolve • Wallet addresses are partially hidden for privacy
          </div>
        </div>
      </div>
    </div>
  )
}
