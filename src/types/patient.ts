export interface Diagnosis {
  id: string;
  name: string;
  date: string;
  notes?: string;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  phone?: string;
  email?: string;
  diagnoses: Diagnosis[];
  activePlanId?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}
