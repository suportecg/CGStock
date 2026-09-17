import { NextRequest, NextResponse } from "next/server"
import { decrypt } from "@/lib/auth"

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - login (auth route)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|login).*)',
  ],
}

export async function proxy(req: NextRequest) {
  const session = req.cookies.get("session")?.value
  
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const payload = await decrypt(session)
  if (!payload) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
}
