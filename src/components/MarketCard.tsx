'use client'

import { useState, useEffect } from 'react'

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

interface MarketCardProps {
  market: Market
  onSwipe?: (marketId: string, side: 'YES' | 'NO') => void
}

export default function MarketCard({ market, onSwipe }: MarketCardProps) {
  const [timeLeft, setTimeLeft] = useState(market.timeLeft)

  useEffect(() => {
    setTimeLeft(market.timeLeft)
  }, [market.timeLeft])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1000))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const yesPercentage = Math.round(market.yesShare * 100)
  const noPercentage = 100 - yesPercentage

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-fliq-border p-6 w-full max-w-sm mx-auto hover:shadow-xl transition-shadow">
      {/* Header */}
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-fliq-dark">{market.title}</h3>
        <div className="text-sm text-fliq-dark mt-1">
          Starting price: ${market.startPrice.toLocaleString()}
        </div>
      </div>

      {/* Timer */}
      <div className="text-center mb-6">
        <div className="text-3xl font-mono font-bold text-fliq-dark">
          {formatTime(timeLeft)}
        </div>
        <div className="text-sm text-fliq-dark">time left</div>
      </div>

      {/* Odds Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-fliq-dark font-medium">YES {yesPercentage}%</span>
          <span className="text-fliq-dark font-medium">NO {noPercentage}%</span>
        </div>
        <div className="w-full bg-fliq-bg-gray rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-fliq-green transition-all duration-300"
            style={{ width: `${yesPercentage}%` }}
          />
        </div>
      </div>

      {/* Multipliers */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <div className="text-sm text-fliq-dark">YES pays</div>
          <div className="text-lg font-bold text-fliq-dark">
            {market.yesMultiplier.toFixed(2)}x
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-fliq-dark">NO pays</div>
          <div className="text-lg font-bold text-fliq-dark">
            {market.noMultiplier.toFixed(2)}x
          </div>
        </div>
      </div>

      {/* Bet Counts */}
      <div className="text-center text-sm text-fliq-dark mb-4">
        {market.yesBets + market.noBets} total bets
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onSwipe?.(market.id, 'NO')}
          className="py-3 px-4 bg-fliq-dark text-white font-semibold rounded-xl hover:bg-[#333333] transition-colors"
        >
          NO (Swipe ←)
        </button>
        <button
          onClick={() => onSwipe?.(market.id, 'YES')}
          className="py-3 px-4 bg-brand-green text-white font-semibold rounded-xl hover:bg-brand-greenDark transition-colors"
        >
          YES (Swipe →)
        </button>
      </div>

      <div className="text-center text-xs text-fliq-dark mt-3">
        Stake: 100 $FLIQ per bet
      </div>
    </div>
  )
}
