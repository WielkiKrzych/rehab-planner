import { NextResponse } from 'next/server';
import { auth } from '@/auth';

/**
 * Require authenticated user session
 * Returns null if authenticated, or NextResponse with error if not
 */
export async function requireAuth(): Promise<NextResponse | null> {
  const session = await auth();
  
  if (!session?.user) {
    return NextResponse.json(
      { error: 'Unauthorized - login required' },
      { status: 401 }
    );
  }
  
  return null;
}

/**
 * Require admin role
 * Returns null if admin, or NextResponse with error if not
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const session = await auth();
  
  if (!session?.user) {
    return NextResponse.json(
      { error: 'Unauthorized - login required' },
      { status: 401 }
    );
  }
  
  if (session.user.role !== 'admin') {
    return NextResponse.json(
      { error: 'Forbidden - admin access required' },
      { status: 403 }
    );
  }
  
  return null;
}

/**
 * Get current session - returns session or null
 */
export async function getSession() {
  return auth();
}

/**
 * Get current user ID or null
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

/**
 * Check if current user is admin
 */
export async function isAdmin(): Promise<boolean> {
  const session = await auth();
  return session?.user?.role === 'admin';
}
