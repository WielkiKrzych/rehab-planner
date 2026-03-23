import { NextRequest, NextResponse } from 'next/server';
import { PlanExercise } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/authMiddleware';
import { rateLimit } from '@/lib/rateLimit';

function generateICS(events: Array<{
  id: string;
  title: string;
  description?: string | null;
  date: string;
  duration?: number;
}>) {
  let ics = 'BEGIN:VCALENDAR\n';
  ics += 'VERSION:2.0\n';
  ics += 'PRODID:-//Rehab Planner//AI Rehabilitation//EN\n';
  ics += 'CALSCALE:GREGORIAN\n';
  ics += 'METHOD:PUBLISH\n';

  for (const event of events) {
    const startDate = event.date.replace(/-/g, '');
    const endDate = new Date(event.date);
    endDate.setDate(endDate.getDate() + 1);
    const endDateStr = endDate.toISOString().split('T')[0].replace(/-/g, '');

    ics += 'BEGIN:VEVENT\n';
    ics += `UID:${event.id}@rehab-planner\n`;
    ics += `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z\n`;
    ics += `DTSTART;VALUE=DATE:${startDate}\n`;
    ics += `DTEND;VALUE=DATE:${endDateStr}\n`;
    ics += `SUMMARY:${event.title}\n`;
    if (event.description) {
      ics += `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}\n`;
    }
    ics += 'END:VEVENT\n';
  }

  ics += 'END:VCALENDAR';
  return ics;
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
    const patientId = searchParams.get('patientId');
    const type = searchParams.get('type') || 'all';
    const weeks = parseInt(searchParams.get('weeks') || '4');

    if (!patientId) {
      return NextResponse.json({ error: 'patientId is required' }, { status: 400 });
    }

    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        plans: {
          where: { status: 'active' },
          include: {
            weeks: {
              orderBy: { weekNumber: 'asc' },
              take: weeks,
              include: {
                days: {
                  orderBy: { dayNumber: 'asc' },
                  include: {
                    exercises: true,
                  },
                },
              },
            },
          },
        },
        goals: {
          where: { status: 'active' },
        },
      },
    });

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    const events: Array<{
      id: string;
      title: string;
      description?: string | null;
      date: string;
      duration?: number;
    }> = [];

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    if (type === 'all' || type === 'goals') {
      for (const goal of patient.goals) {
        const goalDate = goal.targetDate || new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        events.push({
          id: `goal-${goal.id}`,
          title: `🎯 Cel: ${goal.name}`,
          description: goal.description || `Typ: ${goal.goalType}`,
          date: goalDate,
        });
      }
    }

    if (type === 'all' || type === 'plans') {
      let currentDate = new Date(startDate);

      for (const plan of patient.plans) {
        for (const week of plan.weeks) {
          for (const day of week.days) {
            const dayDate = new Date(currentDate);
            dayDate.setDate(dayDate.getDate() + (day.dayNumber - 1));

            if (day.exercises.length > 0) {
              const exerciseNames = day.exercises.slice(0, 3).map((ex: PlanExercise) => ex.exerciseId).join(', ');
              events.push({
                id: `plan-${plan.id}-${day.id}`,
                title: `🏋️ Trening: ${plan.name}`,
                description: `${week.focus || 'Tydzień ' + week.weekNumber}, Dzień ${day.dayNumber}\nĆwiczenia: ${exerciseNames}${day.exercises.length > 3 ? '...' : ''}`,
                date: dayDate.toISOString().split('T')[0],
              });
            }

            currentDate = new Date(dayDate);
            currentDate.setDate(currentDate.getDate() + 1);
          }
        }
      }
    }

    const ics = generateICS(events);

    return new NextResponse(ics, {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8;',
        'Content-Disposition': `attachment; filename="rehab-calendar-${patient.firstName}-${patient.lastName}.ics"`,
        'X-RateLimit-Remaining': String(remaining),
      },
    });
  } catch (error) {
    console.error('Failed to generate calendar:', error);
    return NextResponse.json({ error: 'Failed to generate calendar' }, { status: 500 });
  }
}
