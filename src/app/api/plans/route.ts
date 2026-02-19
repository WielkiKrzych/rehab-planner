import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { RehabilitationPlan, PlanWeek, PlanDay, PlanExercise } from '@/types';
import { rateLimit } from '@/lib/rateLimit';
import { PlanSchema } from '@/lib/validations';
import { requireAuth } from '@/lib/authMiddleware';

type DbPlanWithIncludes = {
  id: string;
  name: string;
  description: string | null;
  patientId: string | null;
  status: string;
  createdAt: Date;
  weeks: {
    id: string;
    weekNumber: number;
    focus: string | null;
    planId: string;
    days: {
      id: string;
      dayNumber: number;
      notes: string | null;
      weekId: string;
      exercises: {
        id: string;
        exerciseId: string;
        sets: number;
        reps: number;
        holdSeconds: number | null;
        notes: string | null;
        dayId: string;
      }[];
    }[];
  }[];
};

function transformPlan(plan: DbPlanWithIncludes): RehabilitationPlan {
  return {
    id: plan.id,
    name: plan.name,
    description: plan.description || undefined,
    patientId: plan.patientId || undefined,
    createdAt: plan.createdAt.toISOString(),
    status: plan.status as 'template' | 'active' | 'completed',
    weeks: plan.weeks.map((w): PlanWeek => ({
      weekNumber: w.weekNumber,
      focus: w.focus || undefined,
      days: w.days.map((d): PlanDay => ({
        dayNumber: d.dayNumber,
        notes: d.notes || undefined,
        exercises: d.exercises.map((ex): PlanExercise => ({
          exerciseId: ex.exerciseId,
          sets: ex.sets,
          reps: ex.reps,
          holdSeconds: ex.holdSeconds || undefined,
          notes: ex.notes || undefined,
        })),
      })),
    })),
  };
}

export async function GET(request: NextRequest) {
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
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const patientId = searchParams.get('patientId') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }
    
    if (status) {
      where.status = status;
    }
    
    if (patientId) {
      where.patientId = patientId;
    }

    const [plans, total] = await Promise.all([
      prisma.plan.findMany({
        where,
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
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.plan.count({ where }),
    ]);
    
    return NextResponse.json({
      data: plans.map(transformPlan),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    }, {
      headers: { 'X-RateLimit-Remaining': String(remaining) },
    });
  } catch (error) {
    console.error('Failed to fetch plans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plans' },
      { status: 500 }
    );
  }
}

type PlanInput = {
  name: string;
  description?: string;
  patientId?: string;
  status?: string;
  weeks: {
    weekNumber: number;
    focus?: string;
    days: {
      dayNumber: number;
      notes?: string;
      exercises: {
        exerciseId: string;
        sets: number;
        reps: number;
        holdSeconds?: number;
        notes?: string;
      }[];
    }[];
  }[];
};

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
    
    const validation = PlanSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    
    const { name, description, patientId, status, weeks } = validation.data;
    
    const plan = await prisma.plan.create({
      data: {
        name: name.trim(),
        description: description || null,
        patientId: patientId || null,
        status: status || 'template',
        weeks: {
          create: weeks?.map((week) => ({
            weekNumber: week.weekNumber,
            focus: week.focus || null,
            days: {
              create: week.days?.map((day) => ({
                dayNumber: day.dayNumber,
                notes: day.notes || null,
                exercises: {
                  create: day.exercises?.map((ex) => ({
                    exerciseId: ex.exerciseId,
                    sets: ex.sets || 3,
                    reps: ex.reps || 10,
                    holdSeconds: ex.holdSeconds || null,
                    notes: ex.notes || null,
                  })) || [],
                },
              })) || [],
            },
          })) || [],
        },
      },
      include: {
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
    
    return NextResponse.json(transformPlan(plan), {
      headers: { 'X-RateLimit-Remaining': String(remaining) },
    });
  } catch (error) {
    console.error('Failed to create plan:', error);
    return NextResponse.json(
      { error: 'Failed to create plan' },
      { status: 500 }
    );
  }
}
