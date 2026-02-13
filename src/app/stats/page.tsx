'use client';

import { useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useApp } from '@/context/AppContext';

const diagnosisColors = [
  'bg-gradient-to-r from-neon-cyan to-neon-purple',
  'bg-gradient-to-r from-neon-green to-neon-cyan',
  'bg-gradient-to-r from-neon-purple to-neon-pink',
  'bg-gradient-to-r from-neon-pink to-neon-cyan',
  'bg-gradient-to-r from-neon-cyan to-neon-green',
  'bg-gradient-to-r from-neon-purple to-neon-cyan',
  'bg-gradient-to-r from-neon-pink to-neon-purple',
  'bg-gradient-to-r from-neon-green to-neon-purple',
];

const statusConfig = {
  template: {
    label: 'Szablony',
    color: 'bg-gradient-to-r from-neon-purple to-neon-cyan',
    bgColor: 'bg-neon-purple/10',
    textColor: 'text-neon-purple',
    borderColor: 'border-neon-purple/30',
  },
  active: {
    label: 'Aktywne',
    color: 'bg-gradient-to-r from-neon-cyan to-neon-green',
    bgColor: 'bg-neon-cyan/10',
    textColor: 'text-neon-cyan',
    borderColor: 'border-neon-cyan/30',
  },
  completed: {
    label: 'Zakończone',
    color: 'bg-gradient-to-r from-neon-pink to-neon-purple',
    bgColor: 'bg-neon-pink/10',
    textColor: 'text-neon-pink',
    borderColor: 'border-neon-pink/30',
  },
};

