import { jwtVerify, SignJWT } from "jose"
import { cookies } from "next/headers"

const secretKey = process.env.JWT_SECRET || "super-secret-estoka-key"
const key = new TextEncoder().encode(secretKey)

export type SessionPayload = {
  userId: string
  name: string
  email: string
  roles: string[]
  expiresAt: Date
}

export async function encrypt(payload: import('jose').JWTPayload & SessionPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key)
}

export async function decrypt(input: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    })
    // Backwards compatibility for old sessions that had { role: string }
    if (payload.role && !payload.roles) {
      if (payload.role === 'Administrador Sistema') {
        payload.roles = ['ADMIN']
      } else {
        payload.roles = [payload.role as string]
      }
    }
    return payload as SessionPayload
  } catch {
    return null
  }
}

export async function createSession(userId: string, name: string, email: string, roles: string[]) {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
  
  const payload: SessionPayload = {
    userId,
    name,
    email,
    roles,
    expiresAt,
  }

  const session = await encrypt(payload)

  const cookieStore = await cookies()
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  })
}

export async function getSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get("session")?.value
  if (!session) return null
  return await decrypt(session)
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}
