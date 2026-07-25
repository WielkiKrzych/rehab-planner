import { Exercise, BodyPart, ExerciseCategory } from '@/types';
import { clinicalTags, Phase, ytSearchUrl, PATHOLOGIES, ClinicalTag, Pathology } from '@/data/clinicalTags';

/** Kontekst kliniczny — pozwala podać scalone tagi (domyślne + nadpisania z /api/clinical-tags). */
export interface ClinicalContext {
  tags: Record<string, ClinicalTag>;
  pathologies: Pathology[];
}

export const DEFAULT_CONTEXT: ClinicalContext = {
  tags: clinicalTags,
  pathologies: PATHOLOGIES,
};

/**
 * Deterministyczny generator doboru ćwiczeń.
 * Zero AI — czysty scoring regułowy na podstawie tagów klinicznych.
 */

export interface GeneratorInput {
  bodyPart: BodyPart;
  pathologyId: string;
  phase: Phase;
  /** Poziom bólu NRS 0-10 */
  painLevel: number;
  /** Dostępny sprzęt (puste = tylko masa ciała) */
  availableEquipment: string[];
  /** Ile ćwiczeń dobrać (domyślnie 5) */
  count?: number;
}

export interface GeneratedExercise {
  exercise: Exercise;
  sets: number;
  reps?: number;
  holdSeconds?: number;
  tempo?: string;
  videoUrl: string;
  /** Krótkie uzasadnienie doboru */
  rationale: string;
  score: number;
}

export interface GeneratorResult {
  selected: GeneratedExercise[];
  warnings: string[];
}

/** Limity ćwiczeń per kategoria w planie 5-elementowym — wymuszają zbilansowany dobór. */
const CATEGORY_LIMITS: Record<ExerciseCategory, number> = {
  strength: 3,
  stretching: 2,
  mobility: 2,
  balance: 1,
};

/** Maks. trudność ćwiczenia w danej fazie. */
const PHASE_MAX_DIFFICULTY: Record<Phase, number> = { 1: 1, 2: 2, 3: 3 };

const DEFAULT_MAX_PAIN = 5;

interface ScoredExercise {
  exercise: Exercise;
  score: number;
  reasons: string[];
}

function scoreExercise(
  exercise: Exercise,
  input: GeneratorInput,
  ctx: ClinicalContext
): ScoredExercise | null {
  const tag = ctx.tags[exercise.id];
  const reasons: string[] = [];
  let score = 0;

  // --- Twarde wykluczenia ---
  if (tag?.contraindicatedIn?.includes(input.pathologyId)) return null;

  const maxPain = tag?.maxPain ?? DEFAULT_MAX_PAIN;
  if (input.painLevel > maxPain) return null;

  if (exercise.difficulty > PHASE_MAX_DIFFICULTY[input.phase]) return null;

  // Sprzęt: każdy wymagany element musi być dostępny
  const available = input.availableEquipment.map((e) => e.toLowerCase());
  const missing = exercise.equipment.filter((e) => !available.includes(e.toLowerCase()));
  if (missing.length > 0) return null;

  // --- Scoring ---
  if (tag?.pathologies.includes(input.pathologyId)) {
    score += 50;
    reasons.push('dopasowane do patologii');
  } else if (exercise.bodyPart === input.bodyPart) {
    score += 10;
    reasons.push('ten sam region ciała');
  } else {
    // ćwiczenie z innego regionu bez tagu patologii — nie ma podstaw do doboru
    return null;
  }

  if (tag) {
    if (tag.phases.includes(input.phase)) {
      score += 25;
      reasons.push(`odpowiednie dla fazy ${input.phase}`);
    } else {
      const closest = Math.min(...tag.phases.map((p) => Math.abs(p - input.phase)));
      score -= 20 * closest;
    }
  }

  // Premia za margines bezpieczeństwa bólowego
  score += Math.min(maxPain - input.painLevel, 3) * 2;

  // Dopasowanie trudności do fazy: w fazie 3 premiuj trudniejsze, w fazie 1 łatwiejsze
  if (input.phase === 3) score += exercise.difficulty * 3;
  if (input.phase === 1) score += (2 - exercise.difficulty) * 3;

  return { exercise, score, reasons };
}

/** Reguły dawkowania per kategoria i faza (nadpisywane przez tag.dosage). */
function dosageFor(
  exercise: Exercise,
  phase: Phase,
  ctx: ClinicalContext
): { sets: number; reps?: number; holdSeconds?: number } {
  const tag = ctx.tags[exercise.id];
  if (tag?.dosage) return tag.dosage;

  switch (exercise.category) {
    case 'strength':
      if (phase === 1) return { sets: 2, reps: exercise.reps ?? 10 };
      if (phase === 2) return { sets: 3, reps: exercise.reps ?? 12 };
      return { sets: 3, reps: exercise.reps ?? 8 };
    case 'stretching':
      return { sets: 3, reps: 1, holdSeconds: 30 };
    case 'mobility':
      return { sets: phase === 1 ? 2 : 3, reps: exercise.reps ?? 10 };
    case 'balance':
      return { sets: 3, reps: 1, holdSeconds: phase === 3 ? 45 : 30 };
  }
}

