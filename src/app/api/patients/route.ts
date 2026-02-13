import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const patients = await prisma.patient.findMany({
      include: {
        diagnoses: true,
        plans: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
    return NextResponse.json(patients);
  } catch (error) {
    console.error('Failed to fetch patients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patients' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.firstName?.trim() || !body.lastName?.trim() || !body.birthDate) {
      return NextResponse.json(
        { error: 'Missing required fields: firstName, lastName, birthDate' },
        { status: 400 }
      );
    }
    
    const patient = await prisma.patient.create({
      data: {
        firstName: body.firstName.trim(),
        lastName: body.lastName.trim(),
        birthDate: body.birthDate,
        phone: body.phone || null,
        email: body.email || null,
        notes: body.notes || '',
      },
    });
    return NextResponse.json(patient);
  } catch (error) {
    console.error('Failed to create patient:', error);
    return NextResponse.json(
      { error: 'Failed to create patient' },
      { status: 500 }
    );
  }
}
