export type ExerciseCategory = 'strength' | 'stretching' | 'mobility' | 'balance';
export type BodyPart = 'knee' | 'shoulder' | 'spine' | 'hip' | 'ankle' | 'wrist' | 'elbow' | 'neck';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: ExerciseCategory;
  bodyPart: BodyPart;
  difficulty: 1 | 2 | 3;
  duration?: number;
  reps?: number;
  sets?: number;
  equipment: string[];
  imageUrl?: string;
  tags: string[];
}
