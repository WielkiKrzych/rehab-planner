import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { RehabilitationPlan, PlanWeek, PlanDay, PlanExercise } from '@/types';

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

export async function GET() {
  try {
    const plans = await prisma.plan.findMany({
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
    });
    
    return NextResponse.json(plans.map(transformPlan));
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
  try {
    const body: PlanInput = await request.json();
    
    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: 'Missing required field: name' },
        { status: 400 }
      );
    }
    
    const plan = await prisma.plan.create({
      data: {
        name: body.name.trim(),
        description: body.description || null,
        patientId: body.patientId || null,
        status: body.status || 'template',
        weeks: {
          create: body.weeks?.map((week) => ({
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
    
    return NextResponse.json(transformPlan(plan));
  } catch (error) {
    console.error('Failed to create plan:', error);
    return NextResponse.json(
      { error: 'Failed to create plan' },
      { status: 500 }
    );
  }
}
