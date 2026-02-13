'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
import { PatientForm } from '@/components/patients/PatientForm';
import { useApp } from '@/context/AppContext';

interface PatientFormData {
  firstName: string;
  lastName: string;
  birthDate: string;
  phone: string;
  email: string;
  notes: string;
}

export default function NewPatientPage() {
  const router = useRouter();
  const { addPatient } = useApp();

  const handleSubmit = async (formData: PatientFormData) => {
    const newPatient = await addPatient({
      firstName: formData.firstName,
      lastName: formData.lastName,
      birthDate: formData.birthDate,
      phone: formData.phone || undefined,
      email: formData.email || undefined,
      notes: formData.notes,
    });
    router.push(`/patients/${newPatient.id}`);
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link
            href="/patients"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Powrót do listy pacjentów
          </Link>
        </div>

        <div className="glass-card rounded-xl p-8 border border-neon-cyan/20">
          <h1 className="text-2xl font-bold gradient-text mb-6">Nowy pacjent</h1>
          <PatientForm
            onSubmit={handleSubmit}
            onCancel={() => router.push('/patients')}
          />
        </div>
      </div>
    </Layout>
  );
}
