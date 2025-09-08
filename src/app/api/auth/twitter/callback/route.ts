import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  if (error) {
    // Redirect to profile with error
    return NextResponse.redirect(new URL('/app/user?twitter_error=access_denied', request.url))
  }

  if (!code || !state) {
    return NextResponse.redirect(new URL('/app/user?twitter_error=invalid_request', request.url))
  }

  try {
    // Call our Twitter auth endpoint to handle the token exchange
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin
    const response = await fetch(`${baseUrl}/api/auth/twitter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, state })
    })

    if (response.ok) {
      // Success - redirect to profile
      return NextResponse.redirect(new URL('/app/user?twitter_success=true', request.url))
    } else {
      // Error - redirect with error message
      return NextResponse.redirect(new URL('/app/user?twitter_error=auth_failed', request.url))
    }
  } catch (error) {
    console.error('Callback error:', error)
    return NextResponse.redirect(new URL('/app/user?twitter_error=server_error', request.url))
  }
}
