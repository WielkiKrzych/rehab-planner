import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const diagnosis = await prisma.diagnosis.create({
    data: {
      name: body.name,
      date: body.date,
      notes: body.notes || null,
      patientId: body.patientId,
    },
  });
  return NextResponse.json(diagnosis);
}
