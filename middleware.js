import { NextResponse } from 'next/server'

export function middleware(request) {
  const verified = request.cookies.get('age-verified')
  const isVerificationPage = request.nextUrl.pathname === '/age-verification'
  const isPWAManifest = request.nextUrl.pathname === '/manifest.json'
  
  // Allow access to static files, API routes, and PWA manifest
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/static') ||
    isPWAManifest ||
    request.headers.get('purpose') === 'manifest'
  ) {
    return NextResponse.next()
  }

  // If not verified and not on verification page, redirect to verification
  if (!verified && !isVerificationPage) {
    return NextResponse.redirect(new URL('/age-verification', request.url))
  }

  // If verified and on verification page, redirect to home
  if (verified && isVerificationPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$).*)'
} 