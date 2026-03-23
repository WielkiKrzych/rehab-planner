import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/authMiddleware';
import { rateLimit } from '@/lib/rateLimit';
import { DailyCheckin, Patient, ProgressReport } from '@prisma/client';

/**
 * Get week bounds (Monday to Sunday) for a given date
 * Creates NEW Date objects to avoid mutation
 */
function getWeekBounds(date: Date) {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  
  // Create new Date objects to avoid mutating the input
  const monday = new Date(date);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);
  
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  
  return {
    weekStart: monday.toISOString().split('T')[0],
    weekEnd: sunday.toISOString().split('T')[0],
  };
}

interface CheckinForAnalysis {
  date: Date;
  painLevel: number | null;
  energyLevel: number | null;
  sleepQuality: number | null;
  mood: number | null;
}

function analyzeProgress(checkins: CheckinForAnalysis[], patientName: string): string {
  if (checkins.length === 0) {
    return `Brak danych do analizy dla pacjenta ${patientName}.`;
  }

  const validCheckins = checkins.filter(c => 
    c.painLevel !== null && c.energyLevel !== null && 
    c.sleepQuality !== null && c.mood !== null
  );
  
  if (validCheckins.length === 0) {
    return `Brak kompletnych danych do analizy dla pacjenta ${patientName}.`;
  }

  const avgPain = validCheckins.reduce((sum, c) => sum + (c.painLevel || 0), 0) / validCheckins.length;
  const avgEnergy = validCheckins.reduce((sum, c) => sum + (c.energyLevel || 0), 0) / validCheckins.length;
  const avgSleep = validCheckins.reduce((sum, c) => sum + (c.sleepQuality || 0), 0) / validCheckins.length;
  const avgMood = validCheckins.reduce((sum, c) => sum + (c.mood || 0), 0) / validCheckins.length;
  
  const avgReadiness = Math.round(((10 - avgPain) + avgEnergy + avgSleep + avgMood) / 4 * 10);
  
  let analysis = `## Analiza postępów\n\n`;
  analysis += `**Średnie wskaźniki:**\n`;
  analysis += `- Ból: ${avgPain.toFixed(1)}/10\n`;
  analysis += `- Energia: ${avgEnergy.toFixed(1)}/10\n`;
  analysis += `- Sen: ${avgSleep.toFixed(1)}/10\n`;
  analysis += `- Nastrój: ${avgMood.toFixed(1)}/10\n`;
  analysis += `- Ogólna gotowość: ${avgReadiness}/100\n\n`;
  
  if (avgReadiness >= 70) {
    analysis += `**Ocena:** ✅ Świetne postępy! Ogólna gotowość jest wysoka.\n\n`;
  } else if (avgReadiness >= 50) {
    analysis += `**Ocena:** ⚠️ Umiarkowane postępy. Zalecamy regularność w ćwiczeniach.\n\n`;
  } else {
    analysis += `**Ocena:** ❌ Wymaga uwagi. Rozważ konsultację ze specjalistą.\n\n`;
  }

  const lastCheckin = validCheckins[validCheckins.length - 1];
  const firstCheckin = validCheckins[0];
  
  if (lastCheckin && firstCheckin) {
    const painTrend = (lastCheckin.painLevel || 0) < (firstCheckin.painLevel || 0);
    const energyTrend = (lastCheckin.energyLevel || 0) > (firstCheckin.energyLevel || 0);
    
    analysis += `**Trend:**\n`;
    if (painTrend) {
      analysis += `- Ból zmniejszył się ✓\n`;
    }
    if (energyTrend) {
      analysis += `- Energia wzrosła ✓\n`;
    }
  }
  
  analysis += `\n**Rekomendacje:**\n`;
  if (avgPain > 5) {
    analysis += `- Zredukuj intensywność ćwiczeń\n`;
  }
  if (avgSleep < 5) {
    analysis += `- Popraw higienę snu\n`;
  }
  if (avgEnergy < 5) {
    analysis += `- Zadbaj o regenerację między treningami\n`;
  }
  if (avgPain <= 3 && avgEnergy >= 7) {
    analysis += `- Możesz zwiększyć intensywność treningów\n`;
  }
  
  return analysis;
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

    if (!patientId) {
      return NextResponse.json({ error: 'patientId is required' }, { status: 400 });
    }

    const reports = await prisma.progressReport.findMany({
      where: { patientId },
      orderBy: { weekStart: 'desc' },
    });

    return NextResponse.json(reports, { headers: { 'X-RateLimit-Remaining': String(remaining) } });
  } catch (error) {
    console.error('Failed to fetch reports:', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}

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

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON in request body' },
      { status: 400 }
    );
  }
  
  const { patientId } = body;

  if (!patientId) {
    return NextResponse.json({ error: 'patientId is required' }, { status: 400 });
  }

  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
  });

  if (!patient) {
    return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
  }

  // Use new Date to avoid mutation
  const { weekStart, weekEnd } = getWeekBounds(new Date());

  const existingReport = await prisma.progressReport.findFirst({
    where: {
      patientId,
      weekStart,
    },
  });

  if (existingReport) {
    return NextResponse.json({ error: 'Report for this week already exists', report: existingReport }, { status: 400 });
  }

  const checkinsData = await prisma.dailyCheckin.findMany({
    where: {
      patientId,
      date: {
        gte: weekStart,
        lte: weekEnd,
      },
    },
    select: {
      date: true,
      painLevel: true,
      energyLevel: true,
      sleepQuality: true,
      mood: true,
    },
  });

  // Transform to match CheckinForAnalysis interface (date: Date)
  const checkins: CheckinForAnalysis[] = checkinsData.map(c => ({
    ...c,
    date: new Date(c.date),
  }));

  const aiAnalysis = analyzeProgress(checkins, patient.firstName);

  const report = await prisma.progressReport.create({
    data: {
      patientId,
      weekStart,
      weekEnd,
      summary: `Tygodniowy raport postępów dla ${patient.firstName} ${patient.lastName}`,
      aiAnalysis,
    },
  });

  return NextResponse.json(report, { headers: { 'X-RateLimit-Remaining': String(remaining) } });
}
