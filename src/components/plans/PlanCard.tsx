'use client';

import Link from 'next/link';
import { RehabilitationPlan } from '@/types';

interface PlanCardProps {
  plan: RehabilitationPlan;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  template: { label: 'Szablon', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  active: { label: 'Aktywny', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  completed: { label: 'Zakończony', className: 'bg-gray-100 text-gray-600 border-gray-200' },
};

export function PlanCard({ plan }: PlanCardProps) {
  const status = statusConfig[plan.status];
  const weekCount = plan.weeks.length;
  const totalExercises = plan.weeks.reduce(
    (acc, week) => acc + week.days.reduce((dayAcc, day) => dayAcc + day.exercises.length, 0),
    0
  );

  return (
    <Link href={`/plans/${plan.id}`}>
      <div className="group bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-lg hover:border-teal-200 transition-all duration-300 cursor-pointer h-full">
        <div className="flex flex-col h-full">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="font-semibold text-gray-900 group-hover:text-teal-700 transition-colors line-clamp-2">
              {plan.name}
            </h3>
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border shrink-0 ${status.className}`}
            >
              {status.label}
            </span>
          </div>

          {plan.description && (
            <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">
              {plan.description}
            </p>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-400 mt-auto pt-3 border-t border-gray-50">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>
                {weekCount} {weekCount === 1 ? 'tydzień' : 'tygodnie'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
              <span>
                {totalExercises} {totalExercises === 1 ? 'ćwiczenie' : 'ćwiczeń'}
              </span>
            </div>
          </div>

          <div className="flex justify-end mt-3">
            <div className="text-gray-300 group-hover:text-teal-500 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
