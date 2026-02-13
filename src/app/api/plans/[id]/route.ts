import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const plan = await prisma.plan.findUnique({
    where: { id },
    include: {
      patient: true,
      weeks: {
        include: {
          days: {
            include: {
              exercises: true,
            },
          },
        },
      },
    },
  });
  if (!plan) {
    return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
  }
  return NextResponse.json(plan);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  
  const plan = await prisma.plan.update({
    where: { id },
    data: {
      status: body.status,
      patientId: body.patientId,
    },
  });
  return NextResponse.json(plan);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.plan.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
