import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Public paths that don't require authentication
const publicPaths = [
  '/login',
  '/api/auth',
  '/_next',
  '/favicon.ico',
]

// Static file extensions to allow
const staticExtensions = ['.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.woff', '.woff2']

// API paths that should be public (for health checks, etc.)
const publicApiPaths = [
  '/api/seed', // Seed will have its own auth check
]

function isPublicPath(pathname: string): boolean {
  // Check exact public paths
  if (publicPaths.some(p => pathname.startsWith(p))) {
    return true
  }
  
  // Check static extensions
  if (staticExtensions.some(ext => pathname.endsWith(ext))) {
    return true
  }
  
  // Check public API paths
  if (publicApiPaths.some(p => pathname === p || pathname.startsWith(p + '?'))) {
    return true
  }
  
  return false
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip auth in development ONLY when explicitly opted in (SKIP_AUTH=true in .env)
  if (process.env.NODE_ENV === 'development' && process.env.SKIP_AUTH === 'true') {
    return NextResponse.next()
  }

  // Allow public paths
  if (isPublicPath(pathname)) {
    // HTTPS enforcement for production
    if (process.env.NODE_ENV === 'production') {
      const proto = request.headers.get('x-forwarded-proto')
      if (proto && proto !== 'https') {
        const httpsUrl = new URL(request.url)
        httpsUrl.protocol = 'https:'
        return NextResponse.redirect(httpsUrl.toString(), 301)
      }
    }
    return NextResponse.next()
  }
  
  // Check for session token cookie (NextAuth default)
  const sessionToken = request.cookies.get('authjs.session-token')?.value ||
                       request.cookies.get('__Secure-authjs.session-token')?.value
  
  // If no session token, redirect to login
  if (!sessionToken) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // HTTPS enforcement for production
  if (process.env.NODE_ENV === 'production') {
    const proto = request.headers.get('x-forwarded-proto')
    if (proto && proto !== 'https') {
      const httpsUrl = new URL(request.url)
      httpsUrl.protocol = 'https:'
      return NextResponse.redirect(httpsUrl.toString(), 301)
    }
  }
  
  // Add security headers to all responses
  const response = NextResponse.next()
  
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
