import { describe, it, expect } from 'vitest';
import { mergeTags, mergePathologies } from './clinicalStore';
import { clinicalTags, PATHOLOGIES } from '@/data/clinicalTags';
import { generatePlan } from './planGenerator';
import { defaultExercises } from '@/data/exercises';

describe('clinicalStore merge', () => {
  it('bez nadpisań zwraca domyślne', () => {
    const merged = mergeTags({ tags: {}, pathologies: [] });
    expect(merged).toEqual(clinicalTags);
    expect(mergePathologies({ tags: {}, pathologies: [] })).toEqual(PATHOLOGIES);
  });

  it('nadpisanie zastępuje default w całości', () => {
    const merged = mergeTags({
      tags: { 'wall-sits': { pathologies: ['knee-oa'], phases: [1], maxPain: 8 } },
      pathologies: [],
    });
    expect(merged['wall-sits'].pathologies).toEqual(['knee-oa']);
    expect(merged['wall-sits'].maxPain).toBe(8);
    expect(merged['mini-squats']).toEqual(clinicalTags['mini-squats']);
  });

  it('własna patologia dokleja się do katalogu, duplikat id jest ignorowany', () => {
    const merged = mergePathologies({
      tags: {},
      pathologies: [
        { id: 'de-quervain', label: 'Zespół de Quervaina', bodyParts: ['wrist'] },
        { id: 'pfps', label: 'DUPLIKAT', bodyParts: ['knee'] },
      ],
    });
    expect(merged.some((p) => p.id === 'de-quervain')).toBe(true);
    expect(merged.filter((p) => p.id === 'pfps')).toHaveLength(1);
    expect(merged.find((p) => p.id === 'pfps')!.label).not.toBe('DUPLIKAT');
  });

  it('generator honoruje nadpisany kontekst (przeciwwskazanie wyklucza ćwiczenie)', () => {
    const tags = mergeTags({
      tags: { 'wall-sits': { ...clinicalTags['wall-sits'], contraindicatedIn: ['pfps'] } },
      pathologies: [],
    });
    const { selected } = generatePlan(
      { bodyPart: 'knee', pathologyId: 'pfps', phase: 2, painLevel: 3,
        availableEquipment: ['resistance band', 'towel', 'step', 'bench', 'foam roller'] },
      defaultExercises,
      { tags, pathologies: PATHOLOGIES }
    );
    expect(selected.map((g) => g.exercise.id)).not.toContain('wall-sits');
  });

  it('generator widzi własną patologię z kontekstu', () => {
    const custom = { id: 'test-path', label: 'Test', bodyParts: ['knee' as const] };
    const tags = mergeTags({
      tags: { 'mini-squats': { pathologies: ['test-path'], phases: [2] } },
      pathologies: [custom],
    });
    const { selected } = generatePlan(
      { bodyPart: 'knee', pathologyId: 'test-path', phase: 2, painLevel: 3, availableEquipment: [] },
      defaultExercises,
      { tags, pathologies: mergePathologies({ tags: {}, pathologies: [custom] }) }
    );
    expect(selected.map((g) => g.exercise.id)).toContain('mini-squats');
  });
});
