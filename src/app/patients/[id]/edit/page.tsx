'use client';

import { useParams, useRouter } from 'next/navigation';
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

export default function EditPatientPage() {
  const params = useParams();
  const router = useRouter();
  const { patients, updatePatient } = useApp();

  const patient = patients.find((p) => p.id === params.id);

  if (!patient) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto text-center py-16">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Pacjent nie znaleziony</h2>
          <Link href="/patients" className="text-teal-600 hover:text-teal-700">
            Powrót do listy pacjentów
          </Link>
        </div>
      </Layout>
    );
  }

  const handleSubmit = async (formData: PatientFormData) => {
    await updatePatient(patient.id, {
      firstName: formData.firstName,
      lastName: formData.lastName,
      birthDate: formData.birthDate,
      phone: formData.phone || undefined,
      email: formData.email || undefined,
      notes: formData.notes,
    });
    router.push(`/patients/${patient.id}`);
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link
            href={`/patients/${patient.id}`}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Powrót do pacjenta
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Edytuj pacjenta
          </h1>
          <PatientForm
            patient={patient}
            onSubmit={handleSubmit}
            onCancel={() => router.push(`/patients/${patient.id}`)}
          />
        </div>
      </div>
    </Layout>
  );
}
