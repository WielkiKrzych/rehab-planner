'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Exercise, Patient, RehabilitationPlan, Diagnosis } from '@/types';

interface AppContextType {
  patients: Patient[];
  exercises: Exercise[];
  plans: RehabilitationPlan[];
  isLoading: boolean;
  refreshPatients: () => Promise<void>;
  refreshPlans: () => Promise<void>;
  refreshExercises: () => Promise<void>;
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'diagnoses'>) => Promise<Patient>;
  updatePatient: (id: string, patient: Partial<Patient>) => Promise<void>;
  addDiagnosis: (patientId: string, diagnosis: Omit<Diagnosis, 'id' | 'patientId'>) => Promise<void>;
  addPlan: (plan: Omit<RehabilitationPlan, 'id' | 'createdAt'>) => Promise<RehabilitationPlan>;
  updatePlan: (id: string, plan: Partial<RehabilitationPlan>) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [plans, setPlans] = useState<RehabilitationPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshPatients = useCallback(async () => {
    const res = await fetch('/api/patients');
    const data = await res.json();
    setPatients(data.map((p: Patient) => ({
      ...p,
      diagnoses: p.diagnoses || [],
    })));
  }, []);

  const refreshExercises = useCallback(async () => {
    const res = await fetch('/api/exercises');
    const data = await res.json();
    setExercises(data);
  }, []);

  const refreshPlans = useCallback(async () => {
    const res = await fetch('/api/plans');
    const data = await res.json();
    setPlans(data.map((p: RehabilitationPlan) => ({
      ...p,
      weeks: p.weeks?.map((w: { days: { exercises: { exerciseId: string; sets: number; reps: number; holdSeconds?: number; notes?: string }[] }[] }) => ({
        ...w,
        days: w.days?.map((d: { exercises: { exerciseId: string; sets: number; reps: number; holdSeconds?: number; notes?: string }[] }) => ({
          ...d,
          exercises: d.exercises || [],
        })) || [],
      })) || [],
    })));
  }, []);

  const addPatient = useCallback(async (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'diagnoses'>) => {
    const res = await fetch('/api/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patient),
    });
    const newPatient = await res.json();
    await refreshPatients();
    return { ...newPatient, diagnoses: [] };
  }, [refreshPatients]);

  const updatePatient = useCallback(async (id: string, patient: Partial<Patient>) => {
    await fetch(`/api/patients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patient),
    });
    await refreshPatients();
  }, [refreshPatients]);

  const addDiagnosis = useCallback(async (patientId: string, diagnosis: Omit<Diagnosis, 'id' | 'patientId'>) => {
    await fetch('/api/diagnoses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...diagnosis, patientId }),
    });
    await refreshPatients();
  }, [refreshPatients]);

  const addPlan = useCallback(async (plan: Omit<RehabilitationPlan, 'id' | 'createdAt'>) => {
    const res = await fetch('/api/plans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plan),
    });
    const newPlan = await res.json();
    await refreshPlans();
    return newPlan;
  }, [refreshPlans]);

  const updatePlan = useCallback(async (id: string, plan: Partial<RehabilitationPlan>) => {
    await fetch(`/api/plans/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plan),
    });
    await refreshPlans();
  }, [refreshPlans]);

  useEffect(() => {
    Promise.all([refreshPatients(), refreshExercises(), refreshPlans()]).then(() => {
      setIsLoading(false);
    });
  }, [refreshPatients, refreshExercises, refreshPlans]);

  return (
    <AppContext.Provider value={{
      patients,
      exercises,
      plans,
      isLoading,
      refreshPatients,
      refreshPlans,
      refreshExercises,
      addPatient,
      updatePatient,
      addDiagnosis,
      addPlan,
      updatePlan,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
