import { describe, it, expect } from 'vitest';
import { generatePlan, progressWeeks } from './planGenerator';
import { defaultExercises } from '@/data/exercises';
import { clinicalTags, PATHOLOGIES } from '@/data/clinicalTags';

const baseInput = {
  bodyPart: 'knee' as const,
  pathologyId: 'pfps',
  phase: 2 as const,
  painLevel: 3,
  availableEquipment: ['resistance band', 'towel', 'step', 'bench', 'foam roller'],
};

describe('generatePlan', () => {
  it('zwraca 5 ćwiczeń dla typowego przypadku PFPS', () => {
    const { selected } = generatePlan(baseInput, defaultExercises);
    expect(selected).toHaveLength(5);
  });

  it('każde wybrane ćwiczenie ma dawkowanie i link wideo', () => {
    const { selected } = generatePlan(baseInput, defaultExercises);
    for (const g of selected) {
      expect(g.sets).toBeGreaterThan(0);
      expect(g.reps || g.holdSeconds).toBeTruthy();
      expect(g.videoUrl).toContain('youtube.com');
    }
  });

  it('nie zwraca duplikatów', () => {
    const { selected } = generatePlan(baseInput, defaultExercises);
    const ids = selected.map((g) => g.exercise.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('wyklucza ćwiczenia wymagające niedostępnego sprzętu', () => {
    const { selected } = generatePlan(
      { ...baseInput, availableEquipment: [] },
      defaultExercises
    );
    for (const g of selected) {
      expect(g.exercise.equipment).toHaveLength(0);
    }
  });

  it('respektuje bramkę bólową (ból 8/10 -> tylko ćwiczenia o wysokim maxPain)', () => {
    const { selected, warnings } = generatePlan(
      { ...baseInput, painLevel: 8, phase: 1 },
      defaultExercises
    );
    expect(warnings.length).toBeGreaterThan(0);
    for (const g of selected) {
      const tag = clinicalTags[g.exercise.id];
      expect(tag?.maxPain ?? 5).toBeGreaterThanOrEqual(8);
    }
  });

  it('wyklucza ćwiczenia przeciwwskazane dla patologii (disc: bez zgięciowych)', () => {
    const { selected } = generatePlan(
      { ...baseInput, bodyPart: 'spine', pathologyId: 'disc' },
      defaultExercises
    );
    const ids = selected.map((g) => g.exercise.id);
    expect(ids).not.toContain('knee-to-chest-stretch');
    expect(ids).not.toContain('child-pose');
  });

  it('w fazie 1 nie dobiera ćwiczeń o trudności 3', () => {
    const { selected } = generatePlan(
      { ...baseInput, phase: 1, pathologyId: 'acl-rehab' },
      defaultExercises
    );
    for (const g of selected) {
      expect(g.exercise.difficulty).toBeLessThanOrEqual(1);
    }
  });

  it('generuje wynik dla każdej patologii z katalogu (min. 3 ćwiczenia)', () => {
    for (const p of PATHOLOGIES) {
      const { selected } = generatePlan(
        {
          bodyPart: p.bodyParts[0],
          pathologyId: p.id,
          phase: 2,
          painLevel: 3,
          availableEquipment: ['resistance band', 'towel', 'step', 'bench', 'foam roller', 'dumbbell', 'marbles', 'stress ball', 'grip strengthener', 'hammer'],
        },
        defaultExercises
      );
      expect(selected.length, `patologia: ${p.id}`).toBeGreaterThanOrEqual(3);
    }
  });
});

describe('progressWeeks', () => {
  const { selected } = generatePlan(baseInput, defaultExercises);

  it('zwraca żądaną liczbę tygodni (1-4, clamp)', () => {
    expect(progressWeeks(selected, 3)).toHaveLength(3);
    expect(progressWeeks(selected, 0)).toHaveLength(1);
    expect(progressWeeks(selected, 9)).toHaveLength(4);
  });

  it('tydzień 2: siłowe +1 seria (maks 4)', () => {
    const [w1, w2] = progressWeeks(selected, 2);
    w1.exercises.forEach((e1, i) => {
      const ex = defaultExercises.find((x) => x.id === e1.exerciseId)!;
      const e2 = w2.exercises[i];
      if (ex.category === 'strength') {
        expect(e2.sets).toBe(Math.min(e1.sets + 1, 4));
      }
      expect(e2.sets).toBeLessThanOrEqual(4);
    });
  });

  it('tydzień 3: reps rosną maks do 15', () => {
    const weeks = progressWeeks(selected, 3);
    weeks[2].exercises.forEach((e) => {
      if (e.reps) expect(e.reps).toBeLessThanOrEqual(15);
      if (e.holdSeconds) expect(e.holdSeconds).toBeLessThanOrEqual(75);
    });
  });
});
