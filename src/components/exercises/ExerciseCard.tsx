'use client';

import { memo } from 'react';
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
  'bg-neon-green/20 text-neon-green border-neon-green/40',
  'bg-amber-500/20 text-amber-400 border-amber-500/40',
  'bg-neon-pink/20 text-neon-pink border-neon-pink/40',
];

const categoryColors: Record<string, string> = {
  strength: 'bg-neon-pink/20 text-neon-pink',
  stretching: 'bg-neon-cyan/20 text-neon-cyan',
  mobility: 'bg-neon-purple/20 text-neon-purple',
  balance: 'bg-amber-500/20 text-amber-400',
};

const bodyPartColors: Record<string, string> = {
  knee: 'bg-neon-cyan/20 text-neon-cyan',
  shoulder: 'bg-neon-purple/20 text-neon-purple',
  spine: 'bg-neon-green/20 text-neon-green',
  hip: 'bg-neon-pink/20 text-neon-pink',
  ankle: 'bg-amber-500/20 text-amber-400',
  wrist: 'bg-indigo-400/20 text-indigo-400',
  elbow: 'bg-orange-400/20 text-orange-400',
  neck: 'bg-gray-400/20 text-gray-300',
};

function ExerciseCardComponent({ exercise }: ExerciseCardProps) {
  return (
    <div className="group glass-card rounded-xl p-5 hover:border-neon-cyan/40 transition-all duration-300 cursor-pointer h-full border border-neon-cyan/10 hover:shadow-lg hover:shadow-neon-cyan/10">
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-semibold text-white group-hover:text-neon-cyan transition-colors line-clamp-2">
            {exercise.name}
          </h3>
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border shrink-0 ${difficultyColors[exercise.difficulty - 1]}`}
          >
            Poziom {exercise.difficulty}
          </span>
        </div>

        <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-grow">
          {exercise.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`px-2.5 py-1 text-xs rounded-lg font-medium ${categoryColors[exercise.category]}`}>
            {categoryLabels[exercise.category]}
          </span>
          <span className={`px-2.5 py-1 text-xs rounded-lg font-medium ${bodyPartColors[exercise.bodyPart] || 'bg-gray-700/50 text-gray-400'}`}>
            {bodyPartLabels[exercise.bodyPart]}
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500 mt-auto pt-3 border-t border-neon-cyan/10">
          {exercise.sets && exercise.reps && (
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-neon-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{exercise.sets}x {exercise.reps}</span>
            </div>
          )}
          {exercise.duration && (
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-neon-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

export const ExerciseCard = memo(ExerciseCardComponent);
