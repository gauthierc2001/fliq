import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateNonce } from '@/lib/solana'

// Force dynamic rendering - this route uses database
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { wallet } = await request.json()
    
    if (!wallet) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 })
    }
    
    const nonce = generateNonce()
    
    // Store nonce in database
    await prisma.nonce.create({
      data: {
        wallet,
        nonce
      }
    })
    
    return NextResponse.json({ nonce })
  } catch (error) {
    console.error('Error generating nonce:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
