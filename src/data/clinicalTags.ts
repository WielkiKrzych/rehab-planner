import { BodyPart } from '@/types';

/**
 * Warstwa danych klinicznych dla generatora planów.
 * Fazy rehabilitacji:
 *  1 = ostra/ochronna (kontrola bólu, wczesna mobilizacja)
 *  2 = podostra/przebudowa (odbudowa siły i zakresu ruchu)
 *  3 = funkcjonalna (powrót do aktywności, obciążenia dynamiczne)
 *
 * Tempo w konwencji: ekscentryk-pauza-koncentryk-pauza (sekundy), np. "3-0-1-0".
 * maxPain = maksymalny akceptowalny poziom bólu (NRS 0-10), przy którym ćwiczenie
 * może być zalecone. Domyślnie 5.
 *
 * UWAGA KLINICZNA: tagowanie wstępne do weryfikacji przez fizjoterapeutę.
 */

export type Phase = 1 | 2 | 3;

export interface Pathology {
  id: string;
  label: string;
  bodyParts: BodyPart[];
}

export const PATHOLOGIES: Pathology[] = [
  // Kolano
  { id: 'pfps', label: 'Zespół bólu rzepkowo-udowego (PFPS)', bodyParts: ['knee', 'hip'] },
  { id: 'acl-rehab', label: 'Stan po rekonstrukcji / uszkodzeniu ACL', bodyParts: ['knee'] },
  { id: 'meniscus', label: 'Uszkodzenie łąkotki / stan po artroskopii', bodyParts: ['knee'] },
  { id: 'knee-oa', label: 'Choroba zwyrodnieniowa stawu kolanowego', bodyParts: ['knee'] },
  { id: 'patellar-tendinopathy', label: 'Tendinopatia więzadła rzepki (kolano skoczka)', bodyParts: ['knee'] },
  { id: 'itbs', label: 'Zespół pasma biodrowo-piszczelowego (ITBS)', bodyParts: ['knee', 'hip'] },
  // Bark
  { id: 'subacromial', label: 'Zespół podbarkowy / tendinopatia stożka rotatorów', bodyParts: ['shoulder'] },
  { id: 'frozen-shoulder', label: 'Bark zamrożony (adhesive capsulitis)', bodyParts: ['shoulder'] },
  { id: 'shoulder-instability', label: 'Niestabilność stawu ramiennego', bodyParts: ['shoulder'] },
  { id: 'post-op-rc', label: 'Stan po szyciu stożka rotatorów', bodyParts: ['shoulder'] },
  // Kręgosłup
  { id: 'nslbp', label: 'Niespecyficzny ból odcinka lędźwiowego', bodyParts: ['spine'] },
  { id: 'disc', label: 'Dyskopatia / objawy korzeniowe (L-S)', bodyParts: ['spine'] },
  // Biodro
  { id: 'hip-oa', label: 'Choroba zwyrodnieniowa stawu biodrowego', bodyParts: ['hip'] },
  { id: 'gtps', label: 'Zespół bólu krętarza większego (GTPS)', bodyParts: ['hip'] },
  { id: 'fai', label: 'Konflikt udowo-panewkowy (FAI)', bodyParts: ['hip'] },
  { id: 'piriformis', label: 'Zespół mięśnia gruszkowatego', bodyParts: ['hip'] },
  // Staw skokowy / stopa
  { id: 'ankle-sprain', label: 'Skręcenie stawu skokowego', bodyParts: ['ankle'] },
  { id: 'achilles', label: 'Tendinopatia ścięgna Achillesa', bodyParts: ['ankle'] },
  { id: 'plantar-fasciitis', label: 'Zapalenie rozcięgna podeszwowego', bodyParts: ['ankle'] },
  // Nadgarstek / łokieć
  { id: 'lateral-epi', label: 'Łokieć tenisisty (epikondylopatia boczna)', bodyParts: ['wrist', 'elbow'] },
  { id: 'medial-epi', label: 'Łokieć golfisty (epikondylopatia przyśrodkowa)', bodyParts: ['wrist', 'elbow'] },
  { id: 'cts', label: 'Zespół cieśni nadgarstka', bodyParts: ['wrist'] },
  { id: 'wrist-sprain', label: 'Skręcenie / stan po unieruchomieniu nadgarstka', bodyParts: ['wrist'] },
  { id: 'post-immob-elbow', label: 'Stan po unieruchomieniu łokcia', bodyParts: ['elbow'] },
  // Szyja
  { id: 'neck-pain', label: 'Niespecyficzny ból szyi', bodyParts: ['neck'] },
  { id: 'cgh', label: 'Ból głowy pochodzenia szyjnego', bodyParts: ['neck'] },
  { id: 'upper-cross', label: 'Zespół skrzyżowania górnego (postawa)', bodyParts: ['neck', 'shoulder'] },
];

