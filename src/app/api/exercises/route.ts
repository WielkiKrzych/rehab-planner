import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { defaultExercises } from '@/data/exercises';
import { Exercise } from '@/types';
import { rateLimit } from '@/lib/rateLimit';
import { requireAuth } from '@/lib/authMiddleware';

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
    let exercises = await prisma.exercise.findMany();
    
    if (exercises.length === 0) {
      await prisma.exercise.createMany({
        data: defaultExercises.map((ex: Exercise) => ({
          name: ex.name,
          description: ex.description,
          category: ex.category,
          bodyPart: ex.bodyPart,
          difficulty: ex.difficulty,
          duration: ex.duration || null,
          reps: ex.reps || null,
          sets: ex.sets || null,
          equipment: JSON.stringify(ex.equipment),
          tags: JSON.stringify(ex.tags),
          isDefault: true,
        })),
      });
      exercises = await prisma.exercise.findMany();
    }
    
    return NextResponse.json(exercises.map((ex: { id: string; name: string; description: string; category: string; bodyPart: string; difficulty: number; duration: number | null; reps: number | null; sets: number | null; equipment: string; tags: string }): Exercise => ({
      id: ex.id,
      name: ex.name,
      description: ex.description,
      category: ex.category as Exercise['category'],
      bodyPart: ex.bodyPart as Exercise['bodyPart'],
      difficulty: ex.difficulty as 1 | 2 | 3,
      duration: ex.duration || undefined,
      reps: ex.reps || undefined,
      sets: ex.sets || undefined,
      equipment: JSON.parse(ex.equipment || '[]'),
      tags: JSON.parse(ex.tags || '[]'),
    })), {
      headers: { 'X-RateLimit-Remaining': String(remaining) },
    });
  } catch (error) {
    console.error('Failed to fetch exercises:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exercises' },
      { status: 500 }
    );
  }
}
