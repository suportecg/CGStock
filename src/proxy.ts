import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const secretKey = process.env.JWT_SECRET || "super-secret-estoka-key"
const key = new TextEncoder().encode(secretKey)

export default async function proxy(request: NextRequest) {
  const session = request.cookies.get('session')?.value
  const { pathname } = request.nextUrl
  
  const isLoginPage = pathname.startsWith('/login')
  const isChangePasswordPage = pathname.startsWith('/change-password')
  const isApiAuth = pathname.startsWith('/api/') || pathname.startsWith('/_next/')

  if (isApiAuth) return NextResponse.next()

  if (!session) {
    if (!isLoginPage && !isChangePasswordPage) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
  }

  try {
    const { payload } = await jwtVerify(session, key, { algorithms: ["HS256"] })
    const mustChangePassword = payload.mustChangePassword as boolean

    if (mustChangePassword && !isChangePasswordPage) {
      return NextResponse.redirect(new URL('/change-password', request.url))
    }

    if (!mustChangePassword && isChangePasswordPage) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    if (isLoginPage) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
  } catch (err) {
    // Invalid session
    if (!isLoginPage) {
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('session')
      return response
    }
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|manifest.json|window.svg).*)'],
}
