import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { z } from 'zod'

// Force dynamic rendering - this route uses database and auth
export const dynamic = 'force-dynamic'

// Profile update validation schema
const profileUpdateSchema = z.object({
  username: z.string().min(1).max(50).optional(),
  avatar: z.string().url().optional().or(z.literal(''))
})

export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    
    // Validate input
    const parseResult = profileUpdateSchema.safeParse(body)
    if (!parseResult.success) {
      return NextResponse.json({ 
        error: 'Invalid profile data',
        details: parseResult.error.flatten()
      }, { status: 400 })
    }
    
    const { username, avatar } = parseResult.data
    
    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(username !== undefined && { username }),
        ...(avatar !== undefined && { avatar: avatar || null })
      }
    })
    
    return NextResponse.json({
      user: {
        id: updatedUser.id,
        wallet: updatedUser.wallet,
        balance: updatedUser.balance,
        totalPnL: updatedUser.totalPnL,
        username: updatedUser.username || `${updatedUser.wallet.slice(0, 4)}...${updatedUser.wallet.slice(-4)}`,
        avatar: updatedUser.avatar
      }
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
