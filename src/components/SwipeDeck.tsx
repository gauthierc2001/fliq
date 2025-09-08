'use client'

import { useState } from 'react'
import { useSwipeable } from 'react-swipeable'
import MarketCard from './MarketCard'
import { Target } from 'lucide-react'

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

interface SwipeDeckProps {
  markets: Market[]
  onSwipe: (marketId: string, side: 'YES' | 'NO') => Promise<void>
  isLoading?: boolean
}

export default function SwipeDeck({ markets, onSwipe, isLoading }: SwipeDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null)

  const currentMarket = markets[currentIndex]

  const handleSwipe = async (marketId: string, side: 'YES' | 'NO') => {
    if (isAnimating || !currentMarket) return

    setIsAnimating(true)
    setSwipeDirection(side === 'YES' ? 'right' : 'left')

    try {
      await onSwipe(marketId, side)
      
      // Move to next card after animation
      setTimeout(() => {
        setCurrentIndex(prev => {
          const nextIndex = prev + 1
          return nextIndex >= markets.length ? 0 : nextIndex
        })
        setIsAnimating(false)
        setSwipeDirection(null)
      }, 300)
    } catch (error) {
      setIsAnimating(false)
      setSwipeDirection(null)
      console.error('Swipe error:', error)
    }
  }

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => currentMarket && handleSwipe(currentMarket.id, 'NO'),
    onSwipedRight: () => currentMarket && handleSwipe(currentMarket.id, 'YES'),
    trackMouse: true,
    preventScrollOnSwipe: true,
  })

  if (!currentMarket) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Target className="w-12 h-12 text-brand-green mx-auto mb-4" />
          <div className="text-lg font-semibold text-brand-gray">No markets available</div>
          <div className="text-sm text-brand-lightGray">Check back soon for new predictions!</div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-sm mx-auto h-96" style={{ perspective: '1000px' }}>
      {/* Current Card */}
      <div
        {...swipeHandlers}
        className={`absolute inset-0 transition-transform duration-300 cursor-grab active:cursor-grabbing ${
          isAnimating
            ? swipeDirection === 'right'
              ? 'transform translate-x-full rotate-12'
              : 'transform -translate-x-full -rotate-12'
            : ''
        } ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
      >
        <MarketCard market={currentMarket} onSwipe={handleSwipe} />
      </div>

      {/* Next Card (peek) */}
      {markets[currentIndex + 1] && (
        <div className="absolute inset-0 -z-10 scale-95 opacity-50">
          <MarketCard market={markets[currentIndex + 1]} />
        </div>
      )}

      {/* Swipe Indicators */}
      <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none">
        <div className={`px-3 py-1 rounded-full text-white font-bold transition-opacity ${
          swipeDirection === 'left' ? 'bg-brand-black opacity-100' : 'bg-brand-lightGray opacity-0'
        }`}>
          NO
        </div>
        <div className={`px-3 py-1 rounded-full text-white font-bold transition-opacity ${
          swipeDirection === 'right' ? 'bg-brand-green opacity-100' : 'bg-brand-lightGray opacity-0'
        }`}>
          YES
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute -bottom-12 left-0 right-0 text-center">
        <div className="text-sm text-fliq-gray">
          Swipe left for NO • Swipe right for YES
        </div>
        <div className="text-xs text-fliq-light-gray mt-1">
          or tap the buttons below
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}
