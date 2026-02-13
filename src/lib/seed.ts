import { storage } from './storage';
import { defaultExercises } from '@/data/exercises';

export function seedDatabase(): boolean {
  const existing = storage.getExercises();
  if (existing.length === 0) {
    storage.setExercises(defaultExercises);
    return true;
  }
  return false;
}
