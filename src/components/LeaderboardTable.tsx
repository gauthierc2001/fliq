'use client'

interface LeaderboardEntry {
  rank: number
  wallet: string
  balance: number
  totalPnL: number
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
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return rank.toString()
  }

  if (leaderboard.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">🏆</div>
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
              <div className="text-2xl w-8 text-center">
                {getRankBadge(entry.rank)}
              </div>
              <div>
                <div className="font-medium text-brand-black font-mono">
                  {entry.wallet}
                </div>
                <div className="text-sm text-brand-gray">
                  Rank #{entry.rank}
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
