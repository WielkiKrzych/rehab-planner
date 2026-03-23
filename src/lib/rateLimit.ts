import { NextRequest, NextResponse } from 'next/server';

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 100;
const CLEANUP_INTERVAL = 5 * 60 * 1000;

let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  
  lastCleanup = now;
  const expiredKeys: string[] = [];
  
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      expiredKeys.push(key);
    }
  }
  
  for (const key of expiredKeys) {
    rateLimitMap.delete(key);
  }
}

export function rateLimit(req: NextRequest) {
  try {
    cleanup();
    
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
               req.headers.get('x-real-ip')?.trim() || 
               'unknown';
    
    if (ip === 'unknown' || !ip) {
      return { allowed: true, remaining: MAX_REQUESTS };
    }
    
    const now = Date.now();
    const record = rateLimitMap.get(ip);
    
    if (!record || now > record.resetTime) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
      return { allowed: true, remaining: MAX_REQUESTS - 1 };
    }
    
    if (record.count >= MAX_REQUESTS) {
      return { allowed: false, remaining: 0, retryAfter: Math.ceil((record.resetTime - now) / 1000) };
    }
    
    record.count++;
    return { allowed: true, remaining: MAX_REQUESTS - record.count };
  } catch (error) {
    console.error('Rate limit error:', error);
    return { allowed: false, remaining: 0 };
  }
}

export function withRateLimit(req: NextRequest, handler: () => Promise<NextResponse>) {
  const { allowed, remaining, retryAfter } = rateLimit(req);
  
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { 
        status: 429,
        headers: {
          'Retry-After': String(retryAfter || 60),
          'X-RateLimit-Remaining': '0',
        }
      }
    );
  }
  
  return handler();
}
