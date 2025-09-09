import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { calculateOdds, STAKE_AMOUNT } from '@/lib/betting'
import { z } from 'zod'

// Force dynamic rendering - this route uses database and auth
export const dynamic = 'force-dynamic'

// Input validation schema
const swipeSchema = z.object({
  marketId: z.string().min(1),
  side: z.enum(['YES', 'NO']),
  stake: z.number().min(1).max(100000).optional()
})

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    
    // Validate input with Zod
    const parseResult = swipeSchema.safeParse(body)
    if (!parseResult.success) {
      return NextResponse.json({ 
        error: 'Invalid request', 
        details: parseResult.error.flatten() 
      }, { status: 400 })
    }
    
    const { marketId, side, stake } = parseResult.data
    const actualStake = stake || STAKE_AMOUNT // Use custom stake or default
    
    // Check user balance
    if (user.balance < actualStake) {
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
          stake: actualStake,
          payoutMult
        }
      })
      
      // Update user balance
      await tx.user.update({
        where: { id: user.id },
        data: {
          balance: { decrement: actualStake }
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
      newBalance: user.balance - actualStake
    })
  } catch (error) {
    console.error('Error creating swipe:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
