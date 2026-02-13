'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Exercise, Patient, RehabilitationPlan } from '@/types';
import { storage } from '@/lib/storage';

interface AppContextType {
  patients: Patient[];
  setPatients: (patients: Patient[]) => void;
  exercises: Exercise[];
  setExercises: (exercises: Exercise[]) => void;
  plans: RehabilitationPlan[];
  setPlans: (plans: RehabilitationPlan[]) => void;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [plans, setPlans] = useState<RehabilitationPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setPatients(storage.getPatients());
    setExercises(storage.getExercises());
    setPlans(storage.getPlans());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      storage.setPatients(patients);
    }
  }, [patients, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      storage.setExercises(exercises);
    }
  }, [exercises, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      storage.setPlans(plans);
    }
  }, [plans, isLoading]);

  return (
    <AppContext.Provider value={{ patients, setPatients, exercises, setExercises, plans, setPlans, isLoading }}>
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
