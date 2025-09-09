'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { TrendingDown, TrendingUp, Coins } from 'lucide-react'
import Image from 'next/image'

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
  logoUrl?: string
}

interface MarketCardProps {
  market: Market
  onSwipe?: (marketId: string, side: 'YES' | 'NO') => void
  wagerAmount?: number
}

export default function MarketCard({ market, onSwipe, wagerAmount = 100 }: MarketCardProps) {
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
    <div className="bg-white rounded-3xl shadow-2xl border border-brand-border p-5 sm:p-6 w-full h-full flex flex-col relative overflow-hidden min-h-[500px] max-h-[520px]">
      {/* Background gradient for visual appeal */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-green to-brand-greenDark"></div>
      
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-4">
          {market.logoUrl ? (
            <Image
              src={market.logoUrl}
              alt={`${market.symbol} logo`}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full mr-3 object-cover"
              unoptimized
              onError={(e) => {
                // Hide broken image and show fallback
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                const fallback = target.nextElementSibling as HTMLElement
                if (fallback) fallback.style.display = 'flex'
              }}
            />
          ) : null}
          <div 
            className={`w-12 h-12 rounded-full bg-gradient-to-br from-brand-green to-brand-greenDark flex items-center justify-center mr-3 ${
              market.logoUrl ? 'hidden' : 'flex'
            } shadow-lg border-2 border-white`}
          >
            {/* Try to show initials first, fallback to coin icon */}
            {market.symbol.length >= 2 ? (
              <span className="text-white font-black text-sm">
                {market.symbol.slice(0, 2).toUpperCase()}
              </span>
            ) : (
              <Coins className="w-6 h-6 text-white" />
            )}
          </div>
          <div className="text-3xl font-black text-brand-green">{market.symbol.toUpperCase()}</div>
        </div>
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
      <div className="space-y-3 mt-auto">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onSwipe?.(market.id, 'NO')}
            className="py-3 px-4 bg-brand-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all duration-200 hover:scale-[1.02] flex items-center justify-center space-x-2 text-sm shadow-lg"
          >
            <TrendingDown className="w-4 h-4" />
            <span>NO</span>
          </button>
          <button
            onClick={() => onSwipe?.(market.id, 'YES')}
            className="py-3 px-4 bg-brand-green text-white font-bold rounded-xl hover:bg-brand-greenDark transition-all duration-200 hover:scale-[1.02] flex items-center justify-center space-x-2 text-sm shadow-lg"
          >
            <TrendingUp className="w-4 h-4" />
            <span>YES</span>
          </button>
        </div>
        
        <div className="text-center px-2">
          <div className="text-xs text-brand-gray">
            Stake: <span className="font-bold text-brand-black">{wagerAmount} $FLIQ</span> per bet
          </div>
          <div className="text-xs text-brand-lightGray mt-1">
            Swipe or tap to predict
          </div>
        </div>
      </div>
    </div>
  )
}
