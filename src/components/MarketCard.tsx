'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { TrendingDown, TrendingUp } from 'lucide-react'

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

  const formatTime = useCallback((ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }, [])

  const { yesPercentage, noPercentage } = useMemo(() => {
    const yes = Math.round(market.yesShare * 100)
    return { yesPercentage: yes, noPercentage: 100 - yes }
  }, [market.yesShare])

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-brand-border p-8 w-full h-full flex flex-col justify-between relative overflow-hidden">
      {/* Background gradient for visual appeal */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-green to-brand-greenDark"></div>
      
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-3xl font-black text-brand-green mb-2">{market.symbol.toUpperCase()}</div>
        <h3 className="text-lg font-bold text-brand-black mb-2">{market.title}</h3>
        <div className="text-sm text-brand-gray">
          Starting price: <span className="font-bold text-brand-black">${market.startPrice.toLocaleString()}</span>
        </div>
      </div>

      {/* Timer */}
      <div className="text-center mb-6">
        <div className="bg-brand-bgGray rounded-2xl p-4 mb-2">
          <div className="text-4xl font-mono font-black text-brand-black">
            {formatTime(timeLeft)}
          </div>
          <div className="text-sm text-brand-gray font-medium">time remaining</div>
        </div>
        <div className="text-xs text-brand-gray">
          {market.durationMin} minute prediction
        </div>
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
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => onSwipe?.(market.id, 'NO')}
            className="py-4 px-6 bg-brand-black text-white font-bold rounded-2xl hover:bg-gray-800 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <TrendingDown className="w-5 h-5" />
            <span>NO</span>
          </button>
          <button
            onClick={() => onSwipe?.(market.id, 'YES')}
            className="py-4 px-6 bg-brand-green text-white font-bold rounded-2xl hover:bg-brand-greenDark transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <TrendingUp className="w-5 h-5" />
            <span>YES</span>
          </button>
        </div>
        
        <div className="text-center">
          <div className="text-xs text-brand-gray">
            Stake: <span className="font-bold text-brand-black">100 $FLIQ</span> per bet
          </div>
          <div className="text-xs text-brand-lightGray mt-1">
            Swipe or tap to predict
          </div>
        </div>
      </div>
    </div>
  )
}
