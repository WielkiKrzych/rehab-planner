import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { rateLimit } from '@/lib/rateLimit';
import { PatientSchema } from '@/lib/validations';
import { requireAuth } from '@/lib/authMiddleware';

// Maximum limit for pagination to prevent memory exhaustion
const MAX_PAGINATION_LIMIT = 100;
const DEFAULT_PAGINATION_LIMIT = 20;

/**
 * Parse and validate pagination parameters
 */
function parsePagination(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(
    Math.max(1, parseInt(searchParams.get('limit') || String(DEFAULT_PAGINATION_LIMIT))),
    MAX_PAGINATION_LIMIT
  );
  const skip = (page - 1) * limit;
  return { page, limit, skip };
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
    const search = searchParams.get('search') || '';
    const { page, limit, skip } = parsePagination(searchParams);

    const where = search
      ? {
          OR: [
            { firstName: { contains: search } },
            { lastName: { contains: search } },
            { email: { contains: search } },
            { phone: { contains: search } },
          ],
        }
      : {};

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        include: {
          diagnoses: true,
          plans: true,
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.patient.count({ where }),
    ]);

    return NextResponse.json(patients, {
      headers: {
        'X-RateLimit-Remaining': String(remaining),
        'X-Total-Count': String(total),
        'X-Total-Pages': String(Math.ceil(total / limit)),
      },
    });
  } catch (error) {
    console.error('Failed to fetch patients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patients' },
      { status: 500 }
    );
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
  
  const validation = PatientSchema.safeParse(body);
  
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: validation.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  
  const { firstName, lastName, birthDate, phone, email, notes } = validation.data;
  
  const patient = await prisma.patient.create({
    data: {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      birthDate,
      phone: phone || null,
      email: email || null,
      notes: notes || '',
    },
  });
  return NextResponse.json(patient, {
    headers: { 'X-RateLimit-Remaining': String(remaining) },
  });
}
