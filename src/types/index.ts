// Centralized type definitions for the Fliq application

export interface User {
  id: string
  wallet: string
  balance: number
  totalPnL: number
  twitterId?: string | null
  twitterHandle?: string | null
  twitterAvatar?: string | null
  twitterName?: string | null
}

export interface Market {
  id: string
  symbol: string
  title: string
  durationMin: number
  startTime: string
  endTime: string
  startPrice: number
  endPrice?: number | null
  resolved: boolean
  outcome?: 'YES' | 'NO' | 'PUSH' | null
  yesBets: number
  noBets: number
  yesMultiplier: number
  noMultiplier: number
  yesShare: number
  timeLeft: number
}

export interface Swipe {
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

export interface LeaderboardEntry {
  rank: number
  wallet: string
  balance: number
  totalPnL: number
  twitterHandle?: string | null
  twitterName?: string | null
  twitterAvatar?: string | null
}

export interface CoinPrice {
  symbol: string
  price: number
  timestamp: number
}

export interface JWTPayload {
  userId: string
  wallet: string
}

export interface MarketData {
  symbol: string
  title: string
  durationMin: number
  startTime: Date
  endTime: Date
  startPrice: number
  ticker: string
}
