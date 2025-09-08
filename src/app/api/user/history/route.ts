import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

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
        totalPnL: user.totalPnL
      },
      history: swipes
    })
  } catch (error) {
    console.error('Error fetching user history:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
