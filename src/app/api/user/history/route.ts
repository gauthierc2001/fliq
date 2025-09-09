import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

// Force dynamic rendering - this route uses database and auth
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const swipes = await prisma.swipe.findMany({
      where: { userId: user.id },
      include: {
        market: {
          select: {
            title: true,
            symbol: true,
            resolved: true,
            outcome: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    })
    
    return NextResponse.json({
      user: {
        id: user.id,
        wallet: user.wallet,
        balance: user.balance,
        totalPnL: user.totalPnL,
        username: user.username || `${user.wallet.slice(0, 4)}...${user.wallet.slice(-4)}`,
        avatar: user.avatar
      },
      history: swipes
    })
  } catch (error) {
    console.error('Error fetching user history:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
