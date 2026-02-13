'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
import { useApp } from '@/context/AppContext';
import { Exercise } from '@/types';

const dayNames = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'];
const dayNamesShort = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nd'];

const statusConfig: Record<string, { label: string; className: string }> = {
  template: { label: 'Szablon', className: 'bg-neon-purple/20 text-neon-purple border-neon-purple/40' },
  active: { label: 'Aktywny', className: 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/40' },
  completed: { label: 'Zakończony', className: 'bg-neon-pink/20 text-neon-pink border-neon-pink/40' },
};

export default function PlanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { plans, updatePlan, exercises, patients, isLoading } = useApp();
  const [selectedWeek, setSelectedWeek] = useState(0);

  const plan = useMemo(() => {
    return plans.find((p) => p.id === params.id);
  }, [plans, params.id]);

  const patient = useMemo(() => {
    if (!plan?.patientId) return null;
    return patients.find((p) => p.id === plan.patientId);
  }, [plan, patients]);

  const getExerciseById = (id: string): Exercise | undefined => {
    return exercises.find((ex) => ex.id === id);
  };

  const handleCompletePlan = async () => {
    if (!plan) return;
    if (!confirm('Czy na pewno chcesz zakończyć ten plan?')) return;

    await updatePlan(plan.id, { status: 'completed' });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  if (!plan) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold text-white mb-2">Plan nie znaleziony</h2>
          <p className="text-gray-400 mb-4">Plan o podanym identyfikatorze nie istnieje.</p>
          <Link
            href="/plans"
            className="inline-flex items-center gap-2 text-neon-cyan hover:text-neon-cyan/80"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Powrót do listy planów
          </Link>
        </div>
      </Layout>
    );
  }

  const status = statusConfig[plan.status];
  const currentWeek = plan.weeks[selectedWeek];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link
                href="/plans"
                className="text-gray-500 hover:text-gray-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-3xl font-bold gradient-text">{plan.name}</h1>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${status.className}`}
              >
                {status.label}
              </span>
            </div>
            {plan.description && (
              <p className="text-gray-400 ml-8">{plan.description}</p>
            )}
            {patient && (
              <p className="text-sm text-gray-400 ml-8 mt-1">
                Pacjent:{' '}
                <Link
                  href={`/patients/${patient.id}`}
                  className="text-neon-cyan hover:text-neon-cyan/80 font-medium"
                >
                  {patient.firstName} {patient.lastName}
                </Link>
              </p>
            )}
          </div>
          <div className="flex gap-3">
            {plan.status === 'template' && (
              <Link
                href={`/plans/${plan.id}/edit`}
                className="inline-flex items-center gap-2 px-4 py-2 border border-neon-cyan/30 text-neon-cyan font-medium rounded-lg hover:bg-neon-cyan/10 transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edytuj
              </Link>
            )}
            {plan.status === 'active' && (
              <button
                onClick={handleCompletePlan}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 text-neon-green font-medium rounded-lg hover:bg-neon-green/10 border border-neon-green/30 transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Zakończ plan
              </button>
            )}
          </div>
        </div>

        <div className="glass-card rounded-xl overflow-hidden border border-neon-cyan/20">
          <div className="p-4 border-b border-neon-cyan/10">
            <div className="flex items-center gap-2">
              {plan.weeks.map((week, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedWeek(index)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedWeek === index
                      ? 'bg-gradient-to-r from-neon-cyan to-neon-purple text-white shadow-lg shadow-neon-cyan/30'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-300'
                  }`}
                >
                  Tydzień {week.weekNumber}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 overflow-x-auto">
            <div className="grid grid-cols-7 gap-3 min-w-[800px]">
              {currentWeek?.days.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className="bg-white/5 rounded-lg p-3 min-h-[200px] border border-neon-cyan/10"
                >
                  <p className="font-semibold text-neon-cyan text-sm mb-3 pb-2 border-b border-neon-cyan/20">
                    {dayNamesShort[dayIndex]}
                  </p>
                  <div className="space-y-2">
                    {day.exercises.length === 0 ? (
                      <p className="text-xs text-gray-500 text-center py-4">Brak ćwiczeń</p>
                    ) : (
                      day.exercises.map((planEx, exIndex) => {
                        const exercise = getExerciseById(planEx.exerciseId);
                        if (!exercise) return null;
                        return (
                          <div
                            key={exIndex}
                            className="bg-white/5 p-2.5 rounded-lg border border-neon-cyan/20 text-xs"
                          >
                            <p className="font-medium text-white mb-1">{exercise.name}</p>
                            <p className="text-gray-400">
                              {planEx.sets} x {planEx.reps}
                              {planEx.holdSeconds && ` (${planEx.holdSeconds}s)`}
                            </p>
                            {planEx.notes && (
                              <p className="text-gray-500 mt-1 italic">{planEx.notes}</p>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                  {day.notes && (
                    <div className="mt-3 pt-2 border-t border-neon-cyan/10">
                      <p className="text-xs text-gray-400 italic">{day.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card rounded-lg p-4 border border-neon-cyan/20">
          <h3 className="font-medium text-white mb-2">Podsumowanie planu</h3>
          <div className="flex flex-wrap gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-neon-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>
                {plan.weeks.length} {plan.weeks.length === 1 ? 'tydzień' : 'tygodni'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-neon-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <span>
                {plan.weeks.reduce(
                  (acc, week) => acc + week.days.reduce((dayAcc, day) => dayAcc + day.exercises.length, 0),
                  0
                )}{' '}
                ćwiczeń
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-neon-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                Utworzono: {new Date(plan.createdAt).toLocaleDateString('pl-PL')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
