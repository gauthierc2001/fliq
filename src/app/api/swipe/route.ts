import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { calculateOdds, STAKE_AMOUNT } from '@/lib/betting'

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { marketId, side } = await request.json()
    
    if (!marketId || !side || !['YES', 'NO'].includes(side)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
    
    // Check user balance
    if (user.balance < STAKE_AMOUNT) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })
    }
    
    // Get market and check if still active
    const market = await prisma.market.findUnique({
      where: { id: marketId }
    })
    
    if (!market || market.resolved || market.endTime <= new Date()) {
      return NextResponse.json({ error: 'Market not available' }, { status: 400 })
    }
    
    // Calculate current odds
    const odds = calculateOdds(market.yesBets, market.noBets)
    const payoutMult = side === 'YES' ? odds.yesMultiplier : odds.noMultiplier
    
    // Create transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create swipe record
      const swipe = await tx.swipe.create({
        data: {
          userId: user.id,
          marketId,
          side: side as 'YES' | 'NO',
          stake: STAKE_AMOUNT,
          payoutMult
        }
      })
      
      // Update user balance
      await tx.user.update({
        where: { id: user.id },
        data: {
          balance: { decrement: STAKE_AMOUNT }
        }
      })
      
      // Update market bet counts
      await tx.market.update({
        where: { id: marketId },
        data: {
          yesBets: side === 'YES' ? { increment: 1 } : undefined,
          noBets: side === 'NO' ? { increment: 1 } : undefined
        }
      })
      
      return swipe
    })
    
    return NextResponse.json({
      swipe: result,
      newBalance: user.balance - STAKE_AMOUNT
    })
  } catch (error) {
    console.error('Error creating swipe:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
