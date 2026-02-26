import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/authMiddleware';
import { Patient } from '@prisma/client';

/**
 * Sanitize CSV value to prevent CSV Injection attacks
 * Prefix dangerous characters with single quote to prevent formula execution
 */
function sanitizeCSV(value: string | null | undefined): string {
  if (value === null || value === undefined) {
    return '';
  }
  
  const strValue = String(value);
  
  // Escape double quotes by doubling them
  const escaped = strValue.replace(/"/g, '""');
  
  // Check for dangerous characters that could trigger formula execution
  // These characters at the start of a cell can trigger Excel/LibreOffice formulas
  if (/^[=+\-@\t\r]/.test(escaped)) {
    return "'" + escaped;
  }
  
  return escaped;
}

interface PatientWithRelations {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  phone: string | null;
  email: string | null;
  notes: string;
  diagnoses: Array<{ id: string; name: string; date: string; notes: string | null }>;
  plans: Array<{ id: string; name: string; status: string; weeks: unknown[] }>;
  createdAt: Date;
  updatedAt: Date;
}

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
    }) as PatientWithRelations[];

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

      const rows = patients.map((p) => [
        sanitizeCSV(p.id),
        sanitizeCSV(p.firstName),
        sanitizeCSV(p.lastName),
        sanitizeCSV(p.birthDate),
        sanitizeCSV(p.phone),
        sanitizeCSV(p.email),
        sanitizeCSV(p.notes),
        sanitizeCSV(String(p.diagnoses.length)),
        sanitizeCSV(String(p.plans.length)),
        sanitizeCSV(p.createdAt.toISOString()),
        sanitizeCSV(p.updatedAt.toISOString()),
      ]);

      const csvContent = [
        headers.map(h => `"${h}"`).join(','),
        ...rows.map((row) =>
          row.map((cell) => `"${cell}"`).join(',')
        ),
      ].join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8;',
          'Content-Disposition': `attachment; filename="patients-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    } else if (format === 'json') {
      const exportData = patients.map((p) => ({
        id: p.id,
        firstName: p.firstName,
        lastName: p.lastName,
        birthDate: p.birthDate,
        phone: p.phone,
        email: p.email,
        notes: p.notes,
        diagnoses: p.diagnoses.map((d) => ({
          name: d.name,
          date: d.date,
          notes: d.notes,
        })),
        plans: p.plans.map((pl) => ({
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
