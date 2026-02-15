import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { defaultExercises } from '@/data/exercises';
import { defaultRehabPlans } from '@/data/rehabPlans';
import { Exercise } from '@/types';

export async function POST() {
  try {
    const results = {
      exercises: { deleted: 0, added: 0 },
      plans: { added: 0 },
    };

    const deletedExercises = await prisma.exercise.deleteMany({
      where: { isDefault: true },
    });
    results.exercises.deleted = deletedExercises.count;

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
    results.exercises.added = defaultExercises.length;

    const allExercises = await prisma.exercise.findMany();
    const exerciseIdMap = new Map(allExercises.map((ex) => [ex.name, ex.id]));

    const existingPlans = await prisma.plan.findMany({
      where: { patientId: null },
    });
    const existingPlanNames = new Set(existingPlans.map((p) => p.name));

    for (const planTemplate of defaultRehabPlans) {
      if (existingPlanNames.has(planTemplate.name)) {
        continue;
      }

      await prisma.plan.create({
        data: {
          name: planTemplate.name,
          description: planTemplate.description || null,
          patientId: null,
          status: 'template',
          weeks: {
            create: planTemplate.weeks.map((week) => ({
              weekNumber: week.weekNumber,
              focus: week.focus || null,
              days: {
                create: week.days.map((day) => ({
                  dayNumber: day.dayNumber,
                  notes: day.notes || null,
                  exercises: {
                    create: day.exercises.map((ex) => {
                      const exerciseData = defaultExercises.find(
                        (e) => e.id === ex.exerciseId
                      );
                      const dbExerciseId = exerciseData
                        ? exerciseIdMap.get(exerciseData.name)
                        : null;

                      return {
                        exerciseId: dbExerciseId || ex.exerciseId,
                        sets: ex.sets || 3,
                        reps: ex.reps || 10,
                        holdSeconds: ex.holdSeconds || null,
                        notes: ex.notes || null,
                      };
                    }),
                  },
                })),
              },
            })),
          },
        },
      });
      results.plans.added++;
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      results,
    });
  } catch (error) {
    console.error('Failed to seed database:', error);
    return NextResponse.json(
      { error: 'Failed to seed database', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const exercisesCount = await prisma.exercise.count();
    const plansCount = await prisma.plan.count({ where: { patientId: null } });

    return NextResponse.json({
      exercises: exercisesCount,
      templatePlans: plansCount,
      expectedExercises: defaultExercises.length,
      expectedPlans: defaultRehabPlans.length,
    });
  } catch (error) {
    console.error('Failed to get seed status:', error);
    return NextResponse.json(
      { error: 'Failed to get seed status' },
      { status: 500 }
    );
  }
}
