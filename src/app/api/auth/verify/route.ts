import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSignMessage, verifySignature } from '@/lib/solana'
import { signJWT } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { wallet, signature, nonce } = await request.json()
    
    if (!wallet || !signature || !nonce) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    // Find and verify nonce
    const nonceRecord = await prisma.nonce.findFirst({
      where: {
        wallet,
        nonce,
        createdAt: {
          gt: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
        }
      }
    })
    
    if (!nonceRecord) {
      return NextResponse.json({ error: 'Invalid or expired nonce' }, { status: 400 })
    }
    
    // Verify signature
    const message = createSignMessage(nonce)
    const isValid = verifySignature(message, signature, wallet)
    
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }
    
    // Clean up used nonce
    await prisma.nonce.delete({ where: { id: nonceRecord.id } })
    
    // Find or create user
    let user = await prisma.user.findUnique({ where: { wallet } })
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          wallet,
          balance: 1000 // Starting balance
        }
      })
    }
    
    // Create JWT token
    const token = signJWT({ userId: user.id, wallet: user.wallet })
    
    // Set secure cookie
    const response = NextResponse.json({ 
      user: {
        id: user.id,
        wallet: user.wallet,
        balance: user.balance,
        totalPnL: user.totalPnL
      }
    })
    
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })
    
    return response
  } catch (error) {
    console.error('Error verifying signature:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
