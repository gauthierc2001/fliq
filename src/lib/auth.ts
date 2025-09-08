import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'
import { prisma } from './prisma'

export interface JWTPayload {
  userId: string
  wallet: string
}

export function signJWT(payload: JWTPayload): string {
  const secret = process.env.JWT_SECRET
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long')
  }
  return jwt.sign(payload, secret, { expiresIn: '7d' })
}

export function verifyJWT(token: string): JWTPayload | null {
  try {
    const secret = process.env.JWT_SECRET
    if (!secret) return null
    return jwt.verify(token, secret) as JWTPayload
  } catch {
    return null
  }
}

export async function getUserFromRequest(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  if (!token) return null

  const payload = verifyJWT(token)
  if (!payload) return null

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId }
    })
    return user
  } catch {
    return null
  }
}
