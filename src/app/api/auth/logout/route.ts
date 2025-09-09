import { NextResponse } from 'next/server'

// Force dynamic rendering - this route modifies cookies
export const dynamic = 'force-dynamic'

export async function POST() {
  const response = NextResponse.json({ success: true })
  
  response.cookies.set('auth-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0
  })
  
  return response
}