export function generatePlan(
  input: GeneratorInput,
  exercises: Exercise[],
  ctx: ClinicalContext = DEFAULT_CONTEXT
): GeneratorResult {
  const count = input.count ?? 5;
  const warnings: string[] = [];

  const pathology = ctx.pathologies.find((p) => p.id === input.pathologyId);
  if (!pathology) {
    return { selected: [], warnings: ['Nieznana patologia.'] };
  }

  if (input.painLevel >= 7) {
    warnings.push(
      'Ból ≥7/10 — dobór ograniczony do ćwiczeń o niskiej intensywności. Rozważ weryfikację diagnozy przed obciążaniem.'
    );
  }

  const scored = exercises
    .map((ex) => scoreExercise(ex, input, ctx))
    .filter((s): s is ScoredExercise => s !== null)
    .sort((a, b) => b.score - a.score);

  // Greedy z limitami kategorii — wymusza zbilansowany plan
  const categoryCount: Record<string, number> = {};
  const selected: ScoredExercise[] = [];

  for (const s of scored) {
    if (selected.length >= count) break;
    const cat = s.exercise.category;
    if ((categoryCount[cat] ?? 0) >= CATEGORY_LIMITS[cat]) continue;
    selected.push(s);
    categoryCount[cat] = (categoryCount[cat] ?? 0) + 1;
  }

  // Dobij do count, jeśli limity kategorii zablokowały wybór
  if (selected.length < count) {
    for (const s of scored) {
      if (selected.length >= count) break;
      if (!selected.includes(s)) selected.push(s);
    }
  }

  if (selected.length < count) {
    warnings.push(
      `Znaleziono tylko ${selected.length} odpowiednich ćwiczeń dla podanych kryteriów. Rozważ zmianę fazy lub dodanie sprzętu.`
    );
  }

  const result: GeneratedExercise[] = selected.map((s) => {
    const dosage = dosageFor(s.exercise, input.phase, ctx);
    const tag = ctx.tags[s.exercise.id];
    return {
      exercise: s.exercise,
      sets: dosage.sets,
      reps: dosage.reps,
      holdSeconds: dosage.holdSeconds,
      tempo: s.exercise.category === 'strength' ? tag?.tempo : undefined,
      videoUrl: ytSearchUrl(s.exercise.name),
      rationale: s.reasons.join(', '),
      score: s.score,
    };
  });

  return { selected: result, warnings };
}

// ===== Progresja wielotygodniowa =====

export interface WeeklyDose {
  weekNumber: number;
  focus: string;
  exercises: Array<{
    exerciseId: string;
    sets: number;
    reps?: number;
    holdSeconds?: number;
    tempo?: string;
    notes?: string;
  }>;
}

/**
 * Rozkłada dobrane ćwiczenia na 1-4 tygodnie z progresją obciążenia.
 * Reguły (konserwatywne, w ramach tej samej fazy):
 *  - tydz. 2: +1 seria dla ćwiczeń siłowych (maks 4), izometria +10 s (maks 60)
 *  - tydz. 3: +2 powtórzenia (maks 15) lub hold +10 s
 *  - tydz. 4: konsolidacja — parametry tygodnia 3 (deload decyzją terapeuty)
 */
export function progressWeeks(
  selected: GeneratedExercise[],
  weeksCount: number
): WeeklyDose[] {
  const clamp = (v: number, max: number) => Math.min(v, max);
  const weekFocus = [
    'Adaptacja — nauka wzorca, kontrola bólu',
    'Progresja objętości',
    'Progresja intensywności',
    'Konsolidacja',
  ];

  return Array.from({ length: Math.max(1, Math.min(4, weeksCount)) }, (_, wi) => {
    const week = wi + 1;
    return {
      weekNumber: week,
      focus: weekFocus[wi],
      exercises: selected.map((g) => {
        let sets = g.sets;
        let reps = g.reps;
        let holdSeconds = g.holdSeconds;
        const isStrength = g.exercise.category === 'strength';

        if (week >= 2 && isStrength) sets = clamp(sets + 1, 4);
        if (week >= 2 && holdSeconds) holdSeconds = clamp(holdSeconds + 10, 60);
        if (week >= 3 && reps) reps = clamp(reps + 2, 15);
        if (week >= 3 && holdSeconds) holdSeconds = clamp(holdSeconds + 10, 75);

        return {
          exerciseId: g.exercise.id,
          sets,
          reps,
          holdSeconds,
          tempo: g.tempo,
          notes: g.tempo ? `Tempo ${g.tempo}` : undefined,
        };
      }),
    };
  });
}
