'use client'

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

interface UserHistoryProps {
  history: Swipe[]
}

export default function UserHistory({ history }: UserHistoryProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (swipe: Swipe) => {
    if (!swipe.settled) {
      return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Pending</span>
    }
    
    if (swipe.market.outcome === 'PUSH') {
      return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">Push</span>
    }
    
    if (swipe.win) {
      return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Won</span>
    }
    
    return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Lost</span>
  }

  const getPnLColor = (pnl: number | null) => {
    if (pnl === null || pnl === 0) return 'text-gray-600'
    return pnl > 0 ? 'text-green-600' : 'text-red-600'
  }

  const formatPnL = (pnl: number | null) => {
    if (pnl === null) return '-'
    if (pnl === 0) return '0'
    return `${pnl > 0 ? '+' : ''}${pnl}`
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">📊</div>
        <div className="text-lg font-semibold text-gray-600 mb-2">No betting history</div>
        <div className="text-sm text-gray-500">Start predicting to see your results here!</div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {history.map((swipe) => (
        <div key={swipe.id} className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium text-gray-900">{swipe.market.title}</h3>
              <div className="text-sm text-gray-500">{formatDate(swipe.createdAt)}</div>
            </div>
            <div className="text-right">
              {getStatusBadge(swipe)}
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-gray-500">Bet</div>
              <div className={`font-medium ${
                swipe.side === 'YES' ? 'text-green-600' : 'text-red-600'
              }`}>
                {swipe.side}
              </div>
            </div>
            
            <div>
              <div className="text-gray-500">Stake</div>
              <div className="font-medium">{swipe.stake} $FLIQ</div>
            </div>
            
            <div>
              <div className="text-gray-500">Odds</div>
              <div className="font-medium">{swipe.payoutMult.toFixed(2)}x</div>
            </div>
            
            <div>
              <div className="text-gray-500">P&L</div>
              <div className={`font-medium ${getPnLColor(swipe.pnl)}`}>
                {formatPnL(swipe.pnl)} $FLIQ
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
