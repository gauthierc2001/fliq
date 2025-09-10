import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering - this route uses database
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        wallet: true,
        balance: true,
        totalPnL: true,
        username: true,
        avatar: true
      },
      orderBy: [
        { totalPnL: 'desc' },
        { balance: 'desc' }
      ],
      take: 100
    })
    
    // Format leaderboard data
    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      wallet: user.wallet,
      balance: user.balance,
      totalPnL: user.totalPnL,
      username: user.username, // Keep original username, let frontend handle display logic
      displayName: user.username || user.wallet.slice(0, 4), // For champion display
      avatar: user.avatar
    }))
    
    return NextResponse.json({ leaderboard })
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
