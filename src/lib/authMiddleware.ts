import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function requireAuth() {
  const session = await auth();
  
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized - please log in' },
      { status: 401 }
    );
  }
  
  return null;
}

export async function requireAdmin() {
  const session = await auth();
  
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized - please log in' },
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
