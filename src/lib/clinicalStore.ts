import { promises as fs } from 'fs';
import path from 'path';
import {
  clinicalTags as defaultTags,
  PATHOLOGIES as defaultPathologies,
  ClinicalTag,
  Pathology,
} from '@/data/clinicalTags';

/**
 * Trwałe nadpisania tagów klinicznych — plik JSON obok bazy.
 * Defaults żyją w kodzie (clinicalTags.ts); tu tylko różnice + własne patologie.
 * Format pliku: { tags: Record<exerciseId, ClinicalTag>, pathologies: Pathology[] }
 */

export interface ClinicalOverrides {
  tags: Record<string, ClinicalTag>;
  pathologies: Pathology[];
}

const FILE = path.join(process.cwd(), 'data', 'clinical-overrides.json');

export async function readOverrides(): Promise<ClinicalOverrides> {
  try {
    const raw = await fs.readFile(FILE, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<ClinicalOverrides>;
    return {
      tags: parsed.tags ?? {},
      pathologies: parsed.pathologies ?? [],
    };
  } catch {
    return { tags: {}, pathologies: [] };
  }
}

export async function writeOverrides(overrides: ClinicalOverrides): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  const tmp = `${FILE}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(overrides, null, 2), 'utf-8');
  await fs.rename(tmp, FILE); // zapis atomowy
}

/** Scalone tagi: nadpisanie zastępuje default w całości (prostota > spryt). */
export function mergeTags(
  overrides: ClinicalOverrides
): Record<string, ClinicalTag> {
  return { ...defaultTags, ...overrides.tags };
}

/** Scalony katalog patologii: defaulty + własne (bez duplikatów id). */
export function mergePathologies(overrides: ClinicalOverrides): Pathology[] {
  const ids = new Set(defaultPathologies.map((p) => p.id));
  return [
    ...defaultPathologies,
    ...overrides.pathologies.filter((p) => !ids.has(p.id)),
  ];
}

export async function getMerged() {
  const overrides = await readOverrides();
  return {
    tags: mergeTags(overrides),
    pathologies: mergePathologies(overrides),
    overriddenIds: Object.keys(overrides.tags),
    customPathologyIds: overrides.pathologies.map((p) => p.id),
  };
}
