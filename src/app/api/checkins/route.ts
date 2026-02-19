import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/authMiddleware';
import { z } from 'zod';

const DailyCheckinSchema = z.object({
  patientId: z.string().min(1),
  date: z.string().min(1),
  painLevel: z.number().int().min(0).max(10).optional().default(0),
  energyLevel: z.number().int().min(1).max(10).optional().default(5),
  sleepQuality: z.number().int().min(1).max(10).optional().default(5),
  mood: z.number().int().min(1).max(10).optional().default(5),
  notes: z.string().optional().default(''),
});

function assessReadiness(data: {
  painLevel?: number;
  energyLevel?: number;
  sleepQuality?: number;
  mood?: number;
}) {
  const painLevel = data.painLevel || 0;
  const energyLevel = data.energyLevel || 5;
  const sleepQuality = data.sleepQuality || 5;
  const mood = data.mood || 5;
  
  let status = 'normal';
  let recommendation = '';
  
  if (painLevel >= 7) {
    status = 'rest';
    recommendation = 'Wysoki poziom bólu - zalecany odpoczynek. Spróbuj delikatnych ćwiczeń rozciągających lub masażu.';
  } else if (painLevel >= 4 && painLevel <= 6) {
    status = 'light';
    recommendation = 'Umiarkowany ból - zalecane lekkie ćwiczenia o niskiej intensywności.';
  } else if (energyLevel <= 3 || sleepQuality <= 3) {
    status = 'rest';
    recommendation = 'Niska energia i jakość snu - zalecany odpoczynek lub bardzo lekka aktywność.';
  } else if (energyLevel <= 5 || sleepQuality <= 4) {
    status = 'light';
    recommendation = 'Obniżona energia - rozważ lżejsze ćwiczenia niż planowane.';
  } else if (painLevel <= 3 && energyLevel >= 7 && sleepQuality >= 7) {
    status = 'full';
    recommendation = 'Jesteś w świetnej formie! Możesz wykonać pełny trening z pełną intensywnością.';
  } else {
    status = 'normal';
    recommendation = 'Twoja forma jest dobra. Możesz wykonać zaplanowane ćwiczenia.';
  }
  
  const readinessScore = Math.round(((10 - painLevel) + energyLevel + sleepQuality + mood) / 4 * 10);
  
  return { status, recommendation, readinessScore };
}

export async function GET(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const date = searchParams.get('date');

    const where: Record<string, unknown> = {};
    if (patientId) where.patientId = patientId;
    if (date) where.date = date;

    const checkins = await prisma.dailyCheckin.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 30,
    });

    return NextResponse.json(checkins);
  } catch (error) {
    console.error('Failed to fetch checkins:', error);
    return NextResponse.json({ error: 'Failed to fetch checkins' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const body = await request.json();
    
    const validation = DailyCheckinSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { patientId, date, painLevel, energyLevel, sleepQuality, mood, notes } = validation.data;

    const existingCheckin = await prisma.dailyCheckin.findFirst({
      where: { patientId, date },
    });

    if (existingCheckin) {
      return NextResponse.json(
        { error: 'Check-in for this date already exists', existingCheckin },
        { status: 400 }
      );
    }

    const { status, recommendation, readinessScore } = assessReadiness({
      painLevel,
      energyLevel,
      sleepQuality,
      mood,
    });

    const checkin = await prisma.dailyCheckin.create({
      data: {
        patientId,
        date,
        painLevel: painLevel || 0,
        energyLevel: energyLevel || 5,
        sleepQuality: sleepQuality || 5,
        mood: mood || 5,
        notes: notes || '',
        aiRecommendation: recommendation,
        status,
      },
    });

    return NextResponse.json({
      ...checkin,
      readinessScore,
    });
  } catch (error) {
    console.error('Failed to create checkin:', error);
    return NextResponse.json({ error: 'Failed to create checkin' }, { status: 500 });
  }
}
