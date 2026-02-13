import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.name?.trim() || !body.date || !body.patientId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, date, patientId' },
        { status: 400 }
      );
    }
    
    const diagnosis = await prisma.diagnosis.create({
      data: {
        name: body.name.trim(),
        date: body.date,
        notes: body.notes || null,
        patientId: body.patientId,
      },
    });
    return NextResponse.json(diagnosis);
  } catch (error) {
    console.error('Failed to create diagnosis:', error);
    return NextResponse.json(
      { error: 'Failed to create diagnosis' },
      { status: 500 }
    );
  }
}
