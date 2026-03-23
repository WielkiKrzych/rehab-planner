import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { requireAdmin, isAdmin } from '@/lib/authMiddleware';
import { UserSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON in request body' },
      { status: 400 }
    );
  }
  
  // Use Zod validation instead of manual checks
  const validation = UserSchema.safeParse(body);
  
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: validation.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  
  const { email, password, name } = validation.data;
  
  // Security: Only admins can create admin users
  // Default role is always 'physio' unless explicitly set by admin
  const requestedRole = body.role as string | undefined;
  const canCreateAdmin = await isAdmin();
  
  // Determine the role - only admin can create admin users
  const role = (canCreateAdmin && requestedRole === 'admin') ? 'admin' : 'physio';

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        name: name?.trim() || null,
        role,
      },
    });

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Database operation failed' },
      { status: 500 }
    );
  }
}