export interface ClinicalTag {
  pathologies: string[];
  phases: Phase[];
  /** Maks. poziom bólu NRS, przy którym ćwiczenie jest bezpieczne. Domyślnie 5. */
  maxPain?: number;
  /** Tempo dla ćwiczeń siłowych, np. "3-0-1-0". */
  tempo?: string;
  /** Patologie, przy których ćwiczenie jest przeciwwskazane. */
  contraindicatedIn?: string[];
  /** Nadpisanie domyślnego dawkowania. */
  dosage?: { sets: number; reps?: number; holdSeconds?: number };
}

/** Link do wyszukiwania YouTube — do podmiany na konkretne filmy. */
export function ytSearchUrl(exerciseName: string): string {
  const q = encodeURIComponent(`${exerciseName} exercise physiotherapy technique`);
  return `https://www.youtube.com/results?search_query=${q}`;
}

export const clinicalTags: Record<string, ClinicalTag> = {
  // ===== KOLANO =====
  'wall-sits': { pathologies: ['pfps', 'knee-oa', 'patellar-tendinopathy', 'acl-rehab'], phases: [2, 3], maxPain: 4, dosage: { sets: 3, holdSeconds: 40 } },
  'straight-leg-raises': { pathologies: ['acl-rehab', 'knee-oa', 'pfps', 'meniscus'], phases: [1, 2], maxPain: 6, tempo: '2-1-2-0' },
  'hamstring-curls': { pathologies: ['acl-rehab', 'meniscus', 'knee-oa'], phases: [2, 3], maxPain: 4, tempo: '3-0-1-0' },
  'step-ups': { pathologies: ['pfps', 'knee-oa', 'acl-rehab', 'meniscus'], phases: [2, 3], maxPain: 3, tempo: '2-0-2-0' },
  'mini-squats': { pathologies: ['pfps', 'knee-oa', 'acl-rehab', 'meniscus', 'patellar-tendinopathy'], phases: [2], maxPain: 4, tempo: '3-0-2-0' },
  'lunges': { pathologies: ['pfps', 'acl-rehab', 'patellar-tendinopathy'], phases: [3], maxPain: 2, tempo: '2-0-2-0' },
  'terminal-knee-extension': { pathologies: ['acl-rehab', 'pfps', 'meniscus'], phases: [1, 2], maxPain: 5, tempo: '2-1-2-0' },
  'patellar-mobilization': { pathologies: ['pfps', 'acl-rehab'], phases: [1], maxPain: 7 },
  'eccentric-squats': { pathologies: ['patellar-tendinopathy', 'pfps'], phases: [2, 3], maxPain: 5, tempo: '4-0-1-0', dosage: { sets: 3, reps: 15 } },
  'it-band-stretch': { pathologies: ['itbs', 'pfps'], phases: [1, 2, 3], maxPain: 7 },
  'foam-rolling-quads': { pathologies: ['pfps', 'patellar-tendinopathy', 'itbs', 'knee-oa'], phases: [1, 2, 3], maxPain: 7 },
  'single-leg-deadlift': { pathologies: ['acl-rehab', 'gtps', 'nslbp'], phases: [3], maxPain: 2, tempo: '3-0-2-0' },

  // ===== BARK =====
  'pendulum-swings': { pathologies: ['frozen-shoulder', 'post-op-rc', 'subacromial'], phases: [1], maxPain: 7 },
  'external-rotation': { pathologies: ['subacromial', 'shoulder-instability', 'post-op-rc'], phases: [2, 3], maxPain: 4, tempo: '3-0-2-0' },
  'internal-rotation': { pathologies: ['subacromial', 'shoulder-instability'], phases: [2], maxPain: 4, tempo: '3-0-2-0' },
  'wall-walks': { pathologies: ['frozen-shoulder', 'subacromial', 'post-op-rc'], phases: [1, 2], maxPain: 6 },
  'shoulder-blade-squeezes': { pathologies: ['subacromial', 'shoulder-instability', 'upper-cross'], phases: [1, 2], maxPain: 6 },
  'arm-circles': { pathologies: ['frozen-shoulder', 'subacromial'], phases: [1, 2], maxPain: 6 },
  'sleeper-stretch': { pathologies: ['subacromial', 'shoulder-instability'], phases: [2, 3], maxPain: 5, contraindicatedIn: ['frozen-shoulder'] },
  'cross-body-stretch': { pathologies: ['frozen-shoulder', 'subacromial'], phases: [2, 3], maxPain: 6 },
  'empty-can-raises': { pathologies: ['subacromial'], phases: [3], maxPain: 2, tempo: '2-0-2-0', contraindicatedIn: ['post-op-rc'] },
  'prone-y-raises': { pathologies: ['shoulder-instability', 'subacromial', 'upper-cross'], phases: [2, 3], maxPain: 4, tempo: '2-1-2-0' },
  'prone-horizontal-abduction': { pathologies: ['shoulder-instability', 'subacromial'], phases: [2, 3], maxPain: 4, tempo: '2-1-2-0' },
  'scapular-retraction': { pathologies: ['subacromial', 'shoulder-instability', 'upper-cross'], phases: [1, 2], maxPain: 6, tempo: '2-2-2-0' },
  'prone-w-y-t': { pathologies: ['shoulder-instability', 'upper-cross', 'subacromial'], phases: [2, 3], maxPain: 4, tempo: '2-1-2-0' },

  // ===== KRĘGOSŁUP =====
  'cat-cow-stretch': { pathologies: ['nslbp', 'disc'], phases: [1, 2, 3], maxPain: 7 },
  'bird-dog': { pathologies: ['nslbp', 'disc'], phases: [2, 3], maxPain: 4, tempo: '2-2-2-0' },
  'glute-bridge': { pathologies: ['nslbp', 'disc', 'gtps', 'hip-oa'], phases: [1, 2], maxPain: 5, tempo: '2-1-2-0' },
  'pelvic-tilts': { pathologies: ['nslbp', 'disc'], phases: [1], maxPain: 7 },
  'knee-to-chest-stretch': { pathologies: ['nslbp'], phases: [1, 2], maxPain: 6, contraindicatedIn: ['disc'] },
  'trunk-rotation': { pathologies: ['nslbp'], phases: [1, 2], maxPain: 6 },
  'dead-bug': { pathologies: ['nslbp', 'disc'], phases: [2, 3], maxPain: 4, tempo: '2-1-2-0' },
  'thoracic-rotation': { pathologies: ['nslbp', 'neck-pain', 'upper-cross'], phases: [1, 2, 3], maxPain: 6 },
  'prone-extension': { pathologies: ['disc', 'nslbp'], phases: [1, 2], maxPain: 6 },
  'child-pose': { pathologies: ['nslbp'], phases: [1, 2, 3], maxPain: 7, contraindicatedIn: ['disc'] },
  'standing-back-extension': { pathologies: ['disc', 'nslbp'], phases: [1, 2], maxPain: 6 },

  // ===== BIODRO =====
  'clamshells': { pathologies: ['gtps', 'hip-oa', 'fai', 'piriformis', 'pfps', 'itbs'], phases: [1, 2], maxPain: 5, tempo: '2-1-2-0' },
  'hip-abduction': { pathologies: ['gtps', 'hip-oa', 'pfps', 'itbs'], phases: [2], maxPain: 4, tempo: '2-1-2-0' },
  'hip-flexor-stretch': { pathologies: ['hip-oa', 'fai', 'nslbp'], phases: [1, 2, 3], maxPain: 6 },
  'single-leg-glute-bridge': { pathologies: ['gtps', 'hip-oa', 'nslbp', 'pfps'], phases: [2, 3], maxPain: 3, tempo: '2-1-2-0' },
  'side-lying-leg-lift': { pathologies: ['gtps', 'hip-oa', 'itbs'], phases: [2], maxPain: 4, tempo: '2-1-2-0' },
  'piriformis-stretch': { pathologies: ['piriformis', 'nslbp'], phases: [1, 2, 3], maxPain: 6 },
  'side-lying-clam-advanced': { pathologies: ['gtps', 'hip-oa'], phases: [3], maxPain: 3, tempo: '2-1-2-0' },
  'figure-4-stretch': { pathologies: ['piriformis', 'hip-oa', 'fai'], phases: [1, 2, 3], maxPain: 6 },
  '90-90-stretch': { pathologies: ['fai', 'hip-oa'], phases: [2, 3], maxPain: 5 },
  'fire-hydrants': { pathologies: ['gtps', 'fai'], phases: [2, 3], maxPain: 4, tempo: '2-1-2-0' },
  'standing-hip-flexor-stretch': { pathologies: ['hip-oa', 'fai'], phases: [2, 3], maxPain: 6 },

  // ===== STAW SKOKOWY / STOPA =====
  'ankle-alphabet': { pathologies: ['ankle-sprain'], phases: [1], maxPain: 7 },
  'calf-raises': { pathologies: ['achilles', 'ankle-sprain', 'plantar-fasciitis'], phases: [2], maxPain: 5, tempo: '2-1-2-0' },
  'single-leg-balance': { pathologies: ['ankle-sprain', 'acl-rehab'], phases: [2, 3], maxPain: 3, dosage: { sets: 3, holdSeconds: 30 } },
  'resistance-band-dorsiflexion': { pathologies: ['ankle-sprain'], phases: [1, 2], maxPain: 6, tempo: '2-0-2-0' },
  'toe-raises': { pathologies: ['ankle-sprain'], phases: [1, 2], maxPain: 6, tempo: '2-0-2-0' },
  'ankle-circles': { pathologies: ['ankle-sprain', 'achilles'], phases: [1], maxPain: 7 },
  'towel-scrunch': { pathologies: ['plantar-fasciitis', 'ankle-sprain'], phases: [1, 2], maxPain: 6 },
  'marble-pickup': { pathologies: ['plantar-fasciitis'], phases: [1, 2], maxPain: 6 },
  'eccentric-calf-raises': { pathologies: ['achilles', 'plantar-fasciitis'], phases: [2, 3], maxPain: 5, tempo: '4-0-1-0', dosage: { sets: 3, reps: 15 } },
  'ankle-eversion': { pathologies: ['ankle-sprain'], phases: [1, 2], maxPain: 6, tempo: '2-0-2-0' },
  'resisted-ankle-inversion': { pathologies: ['ankle-sprain'], phases: [2], maxPain: 5, tempo: '2-0-2-0' },
  'foam-rolling-calves': { pathologies: ['achilles', 'plantar-fasciitis'], phases: [1, 2, 3], maxPain: 7 },

  // ===== NADGARSTEK =====
  'wrist-circles': { pathologies: ['wrist-sprain', 'cts', 'lateral-epi', 'medial-epi'], phases: [1], maxPain: 7 },
  'wrist-flexor-stretch': { pathologies: ['medial-epi', 'cts', 'wrist-sprain'], phases: [1, 2, 3], maxPain: 6 },
  'wrist-extensor-stretch': { pathologies: ['lateral-epi', 'wrist-sprain'], phases: [1, 2, 3], maxPain: 6 },
  'wrist-curls': { pathologies: ['medial-epi', 'wrist-sprain'], phases: [2, 3], maxPain: 4, tempo: '3-0-1-0' },
  'reverse-wrist-curls': { pathologies: ['lateral-epi'], phases: [2, 3], maxPain: 4, tempo: '3-0-1-0' },
  'grip-squeeze': { pathologies: ['wrist-sprain', 'lateral-epi', 'cts'], phases: [1, 2], maxPain: 5 },
  'eccentric-wrist-extension': { pathologies: ['lateral-epi'], phases: [2, 3], maxPain: 5, tempo: '4-0-1-0', dosage: { sets: 3, reps: 15 } },
  'eccentric-wrist-flexion': { pathologies: ['medial-epi'], phases: [2, 3], maxPain: 5, tempo: '4-0-1-0', dosage: { sets: 3, reps: 15 } },
  'forearm-pronation-supination': { pathologies: ['lateral-epi', 'medial-epi', 'post-immob-elbow', 'wrist-sprain'], phases: [1, 2], maxPain: 6 },

  // ===== ŁOKIEĆ =====
  'triceps-stretch-overhead': { pathologies: ['post-immob-elbow'], phases: [2, 3], maxPain: 6 },
  'biceps-curl-isometric': { pathologies: ['post-immob-elbow', 'lateral-epi'], phases: [1, 2], maxPain: 5, dosage: { sets: 3, holdSeconds: 30 } },
  'elbow-mobilization': { pathologies: ['post-immob-elbow'], phases: [1], maxPain: 7 },

  // ===== SZYJA =====
  'neck-rotation': { pathologies: ['neck-pain', 'cgh'], phases: [1, 2], maxPain: 7 },
  'neck-side-flexion': { pathologies: ['neck-pain'], phases: [1, 2], maxPain: 7 },
  'chin-tucks': { pathologies: ['neck-pain', 'cgh', 'upper-cross'], phases: [1, 2, 3], maxPain: 6, dosage: { sets: 3, reps: 10, holdSeconds: 5 } },
  'upper-trap-stretch': { pathologies: ['neck-pain', 'upper-cross', 'cgh'], phases: [1, 2, 3], maxPain: 6 },
  'levator-scapulae-stretch': { pathologies: ['neck-pain', 'cgh'], phases: [1, 2, 3], maxPain: 6 },
  'neck-isometric-holds': { pathologies: ['neck-pain', 'cgh'], phases: [2, 3], maxPain: 4, dosage: { sets: 3, reps: 5, holdSeconds: 10 } },
};
