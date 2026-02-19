import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { rateLimit } from '@/lib/rateLimit';
import { DiagnosisSchema } from '@/lib/validations';
import { requireAuth } from '@/lib/authMiddleware';

export async function POST(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  const { allowed, remaining } = rateLimit(request);
  
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'X-RateLimit-Remaining': '0' } }
    );
  }

  try {
    const body = await request.json();
    
    const validation = DiagnosisSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    
    const { name, date, notes, patientId } = validation.data;
    
    const diagnosis = await prisma.diagnosis.create({
      data: {
        name: name.trim(),
        date,
        notes: notes || null,
        patientId,
      },
    });
    return NextResponse.json(diagnosis, {
      headers: { 'X-RateLimit-Remaining': String(remaining) },
    });
  } catch (error) {
    console.error('Failed to create diagnosis:', error);
    return NextResponse.json(
      { error: 'Failed to create diagnosis' },
      { status: 500 }
    );
  }
}
