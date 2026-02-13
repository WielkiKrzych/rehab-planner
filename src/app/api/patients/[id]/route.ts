import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
  try {
    const { id } = await params;
    const body = await request.json();
    
    if (!body.firstName?.trim() || !body.lastName?.trim() || !body.birthDate) {
      return NextResponse.json(
        { error: 'Missing required fields: firstName, lastName, birthDate' },
        { status: 400 }
      );
    }
    
    const patient = await prisma.patient.update({
      where: { id },
      data: {
        firstName: body.firstName.trim(),
        lastName: body.lastName.trim(),
        birthDate: body.birthDate,
        phone: body.phone || null,
        email: body.email || null,
        notes: body.notes || '',
        activePlanId: body.activePlanId || null,
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
