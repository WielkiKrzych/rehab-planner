import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/authMiddleware';
import { UpdatePatientSchema } from '@/lib/validations';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const { id } = await params;
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        diagnoses: true,
        plans: true,
      },
    });
    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }
    return NextResponse.json(patient);
  } catch (error) {
    console.error('Failed to fetch patient:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patient' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = await request.json();
    
    const validation = UpdatePatientSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    
    const patient = await prisma.patient.update({
      where: { id },
      data: {
        firstName: validation.data.firstName?.trim(),
        lastName: validation.data.lastName?.trim(),
        birthDate: validation.data.birthDate,
        phone: validation.data.phone || null,
        email: validation.data.email || null,
        notes: validation.data.notes || '',
      },
    });
    return NextResponse.json(patient);
  } catch (error) {
    console.error('Failed to update patient:', error);
    return NextResponse.json(
      { error: 'Failed to update patient' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const { id } = await params;
    await prisma.patient.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete patient:', error);
    return NextResponse.json(
      { error: 'Failed to delete patient' },
      { status: 500 }
    );
  }
}
