'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
import { useApp } from '@/context/AppContext';

export default function Home() {
  const { patients, exercises, plans, isLoading } = useApp();

  const stats = useMemo(() => ({
    patients: patients.length,
    activePlans: plans.filter(p => p.status === 'active').length,
    exercises: exercises.length,
    templates: plans.filter(p => p.status === 'template').length,
  }), [patients, exercises, plans]);

  const recentPatients = useMemo(() => 
    [...patients]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5),
    [patients]
  );

  const recentPlans = useMemo(() => 
    [...plans]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5),
    [plans]
  );

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Witaj w Rehab Planner - aplikacji do zarządzania planami rehabilitacji.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/patients" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-teal-200 transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pacjenci</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.patients}</p>
              </div>
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center group-hover:bg-teal-200 transition-colors">
                <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </Link>

          <Link href="/plans" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-emerald-200 transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Aktywne plany</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.activePlans}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
            </div>
          </Link>

          <Link href="/exercises" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Ćwiczenia</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.exercises}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
            </div>
          </Link>

          <Link href="/plans" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-200 transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Szablony</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.templates}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Ostatni pacjenci</h2>
              <Link href="/patients" className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                Zobacz wszystkich
              </Link>
            </div>
            {recentPatients.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Brak pacjentów w bazie</p>
                <Link
                  href="/patients/new"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Dodaj pacjenta
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentPatients.map((patient) => (
                  <Link
                    key={patient.id}
                    href={`/patients/${patient.id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-medium">
                        {patient.firstName[0]}{patient.lastName[0]}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{patient.firstName} {patient.lastName}</p>
                        <p className="text-sm text-gray-500">
                          {patient.diagnoses.length > 0 ? patient.diagnoses[0].name : 'Brak diagnozy'}
                        </p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Ostatnie plany</h2>
              <Link href="/plans" className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                Zobacz wszystkie
              </Link>
            </div>
            {recentPlans.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Brak planów w bazie</p>
                <Link
                  href="/plans/new"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Utwórz plan
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentPlans.map((plan) => {
                  const statusColors: Record<string, string> = {
                    template: 'bg-blue-100 text-blue-700',
                    active: 'bg-emerald-100 text-emerald-700',
                    completed: 'bg-gray-100 text-gray-600',
                  };
                  const statusLabels: Record<string, string> = {
                    template: 'Szablon',
                    active: 'Aktywny',
                    completed: 'Zakończony',
                  };
                  return (
                    <Link
                      key={plan.id}
                      href={`/plans/${plan.id}`}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{plan.name}</p>
                        <p className="text-sm text-gray-500">{plan.weeks.length} tygodni</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${statusColors[plan.status]}`}>
                        {statusLabels[plan.status]}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
