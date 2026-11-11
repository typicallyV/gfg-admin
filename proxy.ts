import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';
import { getClientIp, getRouteRateLimitRule, rateLimiter } from '@/lib/rateLimit';

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace(/\/$/, '') || '/';
  const method = request.method;

  // 1. Rate Limiting for Public APIs and sensitive routes
  const rateLimitRule = getRouteRateLimitRule(pathname, method);
  let rateLimitResult = null;

  if (rateLimitRule) {
    const ip = getClientIp(request);
    const key = `${rateLimitRule.id}:${ip}`;
    rateLimitResult = rateLimiter.check(key, rateLimitRule.config);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many requests. Please try again later.',
          retryAfter: rateLimitResult.retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': rateLimitResult.retryAfter.toString(),
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
          },
        }
      );
    }
  }

  const token = request.cookies.get('admin_token')?.value;

  // Verify token
  const { valid } = token ? await verifyAdminToken(token) : { valid: false };

  // Allow login/logout API endpoints without authentication
  if (pathname === '/api/admin/login' || pathname === '/api/admin/logout') {
    const res = NextResponse.next();
    if (rateLimitResult) {
      res.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
      res.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
      res.headers.set('X-RateLimit-Reset', rateLimitResult.reset.toString());
    }
    return res;
  }

  // Protect Admin API routes
  if (pathname.startsWith('/api/admin')) {
    if (!valid) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin authentication required.' },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // Protect Dashboard pages
  if (pathname.startsWith('/dashboard')) {
    if (!valid) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Redirect logged-in admin away from login page to dashboard
  if (pathname === '/login' || pathname === '') {
    if (valid) {
      const dashboardUrl = new URL('/dashboard/teams', request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // Allowed public routes: attach rate limit headers
  const response = NextResponse.next();
  if (rateLimitResult) {
    response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
    response.headers.set('X-RateLimit-Reset', rateLimitResult.reset.toString());
  }

  return response;
}

export default proxy;

export const config = {
  matcher: [
    '/',
    '/login',
    '/dashboard/:path*',
    '/api/:path*',
  ],
};
