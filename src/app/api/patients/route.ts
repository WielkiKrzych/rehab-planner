import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const patients = await prisma.patient.findMany({
    include: {
      diagnoses: true,
      plans: true,
    },
    orderBy: { updatedAt: 'desc' },
  });
  return NextResponse.json(patients);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const patient = await prisma.patient.create({
    data: {
      firstName: body.firstName,
      lastName: body.lastName,
      birthDate: body.birthDate,
      phone: body.phone || null,
      email: body.email || null,
      notes: body.notes || '',
    },
  });
  return NextResponse.json(patient);
}
