import { z } from 'zod';

export const PatientSchema = z.object({
  firstName: z.string().min(1, 'Imię jest wymagane').max(100),
  lastName: z.string().min(1, 'Nazwisko jest wymagane').max(100),
  birthDate: z.string().min(1, 'Data urodzenia jest wymagana'),
  phone: z.string().max(20).optional().default(''),
  email: z.string().email('Nieprawidłowy email').optional().default(''),
  notes: z.string().max(1000).optional().default(''),
});

export const UpdatePatientSchema = PatientSchema.partial();

export const DiagnosisSchema = z.object({
  name: z.string().min(1, 'Nazwa diagnozy jest wymagana').max(200),
  date: z.string().min(1, 'Data jest wymagana'),
  notes: z.string().max(1000).optional().default(''),
  patientId: z.string().min(1, 'ID pacjenta jest wymagane'),
});

export const PlanExerciseSchema = z.object({
  exerciseId: z.string().min(1),
  sets: z.number().int().min(1).max(100).optional().default(3),
  reps: z.number().int().min(1).max(1000).optional().default(10),
  holdSeconds: z.number().int().min(0).max(3600).optional(),
  notes: z.string().max(500).optional(),
});

export const PlanDaySchema = z.object({
  dayNumber: z.number().int().min(1).max(7),
  notes: z.string().max(500).optional(),
  exercises: z.array(PlanExerciseSchema).optional().default([]),
});

export const PlanWeekSchema = z.object({
  weekNumber: z.number().int().min(1).max(52),
  focus: z.string().max(200).optional(),
  days: z.array(PlanDaySchema).optional().default([]),
});

export const PlanSchema = z.object({
  name: z.string().min(1, 'Nazwa planu jest wymagana').max(200),
  description: z.string().max(1000).optional(),
  patientId: z.string().optional(),
  status: z.enum(['template', 'active', 'completed']).optional().default('template'),
  weeks: z.array(PlanWeekSchema).optional().default([]),
});

export const UserSchema = z.object({
  email: z.string().email('Nieprawidłowy email').min(1, 'Email jest wymagany'),
  password: z.string().min(6, 'Hasło musi mieć minimum 6 znaków').max(100),
  name: z.string().max(100).optional(),
  role: z.enum(['admin', 'physio']).optional().default('physio'),
});

export const LoginSchema = z.object({
  email: z.string().email('Nieprawidłowy email'),
  password: z.string().min(1, 'Hasło jest wymagane'),
});

export type PatientInput = z.infer<typeof PatientSchema>;
export type UpdatePatientInput = z.infer<typeof UpdatePatientSchema>;
export type DiagnosisInput = z.infer<typeof DiagnosisSchema>;
export type PlanInput = z.infer<typeof PlanSchema>;
export type UserInput = z.infer<typeof UserSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
