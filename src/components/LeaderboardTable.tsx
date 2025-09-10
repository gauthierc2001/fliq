'use client'

import Image from 'next/image'
import { Crown, Medal, Award, Trophy } from 'lucide-react'

interface LeaderboardEntry {
  rank: number
  wallet: string
  balance: number
  totalPnL: number
  username?: string
  avatar?: string
}

interface LeaderboardTableProps {
  leaderboard: LeaderboardEntry[]
}

export default function LeaderboardTable({ leaderboard }: LeaderboardTableProps) {
  const getPnLColor = (pnl: number) => {
    if (pnl === 0) return 'text-brand-gray'
    return pnl > 0 ? 'text-brand-green' : 'text-brand-black'
  }

  const formatPnL = (pnl: number) => {
    if (pnl === 0) return '0'
    return `${pnl > 0 ? '+' : ''}${pnl.toLocaleString()}`
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />
    if (rank === 3) return <Award className="w-6 h-6 text-orange-400" />
    return <span className="text-lg font-bold text-brand-gray">{rank}</span>
  }

  if (leaderboard.length === 0) {
    return (
      <div className="text-center py-12">
        <Trophy className="w-16 h-16 text-brand-green mx-auto mb-4" />
        <div className="text-lg font-semibold text-brand-gray mb-2">No rankings yet</div>
        <div className="text-sm text-brand-lightGray">Be the first to start predicting!</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-brand-border overflow-hidden">
      <div className="px-6 py-4 border-b border-brand-border">
        <h2 className="text-lg font-semibold text-brand-black">Top Predictors</h2>
      </div>
      
      <div className="divide-y divide-brand-border">
        {leaderboard.map((entry) => (
          <div key={entry.rank} className="px-6 py-4 flex items-center justify-between hover:bg-brand-bgGray transition-colors">
            <div className="flex items-center space-x-4">
              <div className="w-8 flex justify-center">
                {getRankBadge(entry.rank)}
              </div>
              <div className="flex items-center space-x-3">
                {/* User Avatar */}
                {entry.avatar ? (
                  <Image 
                    src={entry.avatar} 
                    alt={`${entry.username || entry.wallet.slice(0, 4)}'s avatar`}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full border border-brand-green object-cover"
                    unoptimized
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const fallback = target.nextElementSibling as HTMLElement
                      if (fallback) fallback.style.display = 'flex'
                    }}
                  />
                ) : null}
                <div className={`w-10 h-10 bg-brand-green rounded-full flex items-center justify-center ${
                  entry.avatar ? 'hidden' : 'flex'
                }`}>
                  <span className="text-xs font-bold text-white">
                    {entry.username 
                      ? entry.username.slice(0, 2).toUpperCase()
                      : entry.wallet.slice(0, 2).toUpperCase()
                    }
                  </span>
                </div>
                
                {/* User Info */}
                <div>
                  <div className="font-medium text-brand-black">
                    {entry.username || entry.wallet.slice(0, 4)}
                  </div>
                  <div className="text-xs text-brand-gray font-mono">
                    {entry.wallet.slice(0, 6)}...{entry.wallet.slice(-4)}
                  </div>
                  <div className="text-sm text-brand-gray">
                    Rank #{entry.rank}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-semibold text-brand-black">
                {entry.balance.toLocaleString()} $FLIQ
              </div>
              <div className={`text-sm font-medium ${getPnLColor(entry.totalPnL)}`}>
                {formatPnL(entry.totalPnL)} P&L
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
