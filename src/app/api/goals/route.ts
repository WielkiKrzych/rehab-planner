import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/authMiddleware';
import { z } from 'zod';

const PatientGoalSchema = z.object({
  patientId: z.string().min(1),
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  goalType: z.enum(['recovery', 'strength', 'mobility', 'endurance', 'pain_free', 'function', 'other']).default('recovery'),
  targetDate: z.string().optional(),
});

function generateWeeklyPlan(goal: { name: string; goalType: string; description?: string | null }) {
  const plans: Record<string, { focus: string; exercises: string[] }> = {
    recovery: {
      focus: 'Regeneracja i odbudowa',
      exercises: ['Delikatne rozciąganie', 'Ćwiczenia oddechowe', 'Lekka mobilność', 'Masaż'],
    },
    strength: {
      focus: 'Wzmocnienie mięśni',
      exercises: ['Ćwiczenia oporowe', 'Planki', 'Przysiady', 'Wyciskanie'],
    },
    mobility: {
      focus: 'Ruchomość stawów',
      exercises: ['Rotacje stawów', 'Rozciąganie dynamiczne', 'Ćwiczenia na gibkość', 'Mobilność kręgosłupa'],
    },
    endurance: {
      focus: 'Wytrzymałość',
      exercises: ['Ćwiczenia cardio', 'Trening interwałowy', 'Długie serie', 'Tempo trening'],
    },
    pain_free: {
      focus: 'Eliminacja bólu',
      exercises: ['Ćwiczenia izometryczne', 'Delikatne rozciąganie', 'Trening stabilizacyjny', 'Ćwiczenia przeciwbólowe'],
    },
    function: {
      focus: 'Funkcjonalność',
      exercises: ['Ćwiczenia codzienne', 'Równowaga', 'Koordynacja', 'Trening funkcjonalny'],
    },
    other: {
      focus: 'Cel ogólny',
      exercises: ['Różnorodne ćwiczenia', 'Trening ogólny', 'Rozwój kompletny', 'Aktywność ogólna'],
    },
  };

  const plan = plans[goal.goalType] || plans.other;
  
  return {
    goal: goal.name,
    goalType: goal.goalType,
    description: goal.description,
    weeks: [
      {
        weekNumber: 1,
        focus: `${plan.focus} - Faza 1: Wprowadzenie`,
        dailyPlan: [
          { day: 1, exercises: plan.exercises.slice(0, 2), intensity: 'niska', duration: 20 },
          { day: 2, exercises: ['Odpoczynek'], intensity: 'brak', duration: 0 },
          { day: 3, exercises: plan.exercises.slice(1, 3), intensity: 'niska', duration: 25 },
          { day: 4, exercises: ['Odpoczynek'], intensity: 'brak', duration: 0 },
          { day: 5, exercises: plan.exercises.slice(2, 4), intensity: 'średnia', duration: 30 },
          { day: 6, exercises: ['Lekka aktywność'], intensity: 'niska', duration: 15 },
          { day: 7, exercises: ['Odpoczynek'], intensity: 'brak', duration: 0 },
        ],
      },
      {
        weekNumber: 2,
        focus: `${plan.focus} - Faza 2: Adaptacja`,
        dailyPlan: [
          { day: 1, exercises: [...plan.exercises.slice(0, 2), 'Wzmocnienie'], intensity: 'średnia', duration: 30 },
          { day: 2, exercises: ['Odpoczynek'], intensity: 'brak', duration: 0 },
          { day: 3, exercises: [...plan.exercises.slice(1, 3), 'Równowaga'], intensity: 'średnia', duration: 35 },
          { day: 4, exercises: ['Odpoczynek'], intensity: 'brak', duration: 0 },
          { day: 5, exercises: [...plan.exercises.slice(2, 4), 'Koordynacja'], intensity: 'średnia-wysoka', duration: 40 },
          { day: 6, exercises: [...plan.exercises], intensity: 'średnia', duration: 35 },
          { day: 7, exercises: ['Odpoczynek'], intensity: 'brak', duration: 0 },
        ],
      },
      {
        weekNumber: 3,
        focus: `${plan.focus} - Faza 3: Progresja`,
        dailyPlan: [
          { day: 1, exercises: [...plan.exercises, 'Progresja'], intensity: 'wysoka', duration: 40 },
          { day: 2, exercises: ['Lekka aktywność'], intensity: 'niska', duration: 20 },
          { day: 3, exercises: [...plan.exercises, 'Wzmocnienie'], intensity: 'wysoka', duration: 45 },
          { day: 4, exercises: ['Odpoczynek'], intensity: 'brak', duration: 0 },
          { day: 5, exercises: [...plan.exercises, 'Test'], intensity: 'wysoka', duration: 45 },
          { day: 6, exercises: [...plan.exercises], intensity: 'średnia', duration: 40 },
          { day: 7, exercises: ['Odpoczynek'], intensity: 'brak', duration: 0 },
        ],
      },
      {
        weekNumber: 4,
        focus: `${plan.focus} - Faza 4: Consolidacja`,
        dailyPlan: [
          { day: 1, exercises: [...plan.exercises], intensity: 'wysoka', duration: 45 },
          { day: 2, exercises: ['Odpoczynek'], intensity: 'brak', duration: 0 },
          { day: 3, exercises: [...plan.exercises], intensity: 'wysoka', duration: 50 },
          { day: 4, exercises: ['Lekka aktywność'], intensity: 'niska', duration: 25 },
          { day: 5, exercises: [...plan.exercises], intensity: 'wysoka', duration: 50 },
          { day: 6, exercises: [...plan.exercises, 'Final'], intensity: 'wysoka', duration: 45 },
          { day: 7, exercises: ['Odpoczynek'], intensity: 'brak', duration: 0 },
        ],
      },
    ],
  };
}

export async function GET(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');

    if (!patientId) {
      return NextResponse.json({ error: 'patientId is required' }, { status: 400 });
    }

    const goals = await prisma.patientGoal.findMany({
      where: { patientId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(goals);
  } catch (error) {
    console.error('Failed to fetch goals:', error);
    return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const body = await request.json();
    
    const validation = PatientGoalSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { patientId, name, description, goalType, targetDate } = validation.data;

    const goal = await prisma.patientGoal.create({
      data: {
        patientId,
        name,
        description: description || null,
        goalType,
        targetDate: targetDate || null,
        status: 'active',
      },
    });

    const weeklyPlan = generateWeeklyPlan({ name, goalType, description });

    return NextResponse.json({
      goal,
      weeklyPlan,
    });
  } catch (error) {
    console.error('Failed to create goal:', error);
    return NextResponse.json({ error: 'Failed to create goal' }, { status: 500 });
  }
}
