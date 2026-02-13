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
          <div className="w-8 h-8 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-white">Witaj w </span>
            <span className="gradient-text glow-text">Rehab Planner</span>
          </h1>
          <p className="text-white/50 text-lg">Aplikacja do zarządzania planami rehabilitacji dla fizjoterapeutów.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/patients" className="glass-card rounded-2xl p-6 hover:scale-[1.02] transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/50">Pacjenci</p>
                <p className="text-4xl font-bold gradient-text mt-1">{stats.patients}</p>
              </div>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center transition-all" style={{ background: 'rgba(0, 240, 255, 0.2)', border: '1px solid rgba(0, 240, 255, 0.3)' }}>
                <svg className="w-7 h-7 text-neon-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </Link>

          <Link href="/plans" className="glass-card rounded-2xl p-6 hover:scale-[1.02] transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/50">Aktywne plany</p>
                <p className="text-4xl font-bold text-neon-green mt-1">{stats.activePlans}</p>
              </div>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0, 255, 136, 0.2)', border: '1px solid rgba(0, 255, 136, 0.3)' }}>
                <svg className="w-7 h-7 text-neon-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
            </div>
          </Link>

          <Link href="/exercises" className="glass-card rounded-2xl p-6 hover:scale-[1.02] transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/50">Ćwiczenia</p>
                <p className="text-4xl font-bold text-neon-purple mt-1">{stats.exercises}</p>
              </div>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: 'rgba(184, 41, 221, 0.2)', border: '1px solid rgba(184, 41, 221, 0.3)' }}>
                <svg className="w-7 h-7 text-neon-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
            </div>
          </Link>

          <Link href="/plans" className="glass-card rounded-2xl p-6 hover:scale-[1.02] transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/50">Szablony</p>
                <p className="text-4xl font-bold text-neon-pink mt-1">{stats.templates}</p>
              </div>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255, 0, 255, 0.2)', border: '1px solid rgba(255, 0, 255, 0.3)' }}>
                <svg className="w-7 h-7 text-neon-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Ostatni pacjenci</h2>
              <Link href="/patients" className="text-sm text-neon-cyan hover:text-neon-cyan/80 font-medium transition-colors">
                Zobacz wszystkich →
              </Link>
            </div>
            {recentPatients.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-white/40 mb-4">Brak pacjentów w bazie</p>
                <Link
                  href="/patients/new"
                  className="inline-flex items-center gap-2 px-6 py-3 btn-neon rounded-xl"
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
                      className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-neon-cyan/20"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg" style={{ background: 'linear-gradient(135deg, #00f0ff 0%, #b829dd 100%)' }}>
                        {patient.firstName[0]}{patient.lastName[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{patient.firstName} {patient.lastName}</p>
                        <p className="text-sm text-white/40">
                          {patient.diagnoses.length > 0 ? patient.diagnoses[0].name : 'Brak diagnozy'}
                        </p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Ostatnie plany</h2>
              <Link href="/plans" className="text-sm text-neon-cyan hover:text-neon-cyan/80 font-medium transition-colors">
                Zobacz wszystkie →
              </Link>
            </div>
            {recentPlans.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-white/40 mb-4">Brak planów w bazie</p>
                <Link
                  href="/plans/new"
                  className="inline-flex items-center gap-2 px-6 py-3 btn-neon rounded-xl"
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
                  const statusConfig: Record<string, { label: string; color: string }> = {
                    template: { label: 'Szablon', color: '#00f0ff' },
                    active: { label: 'Aktywny', color: '#00ff88' },
                    completed: { label: 'Zakończony', color: '#ff00ff' },
                  };
                  const status = statusConfig[plan.status] || statusConfig.template;
                  return (
                    <Link
                      key={plan.id}
                      href={`/plans/${plan.id}`}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-neon-cyan/20"
                    >
                      <div>
                        <p className="font-semibold text-white">{plan.name}</p>
                        <p className="text-sm text-white/40">{plan.weeks.length} tygodni</p>
                      </div>
                      <span 
                        className="px-3 py-1 rounded-lg text-xs font-semibold"
                        style={{ 
                          background: `${status.color}20`, 
                          color: status.color,
                          border: `1px solid ${status.color}40`
                        }}
                      >
                        {status.label}
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
