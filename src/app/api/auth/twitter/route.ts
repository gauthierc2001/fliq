import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering - this route uses database and cookies
export const dynamic = 'force-dynamic'

// Twitter OAuth 2.0 configuration
const TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID
const TWITTER_CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET
const REDIRECT_URI = process.env.NEXT_PUBLIC_BASE_URL + '/api/auth/twitter/callback'

export async function GET(request: NextRequest) {
  try {
    // Verify user is authenticated
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const payload = verifyJWT(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Generate Twitter OAuth URL
    const scopes = 'tweet.read users.read'
    const state = payload.userId // Use user ID as state for security
    
    const authUrl = new URL('https://twitter.com/i/oauth2/authorize')
    authUrl.searchParams.append('response_type', 'code')
    authUrl.searchParams.append('client_id', TWITTER_CLIENT_ID!)
    authUrl.searchParams.append('redirect_uri', REDIRECT_URI)
    authUrl.searchParams.append('scope', scopes)
    authUrl.searchParams.append('state', state)
    authUrl.searchParams.append('code_challenge', 'challenge')
    authUrl.searchParams.append('code_challenge_method', 'plain')

    return NextResponse.json({ authUrl: authUrl.toString() })
  } catch (error) {
    console.error('Twitter auth error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Handle Twitter callback
export async function POST(request: NextRequest) {
  try {
    const { code, state } = await request.json()
    
    if (!code || !state) {
      return NextResponse.json({ error: 'Missing code or state' }, { status: 400 })
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${TWITTER_CLIENT_ID}:${TWITTER_CLIENT_SECRET}`).toString('base64')}`
      },
      body: new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        client_id: TWITTER_CLIENT_ID!,
        redirect_uri: REDIRECT_URI,
        code_verifier: 'challenge'
      })
    })

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', await tokenResponse.text())
      return NextResponse.json({ error: 'Failed to exchange code for token' }, { status: 400 })
    }

    const { access_token } = await tokenResponse.json()

    // Get user info from Twitter
    const userResponse = await fetch('https://api.twitter.com/2/users/me?user.fields=profile_image_url', {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    })

    if (!userResponse.ok) {
      console.error('Failed to get user info:', await userResponse.text())
      return NextResponse.json({ error: 'Failed to get user info' }, { status: 400 })
    }

    const userData = await userResponse.json()
    const user = userData.data

    // Update user with Twitter info
    const updatedUser = await prisma.user.update({
      where: { id: state },
      data: {
        twitterId: user.id,
        twitterHandle: user.username,
        twitterName: user.name,
        twitterAvatar: user.profile_image_url
      }
    })

    return NextResponse.json({ 
      success: true,
      user: {
        id: updatedUser.id,
        wallet: updatedUser.wallet,
        balance: updatedUser.balance,
        totalPnL: updatedUser.totalPnL,
        twitterHandle: updatedUser.twitterHandle,
        twitterName: updatedUser.twitterName,
        twitterAvatar: updatedUser.twitterAvatar
      }
    })
  } catch (error) {
    console.error('Twitter callback error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
