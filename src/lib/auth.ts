import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'
import { prisma } from './prisma'

export interface JWTPayload {
  userId: string
  wallet: string
}

export function signJWT(payload: JWTPayload): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' })
}

export function verifyJWT(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
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
