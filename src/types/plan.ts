export interface PlanExercise {
  exerciseId: string;
  sets: number;
  reps: number;
  holdSeconds?: number;
  notes?: string;
}

export interface PlanDay {
  dayNumber: number;
  exercises: PlanExercise[];
  notes?: string;
}

export interface PlanWeek {
  weekNumber: number;
  days: PlanDay[];
  focus?: string;
}

export interface RehabilitationPlan {
  id: string;
  name: string;
  description?: string;
  patientId?: string;
  weeks: PlanWeek[];
  createdAt: string;
  status: 'template' | 'active' | 'completed';
}
