import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateNonce } from '@/lib/solana'
import { z } from 'zod'

// Force dynamic rendering - this route uses database
export const dynamic = 'force-dynamic'

// Solana wallet address validation
const nonceRequestSchema = z.object({
  wallet: z.string().regex(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/, 'Invalid Solana wallet address')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const parseResult = nonceRequestSchema.safeParse(body)
    if (!parseResult.success) {
      return NextResponse.json({ 
        error: 'Invalid wallet address',
        details: parseResult.error.flatten()
      }, { status: 400 })
    }
    
    const { wallet } = parseResult.data
    
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