export default function StatsPage() {
  const { patients, exercises, plans, isLoading } = useApp();

  const patientsByDiagnosis = useMemo(() => {
    const diagnosisCounts: Record<string, number> = {};
    
    patients.forEach(patient => {
      patient.diagnoses.forEach(diagnosis => {
        diagnosisCounts[diagnosis.name] = (diagnosisCounts[diagnosis.name] || 0) + 1;
      });
    });

    const noDiagnosis = patients.filter(p => p.diagnoses.length === 0).length;
    if (noDiagnosis > 0) {
      diagnosisCounts['Bez diagnozy'] = noDiagnosis;
    }

    return Object.entries(diagnosisCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, [patients]);

  const topExercises = useMemo(() => {
    const exerciseCounts: Record<string, { exercise: typeof exercises[0]; count: number }> = {};

    plans.forEach(plan => {
      plan.weeks.forEach(week => {
        week.days.forEach(day => {
          day.exercises.forEach(planExercise => {
            const exercise = exercises.find(e => e.id === planExercise.exerciseId);
            if (exercise) {
              if (!exerciseCounts[exercise.id]) {
                exerciseCounts[exercise.id] = { exercise, count: 0 };
              }
              exerciseCounts[exercise.id].count++;
            }
          });
        });
      });
    });

    return Object.values(exerciseCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [plans, exercises]);

  const planStatusDistribution = useMemo(() => ({
    template: plans.filter(p => p.status === 'template').length,
    active: plans.filter(p => p.status === 'active').length,
    completed: plans.filter(p => p.status === 'completed').length,
  }), [plans]);

  const maxDiagnosisCount = Math.max(...patientsByDiagnosis.map(([, count]) => count), 1);
  const maxExerciseCount = Math.max(...topExercises.map(e => e.count), 1);
  const totalPlans = planStatusDistribution.template + planStatusDistribution.active + planStatusDistribution.completed;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Statystyki</h1>
          <p className="text-gray-400 mt-1">Przegląd danych w systemie Rehab Planner.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-6 rounded-xl border border-neon-cyan/20 hover:border-neon-cyan/40 transition-all group">
            <p className="text-sm font-medium text-gray-400">Wszyscy pacjenci</p>
            <p className="text-3xl font-bold gradient-text mt-2">{patients.length}</p>
          </div>
          <div className="glass-card p-6 rounded-xl border border-neon-purple/20 hover:border-neon-purple/40 transition-all group">
            <p className="text-sm font-medium text-gray-400">Wszystkie plany</p>
            <p className="text-3xl font-bold gradient-text mt-2">{plans.length}</p>
          </div>
          <div className="glass-card p-6 rounded-xl border border-neon-pink/20 hover:border-neon-pink/40 transition-all group">
            <p className="text-sm font-medium text-gray-400">Baza ćwiczeń</p>
            <p className="text-3xl font-bold gradient-text mt-2">{exercises.length}</p>
          </div>
          <div className="glass-card p-6 rounded-xl border border-neon-green/20 hover:border-neon-green/40 transition-all group">
            <p className="text-sm font-medium text-gray-400">Unikalne diagnozy</p>
            <p className="text-3xl font-bold gradient-text mt-2">{patientsByDiagnosis.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card rounded-xl p-6 border border-neon-cyan/20">
            <h2 className="text-lg font-semibold text-white mb-6">Pacjenci według diagnozy</h2>
            {patientsByDiagnosis.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-neon-cyan/20">
                  <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-gray-400">Brak danych do wyświetlenia</p>
                <p className="text-sm text-gray-500 mt-1">Dodaj pacjentów z diagnozami</p>
              </div>
            ) : (
              <div className="space-y-4">
                {patientsByDiagnosis.map(([diagnosis, count], index) => (
                  <div key={diagnosis} className="group">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-gray-300 truncate pr-2">{diagnosis}</span>
                      <span className="text-sm font-semibold text-white">{count}</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
                      <div
                        className={`h-full ${diagnosisColors[index % diagnosisColors.length]} rounded-full transition-all duration-500 ease-out group-hover:shadow-lg group-hover:shadow-neon-cyan/30`}
                        style={{ width: `${(count / maxDiagnosisCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass-card rounded-xl p-6 border border-neon-purple/20">
            <h2 className="text-lg font-semibold text-white mb-6">Status planów</h2>
            {totalPlans === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-neon-purple/20">
                  <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-gray-400">Brak planów w systemie</p>
                <p className="text-sm text-gray-500 mt-1">Utwórz pierwszy plan rehabilitacji</p>
              </div>
            ) : (
              <>
                <div className="flex justify-center mb-6">
                  <div className="relative w-48 h-48">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      {(() => {
                        const radius = 40;
                        const circumference = 2 * Math.PI * radius;
                        let offset = 0;
                        
                        const colors = ['#b829dd', '#00f0ff', '#ff00ff'];
                        
                        return Object.entries(planStatusDistribution).map(([status, count], index) => {
                          const percentage = (count / totalPlans) * 100;
                          const dashLength = (percentage / 100) * circumference;
                          const dashOffset = offset;
                          offset += dashLength;
                          
                          return (
                            <circle
                              key={status}
                              cx="50"
                              cy="50"
                              r={radius}
                              fill="none"
                              stroke={colors[index]}
                              strokeWidth="12"
                              strokeDasharray={`${dashLength} ${circumference}`}
                              strokeDashoffset={-dashOffset}
                              className="transition-all duration-500"
                              style={{ filter: `drop-shadow(0 0 6px ${colors[index]})` }}
                            />
                          );
                        });
                      })()}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-3xl font-bold gradient-text">{totalPlans}</p>
                        <p className="text-xs text-gray-400">planów</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(planStatusDistribution).map(([status, count]) => {
                    const config = statusConfig[status as keyof typeof statusConfig];
                    const percentage = totalPlans > 0 ? Math.round((count / totalPlans) * 100) : 0;
                    
                    return (
                      <div
                        key={status}
                        className={`${config.bgColor} border ${config.borderColor} rounded-xl p-4 text-center hover:border-opacity-60 transition-all`}
                      >
                        <div className={`w-3 h-3 ${config.color} rounded-full mx-auto mb-2`} />
                        <p className={`text-2xl font-bold ${config.textColor}`}>{count}</p>
                        <p className="text-xs text-gray-400 mt-1">{config.label}</p>
                        <p className="text-xs text-gray-500">{percentage}%</p>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 border border-neon-cyan/20">
          <h2 className="text-lg font-semibold text-white mb-6">Najczęściej używane ćwiczenia</h2>
          {topExercises.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-neon-cyan/20">
                <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
              <p className="text-gray-400">Brak ćwiczeń w planach</p>
              <p className="text-sm text-gray-500 mt-1">Dodaj ćwiczenia do planów rehabilitacji</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topExercises.map((item, index) => (
                <div
                  key={item.exercise.id}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group border border-transparent hover:border-neon-cyan/20"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm ${
                    index === 0 ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30' :
                    index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                    index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700' :
                    'bg-gradient-to-br from-gray-600 to-gray-700'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-medium text-white truncate pr-2">{item.exercise.name}</span>
                      <span className="text-sm font-semibold text-neon-cyan">{item.count}x</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                      <div
                        className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full transition-all duration-500 ease-out group-hover:shadow-lg group-hover:shadow-neon-cyan/30"
                        style={{ width: `${(item.count / maxExerciseCount) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
                    <span className="px-2 py-1 bg-neon-purple/20 text-neon-purple rounded-md capitalize">{item.exercise.category}</span>
                    <span className="px-2 py-1 bg-neon-cyan/20 text-neon-cyan rounded-md capitalize">{item.exercise.bodyPart}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
