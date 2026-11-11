import type { NextRequest } from 'next/server';

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  max: number;      // Maximum number of allowed requests in the window
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  reset: number;      // Unix timestamp (in seconds) when the window resets
  retryAfter: number; // Seconds until the user can retry (if rate limited)
}

interface RateLimitEntry {
  timestamps: number[];
  lastAccessed: number;
}

export interface RouteRule {
  id: string;
  config: RateLimitConfig;
}

export class MemoryRateLimiter {
  private store: Map<string, RateLimitEntry> = new Map();
  private maxStoreSize = 10000;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    if (typeof setInterval !== 'undefined') {
      this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
      if (this.cleanupInterval && typeof this.cleanupInterval.unref === 'function') {
        this.cleanupInterval.unref();
      }
    }
  }

  public check(key: string, config: RateLimitConfig): RateLimitResult {
    const now = Date.now();
    const windowStart = now - config.windowMs;

    let entry = this.store.get(key);
    if (!entry) {
      entry = { timestamps: [], lastAccessed: now };
      this.store.set(key, entry);
    } else {
      entry.lastAccessed = now;
      entry.timestamps = entry.timestamps.filter((t) => t > windowStart);
    }

    if (entry.timestamps.length >= config.max) {
      const earliest = entry.timestamps[0];
      const resetMs = earliest + config.windowMs;
      const retryAfter = Math.max(1, Math.ceil((resetMs - now) / 1000));
      return {
        allowed: false,
        limit: config.max,
        remaining: 0,
        reset: Math.ceil(resetMs / 1000),
        retryAfter,
      };
    }

    entry.timestamps.push(now);
    const earliest = entry.timestamps[0];
    const resetMs = earliest + config.windowMs;

    return {
      allowed: true,
      limit: config.max,
      remaining: Math.max(0, config.max - entry.timestamps.length),
      reset: Math.ceil(resetMs / 1000),
      retryAfter: 0,
    };
  }

  public cleanup(maxAgeMs = 120000): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now - entry.lastAccessed > maxAgeMs) {
        this.store.delete(key);
      }
    }
    if (this.store.size > this.maxStoreSize) {
      this.store.clear();
    }
  }

  public reset(key?: string): void {
    if (key) {
      this.store.delete(key);
    } else {
      this.store.clear();
    }
  }
}

declare global {
  var __rateLimiter: MemoryRateLimiter | undefined;
}

export const rateLimiter: MemoryRateLimiter =
  globalThis.__rateLimiter || new MemoryRateLimiter();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__rateLimiter = rateLimiter;
}

/**
 * Extracts client IP safely from request headers.
 */
export function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const ip = forwardedFor.split(',')[0].trim();
    if (ip) return ip;
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  if (cfConnectingIp) return cfConnectingIp.trim();

  const requestWithIp = request as unknown as { ip?: string };
  if (requestWithIp.ip) return requestWithIp.ip;

  return '127.0.0.1';
}

/**
 * Determines rate limit rules for public and sensitive API endpoints.
 */
export function getRouteRateLimitRule(pathname: string, method: string): RouteRule | null {
  const normalizedPath = pathname.replace(/\/$/, '') || '/';

  // 1. Contact Form - Strict (5 requests per minute)
  if (normalizedPath === '/api/contact' && method === 'POST') {
    return {
      id: 'contact_submit',
      config: {
        windowMs: 60 * 1000,
        max: parseInt(process.env.RATE_LIMIT_CONTACT_MAX || '5', 10),
      },
    };
  }

  // 2. Event Registration - Strict (10 requests per minute)
  if (/^\/api\/event\/[^/]+\/registration$/.test(normalizedPath) && method === 'POST') {
    return {
      id: 'event_register',
      config: {
        windowMs: 60 * 1000,
        max: parseInt(process.env.RATE_LIMIT_REGISTER_MAX || '10', 10),
      },
    };
  }

  // 3. Email / Role Check - Strict (10 requests per minute)
  if (normalizedPath === '/api/check-role' && method === 'POST') {
    return {
      id: 'check_role',
      config: {
        windowMs: 60 * 1000,
        max: parseInt(process.env.RATE_LIMIT_CHECK_ROLE_MAX || '10', 10),
      },
    };
  }

  // 4. Admin Login - Brute force protection (10 requests per minute)
  if (normalizedPath === '/api/admin/login' && method === 'POST') {
    return {
      id: 'admin_login',
      config: {
        windowMs: 60 * 1000,
        max: parseInt(process.env.RATE_LIMIT_LOGIN_MAX || '10', 10),
      },
    };
  }

  // 5. Health Check (30 requests per minute)
  if (normalizedPath === '/api/health-check') {
    return {
      id: 'health_check',
      config: {
        windowMs: 60 * 1000,
        max: parseInt(process.env.RATE_LIMIT_HEALTH_MAX || '30', 10),
      },
    };
  }

  // 6. Docs / OpenAPI spec (30 requests per minute)
  if (normalizedPath === '/api/docs') {
    return {
      id: 'api_docs',
      config: {
        windowMs: 60 * 1000,
        max: parseInt(process.env.RATE_LIMIT_DOCS_MAX || '30', 10),
      },
    };
  }

  // 7. Events Public Read (60 requests per minute)
  if (normalizedPath === '/api/event' || /^\/api\/event\/[^/]+$/.test(normalizedPath)) {
    return {
      id: 'events_read',
      config: {
        windowMs: 60 * 1000,
        max: parseInt(process.env.RATE_LIMIT_PUBLIC_MAX || '60', 10),
      },
    };
  }

  // 8. Teams, Leaders, Mentors Public Read (60 requests per minute)
  if (
    normalizedPath === '/api/teams' ||
    normalizedPath === '/api/leaders' ||
    normalizedPath === '/api/mentors'
  ) {
    return {
      id: 'teams_read',
      config: {
        windowMs: 60 * 1000,
        max: parseInt(process.env.RATE_LIMIT_PUBLIC_MAX || '60', 10),
      },
    };
  }

  // 9. Fallback for other unauthenticated /api/* endpoints
  if (!normalizedPath.startsWith('/api/admin')) {
    return {
      id: 'public_api_fallback',
      config: {
        windowMs: 60 * 1000,
        max: parseInt(process.env.RATE_LIMIT_PUBLIC_MAX || '60', 10),
      },
    };
  }

  return null;
}
