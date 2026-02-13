'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
import { PlanList } from '@/components/plans/PlanList';
import { useApp } from '@/context/AppContext';

type PlanStatus = 'template' | 'active' | 'completed';

const tabs: { value: PlanStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Wszystkie' },
  { value: 'template', label: 'Szablony' },
  { value: 'active', label: 'Aktywne' },
  { value: 'completed', label: 'Zakończone' },
];

export default function PlansPage() {
  const { plans, isLoading } = useApp();
  const [activeTab, setActiveTab] = useState<PlanStatus | 'all'>('all');

  const filteredPlans = useMemo(() => {
    if (activeTab === 'all') return plans;
    return plans.filter((plan) => plan.status === activeTab);
  }, [plans, activeTab]);

  const tabCounts = useMemo(() => {
    return {
      all: plans.length,
      template: plans.filter((p) => p.status === 'template').length,
      active: plans.filter((p) => p.status === 'active').length,
      completed: plans.filter((p) => p.status === 'completed').length,
    };
  }, [plans]);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Plany rehabilitacji</h1>
            <p className="text-gray-400 mt-1">
              {plans.length} {plans.length === 1 ? 'plan' : 'planów'} w bazie
            </p>
          </div>
          <Link
            href="/plans/new"
            className="btn-neon inline-flex items-center gap-2 px-5 py-2.5"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Utwórz plan
          </Link>
        </div>

        <div className="flex gap-2 border-b border-neon-cyan/20">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-3 text-sm font-medium transition-all relative ${
                activeTab === tab.value
                  ? 'text-neon-cyan'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab.label}
              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${activeTab === tab.value ? 'bg-neon-cyan/20' : 'bg-white/5'}`}>
                {tabCounts[tab.value]}
              </span>
              {activeTab === tab.value && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-t" />
              )}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <PlanList plans={filteredPlans} />
        )}
      </div>
    </Layout>
  );
}
