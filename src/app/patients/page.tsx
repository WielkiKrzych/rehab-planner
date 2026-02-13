'use client';

import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
import { PatientList } from '@/components/patients/PatientList';
import { useApp } from '@/context/AppContext';

export default function PatientsPage() {
  const { patients, isLoading } = useApp();

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pacjenci</h1>
            <p className="text-gray-500 mt-1">
              {patients.length} {patients.length === 1 ? 'pacjent' : 'pacjentów'} w bazie
            </p>
          </div>
          <Link
            href="/patients/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium rounded-lg hover:from-teal-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all shadow-sm hover:shadow-md"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Dodaj pacjenta
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <PatientList patients={patients} />
        )}
      </div>
    </Layout>
  );
}
