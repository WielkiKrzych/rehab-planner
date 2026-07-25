import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/authMiddleware';
import { rateLimit } from '@/lib/rateLimit';
import { z } from 'zod';
import {
  readOverrides,
  writeOverrides,
  getMerged,
} from '@/lib/clinicalStore';
import { defaultExercises } from '@/data/exercises';

const BODY_PARTS = ['knee', 'shoulder', 'spine', 'hip', 'ankle', 'wrist', 'elbow', 'neck'] as const;

const TagSchema = z.object({
  pathologies: z.array(z.string().min(1).max(64)).max(30),
  phases: z.array(z.union([z.literal(1), z.literal(2), z.literal(3)])).min(1).max(3),
  maxPain: z.number().int().min(0).max(10).optional(),
  tempo: z
    .string()
    .regex(/^\d-\d-\d-\d$/, 'Tempo w formacie E-P-K-P, np. 3-0-1-0')
    .optional(),
  contraindicatedIn: z.array(z.string().min(1).max(64)).max(30).optional(),
  dosage: z
    .object({
      sets: z.number().int().min(1).max(10),
      reps: z.number().int().min(1).max(50).optional(),
      holdSeconds: z.number().int().min(1).max(300).optional(),
    })
    .optional(),
});

const PutSchema = z.object({
  exerciseId: z.string().min(1).max(100),
  tag: TagSchema,
});

const DeleteSchema = z.object({
  exerciseId: z.string().min(1).max(100),
});

const PathologySchema = z.object({
  id: z
    .string()
    .min(2)
    .max(48)
    .regex(/^[a-z0-9-]+$/, 'Tylko małe litery, cyfry i myślniki'),
  label: z.string().min(3).max(160),
  bodyParts: z.array(z.enum(BODY_PARTS)).min(1),
});

/** GET — scalone tagi + katalog patologii */
export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;

  return NextResponse.json(await getMerged());
}

/** PUT — zapisz nadpisanie tagu dla ćwiczenia */
export async function PUT(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;
  const { allowed } = rateLimit(request);
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  const body = await request.json();
  const validation = PutSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: validation.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { exerciseId, tag } = validation.data;

  if (!defaultExercises.some((e) => e.id === exerciseId)) {
    return NextResponse.json({ error: 'Nieznane ćwiczenie' }, { status: 404 });
  }

  const overrides = await readOverrides();
  overrides.tags[exerciseId] = tag;
  await writeOverrides(overrides);

  return NextResponse.json(await getMerged());
}

/** DELETE — usuń nadpisanie (przywróć domyślne) */
export async function DELETE(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  const body = await request.json();
  const validation = DeleteSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
  }

  const overrides = await readOverrides();
  delete overrides.tags[validation.data.exerciseId];
  await writeOverrides(overrides);

  return NextResponse.json(await getMerged());
}

/** POST — dodaj własną patologię do katalogu */
export async function POST(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;
  const { allowed } = rateLimit(request);
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  const body = await request.json();
  const validation = PathologySchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: validation.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const overrides = await readOverrides();
  const merged = await getMerged();
  if (merged.pathologies.some((p) => p.id === validation.data.id)) {
    return NextResponse.json({ error: 'Patologia o tym id już istnieje' }, { status: 409 });
  }

  overrides.pathologies.push(validation.data);
  await writeOverrides(overrides);

  return NextResponse.json(await getMerged());
}
