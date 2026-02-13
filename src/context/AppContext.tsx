'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Exercise, Patient, RehabilitationPlan, Diagnosis } from '@/types';

interface AppContextType {
  patients: Patient[];
  exercises: Exercise[];
  plans: RehabilitationPlan[];
  isLoading: boolean;
  error: string | null;
  refreshPatients: () => Promise<void>;
  refreshPlans: () => Promise<void>;
  refreshExercises: () => Promise<void>;
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'diagnoses'>) => Promise<Patient>;
  updatePatient: (id: string, patient: Partial<Patient>) => Promise<void>;
  addDiagnosis: (patientId: string, diagnosis: Omit<Diagnosis, 'id' | 'patientId'>) => Promise<void>;
  addPlan: (plan: Omit<RehabilitationPlan, 'id' | 'createdAt'>) => Promise<RehabilitationPlan>;
  updatePlan: (id: string, plan: Partial<RehabilitationPlan>) => Promise<void>;
  clearError: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
  }
  return res.json();
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [plans, setPlans] = useState<RehabilitationPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const refreshPatients = useCallback(async () => {
    try {
      const res = await fetch('/api/patients');
      const data = await handleResponse<Patient[]>(res);
      setPatients(data.map((p) => ({
        ...p,
        diagnoses: p.diagnoses || [],
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load patients');
      throw err;
    }
  }, []);

  const refreshExercises = useCallback(async () => {
    try {
      const res = await fetch('/api/exercises');
      const data = await handleResponse<Exercise[]>(res);
      setExercises(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load exercises');
      throw err;
    }
  }, []);

  const refreshPlans = useCallback(async () => {
    try {
      const res = await fetch('/api/plans');
      const data = await handleResponse<RehabilitationPlan[]>(res);
      setPlans(data.map((p) => ({
        ...p,
        weeks: p.weeks?.map((w) => ({
          ...w,
          days: w.days?.map((d) => ({
            ...d,
            exercises: d.exercises || [],
          })) || [],
        })) || [],
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load plans');
      throw err;
    }
  }, []);

  const addPatient = useCallback(async (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'diagnoses'>) => {
    const res = await fetch('/api/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patient),
    });
    const newPatient = await handleResponse<Patient>(res);
    await refreshPatients();
    return { ...newPatient, diagnoses: [] };
  }, [refreshPatients]);

  const updatePatient = useCallback(async (id: string, patient: Partial<Patient>) => {
    const res = await fetch(`/api/patients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patient),
    });
    await handleResponse(res);
    await refreshPatients();
  }, [refreshPatients]);

  const addDiagnosis = useCallback(async (patientId: string, diagnosis: Omit<Diagnosis, 'id' | 'patientId'>) => {
    const res = await fetch('/api/diagnoses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...diagnosis, patientId }),
    });
    await handleResponse(res);
    await refreshPatients();
  }, [refreshPatients]);

  const addPlan = useCallback(async (plan: Omit<RehabilitationPlan, 'id' | 'createdAt'>) => {
    const res = await fetch('/api/plans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plan),
    });
    const newPlan = await handleResponse<RehabilitationPlan>(res);
    await refreshPlans();
    return newPlan;
  }, [refreshPlans]);

  const updatePlan = useCallback(async (id: string, plan: Partial<RehabilitationPlan>) => {
    const res = await fetch(`/api/plans/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plan),
    });
    await handleResponse(res);
    await refreshPlans();
  }, [refreshPlans]);

  useEffect(() => {
    Promise.all([refreshPatients(), refreshExercises(), refreshPlans()])
      .then(() => setIsLoading(false))
      .catch(() => setIsLoading(false));
  }, [refreshPatients, refreshExercises, refreshPlans]);

  return (
    <AppContext.Provider value={{
      patients,
      exercises,
      plans,
      isLoading,
      error,
      refreshPatients,
      refreshPlans,
      refreshExercises,
      addPatient,
      updatePatient,
      addDiagnosis,
      addPlan,
      updatePlan,
      clearError,
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
