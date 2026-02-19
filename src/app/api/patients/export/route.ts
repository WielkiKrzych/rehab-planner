import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/authMiddleware';

export async function GET(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'csv';

    const patients = await prisma.patient.findMany({
      include: {
        diagnoses: true,
        plans: {
          include: {
            weeks: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    if (format === 'csv') {
      const headers = [
        'ID',
        'Imię',
        'Nazwisko',
        'Data urodzenia',
        'Telefon',
        'Email',
        'Notatki',
        'Liczba diagnoz',
        'Liczba planów',
        'Data utworzenia',
        'Data aktualizacji',
      ];

      const rows = patients.map((p: any) => [
        p.id,
        p.firstName,
        p.lastName,
        p.birthDate,
        p.phone || '',
        p.email || '',
        p.notes.replace(/"/g, '""'),
        p.diagnoses.length,
        p.plans.length,
        p.createdAt.toISOString(),
        p.updatedAt.toISOString(),
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map((row: any) =>
          row.map((cell: any) => `"${cell}"`).join(',')
        ),
      ].join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8;',
          'Content-Disposition': `attachment; filename="patients-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    } else if (format === 'json') {
      const exportData = patients.map((p: any) => ({
        id: p.id,
        firstName: p.firstName,
        lastName: p.lastName,
        birthDate: p.birthDate,
        phone: p.phone,
        email: p.email,
        notes: p.notes,
        diagnoses: p.diagnoses.map((d: any) => ({
          name: d.name,
          date: d.date,
          notes: d.notes,
        })),
        plans: p.plans.map((pl: any) => ({
          name: pl.name,
          status: pl.status,
          weeksCount: pl.weeks.length,
        })),
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      }));

      const jsonContent = JSON.stringify(exportData, null, 2);

      return new NextResponse(jsonContent, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8;',
          'Content-Disposition': `attachment; filename="patients-${new Date().toISOString().split('T')[0]}.json"`,
        },
      });
    } else {
      return NextResponse.json(
        { error: 'Unsupported format. Use csv or json.' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Failed to export patients:', error);
    return NextResponse.json(
      { error: 'Failed to export patients' },
      { status: 500 }
    );
  }
}
