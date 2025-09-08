import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        wallet: true,
        balance: true,
        totalPnL: true
      },
      orderBy: [
        { totalPnL: 'desc' },
        { balance: 'desc' }
      ],
      take: 100
    })
    
    // Anonymize wallet addresses for privacy
    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      wallet: `${user.wallet.slice(0, 4)}...${user.wallet.slice(-4)}`,
      balance: user.balance,
      totalPnL: user.totalPnL
    }))
    
    return NextResponse.json({ leaderboard })
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
