'use client';

import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
import { PlanBuilder } from '@/components/plans/PlanBuilder';
import { useApp } from '@/context/AppContext';

export default function EditPlanPage() {
  const params = useParams();
  const router = useRouter();
  const { plans, isLoading } = useApp();

  const plan = useMemo(() => {
    return plans.find((p) => p.id === params.id);
  }, [plans, params.id]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  if (!plan) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Plan nie znaleziony</h2>
          <p className="text-gray-500 mb-4">Plan o podanym identyfikatorze nie istnieje.</p>
          <Link
            href="/plans"
            className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700"
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

  if (plan.status !== 'template') {
    return (
      <Layout>
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Edycja niedostępna</h2>
          <p className="text-gray-500 mb-4">
            Można edytować tylko szablony planów. Ten plan ma status &quot;{plan.status === 'active' ? 'Aktywny' : 'Zakończony'}&quot;.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href={`/plans/${plan.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 text-teal-600 hover:text-teal-700 font-medium"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Powrót do planu
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Link
              href={`/plans/${plan.id}`}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Edytuj plan</h1>
          </div>
          <p className="text-gray-500 ml-8">
            {plan.name}
          </p>
        </div>
        <PlanBuilder initialPlan={plan} />
      </div>
    </Layout>
  );
}
