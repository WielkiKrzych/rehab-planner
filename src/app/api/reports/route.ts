import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/authMiddleware';

function getWeekBounds(date: Date) {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(date.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  
  return {
    weekStart: monday.toISOString().split('T')[0],
    weekEnd: sunday.toISOString().split('T')[0],
  };
}

function analyzeProgress(checkins: any[], patientName: string) {
  if (checkins.length === 0) {
    return `Brak danych do analizy dla pacjenta ${patientName}.`;
  }

  const avgPain = checkins.reduce((sum, c) => sum + (c.painLevel || 0), 0) / checkins.length;
  const avgEnergy = checkins.reduce((sum, c) => sum + (c.energyLevel || 0), 0) / checkins.length;
  const avgSleep = checkins.reduce((sum, c) => sum + (c.sleepQuality || 0), 0) / checkins.length;
  const avgMood = checkins.reduce((sum, c) => sum + (c.mood || 0), 0) / checkins.length;
  
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

  const painTrend = checkins[checkins.length - 1]?.painLevel < checkins[0]?.painLevel;
  const energyTrend = checkins[checkins.length - 1]?.energyLevel > checkins[0]?.energyLevel;
  
  analysis += `**Trend:**\n`;
  if (painTrend) {
    analysis += `- Ból zmniejszył się ✓\n`;
  }
  if (energyTrend) {
    analysis += `- Energia wzrosła ✓\n`;
  }
  
  analysis += `\n**Rekomendacje:**\n`;
  if (avgPain > 5) {
    analysis += `- Zredukuj intensywność ćwiczeń\n`;
  }
  if (avgSleep < 5) {
    analysis += `- Popraw hygiene snu\n`;
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

    return NextResponse.json(reports);
  } catch (error) {
    console.error('Failed to fetch reports:', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const body = await request.json();
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

    const checkins = await prisma.dailyCheckin.findMany({
      where: {
        patientId,
        date: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
    });

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

    return NextResponse.json(report);
  } catch (error) {
    console.error('Failed to generate report:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}
