'use client';

import { Exercise } from '@/types';

interface ExerciseCardProps {
  exercise: Exercise;
}

const categoryLabels: Record<string, string> = {
  strength: 'Siłowe',
  stretching: 'Rozciąganie',
  mobility: 'Mobilność',
  balance: 'Równowaga',
};

const bodyPartLabels: Record<string, string> = {
  knee: 'Kolano',
  shoulder: 'Bark',
  spine: 'Kręgosłup',
  hip: 'Biodro',
  ankle: 'Kostka',
  wrist: 'Nadgarstek',
  elbow: 'Łokieć',
  neck: 'Szyja',
};

const difficultyColors = [
  'bg-green-100 text-green-700 border-green-200',
  'bg-yellow-100 text-yellow-700 border-yellow-200',
  'bg-red-100 text-red-700 border-red-200',
];

const categoryColors: Record<string, string> = {
  strength: 'bg-rose-100 text-rose-700',
  stretching: 'bg-cyan-100 text-cyan-700',
  mobility: 'bg-violet-100 text-violet-700',
  balance: 'bg-amber-100 text-amber-700',
};

const bodyPartColors: Record<string, string> = {
  knee: 'bg-blue-100 text-blue-700',
  shoulder: 'bg-indigo-100 text-indigo-700',
  spine: 'bg-emerald-100 text-emerald-700',
  hip: 'bg-purple-100 text-purple-700',
  ankle: 'bg-teal-100 text-teal-700',
  wrist: 'bg-pink-100 text-pink-700',
  elbow: 'bg-orange-100 text-orange-700',
  neck: 'bg-slate-100 text-slate-700',
};

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  return (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-lg hover:border-teal-200 transition-all duration-300 cursor-pointer h-full">
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-semibold text-gray-900 group-hover:text-teal-700 transition-colors line-clamp-2">
            {exercise.name}
          </h3>
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border shrink-0 ${difficultyColors[exercise.difficulty - 1]}`}
          >
            Poziom {exercise.difficulty}
          </span>
        </div>

        <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">
          {exercise.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`px-2.5 py-1 text-xs rounded-lg font-medium ${categoryColors[exercise.category]}`}>
            {categoryLabels[exercise.category]}
          </span>
          <span className={`px-2.5 py-1 text-xs rounded-lg font-medium ${bodyPartColors[exercise.bodyPart] || 'bg-gray-100 text-gray-700'}`}>
            {bodyPartLabels[exercise.bodyPart]}
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-400 mt-auto pt-3 border-t border-gray-50">
          {exercise.sets && exercise.reps && (
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{exercise.sets}x {exercise.reps}</span>
            </div>
          )}
          {exercise.duration && (
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{exercise.duration}s</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
