import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/authMiddleware';
import { z } from 'zod';

const UpdatePlanSchema = z.object({
  status: z.enum(['template', 'active', 'completed']).optional(),
  patientId: z.string().optional().nullable(),
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional().nullable(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
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
  } catch (error) {
    console.error('Failed to fetch plan:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plan' },
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
    
    const validation = UpdatePlanSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    
    const updateData: Record<string, unknown> = {};
    if (validation.data.status !== undefined) updateData.status = validation.data.status;
    if (validation.data.patientId !== undefined) updateData.patientId = validation.data.patientId;
    if (validation.data.name !== undefined) updateData.name = validation.data.name.trim();
    if (validation.data.description !== undefined) updateData.description = validation.data.description?.trim() || null;
    
    const plan = await prisma.plan.update({
      where: { id },
      data: updateData,
    });
    return NextResponse.json(plan);
  } catch (error) {
    console.error('Failed to update plan:', error);
    return NextResponse.json(
      { error: 'Failed to update plan' },
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
    await prisma.plan.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete plan:', error);
    return NextResponse.json(
      { error: 'Failed to delete plan' },
      { status: 500 }
    );
  }
}
