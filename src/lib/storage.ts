import { Exercise, Patient, RehabilitationPlan } from '@/types';

const STORAGE_KEYS = {
  PATIENTS: 'rehab-planner-patients',
  EXERCISES: 'rehab-planner-exercises',
  PLANS: 'rehab-planner-plans',
} as const;

function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  const item = localStorage.getItem(key);
  if (!item) return defaultValue;
  try {
    return JSON.parse(item) as T;
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  // Patients
  getPatients: (): Patient[] => getItem(STORAGE_KEYS.PATIENTS, []),
  setPatients: (patients: Patient[]) => setItem(STORAGE_KEYS.PATIENTS, patients),
  
  // Exercises
  getExercises: (): Exercise[] => getItem(STORAGE_KEYS.EXERCISES, []),
  setExercises: (exercises: Exercise[]) => setItem(STORAGE_KEYS.EXERCISES, exercises),
  
  // Plans
  getPlans: (): RehabilitationPlan[] => getItem(STORAGE_KEYS.PLANS, []),
  setPlans: (plans: RehabilitationPlan[]) => setItem(STORAGE_KEYS.PLANS, plans),
};
