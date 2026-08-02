import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedPrefixes = [
  '/owner',
  '/employee',
  '/customer/dashboard',
  '/customer/orders',
  '/customer/prescriptions',
  '/customer/invoices',
  '/customer/wishlist',
  '/customer/profile',
  '/customer/notifications',
  '/customer/help',
  '/inventory',
  '/pos',
  '/orders',
  '/prescriptions',
  '/customers',
  '/suppliers',
  '/purchases',
  '/employees',
  '/reports',
  '/settings',
  '/notifications',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('mediflow_token')?.value
  const rawUser = request.cookies.get('mediflow_user')?.value

  let user: { role?: string } | null = null
  if (rawUser) {
    try {
      user = JSON.parse(decodeURIComponent(rawUser))
    } catch (e) {
      user = null
    }
  }

  const isProtected = protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))

  // 1. If accessing protected route without token or user
  if (isProtected && (!token || !user)) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 2. Role-based restriction
  if (isProtected && user) {
    if (pathname.startsWith('/owner') && user.role !== 'owner') {
      const target = user.role === 'employee' ? '/employee/dashboard' : '/customer/dashboard'
      return NextResponse.redirect(new URL(target, request.url))
    }
    if (pathname.startsWith('/employee') && !['employee', 'owner'].includes(user.role || '')) {
      return NextResponse.redirect(new URL('/customer/dashboard', request.url))
    }
  }

  // 3. If accessing /login while already logged in
  if (pathname === '/login' && token && user) {
    const destination =
      user.role === 'owner'
        ? '/owner/dashboard'
        : user.role === 'employee'
        ? '/employee/dashboard'
        : '/customer/dashboard'
    return NextResponse.redirect(new URL(destination, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
