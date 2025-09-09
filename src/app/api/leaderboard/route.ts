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
        twitterHandle: true,
        twitterName: true,
        twitterAvatar: true
      },
      orderBy: [
        { totalPnL: 'desc' },
        { balance: 'desc' }
      ],
      take: 100
    })
    
    // Include Twitter info in leaderboard
    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      wallet: user.wallet,
      balance: user.balance,
      totalPnL: user.totalPnL,
      twitterHandle: user.twitterHandle,
      twitterName: user.twitterName,
      twitterAvatar: user.twitterAvatar
    }))
    
    return NextResponse.json({ leaderboard })
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
