'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ExerciseList } from '@/components/exercises/ExerciseList';
import { useApp } from '@/context/AppContext';
import { ExerciseCategory, BodyPart } from '@/types';

const categoryOptions: { value: ExerciseCategory | ''; label: string }[] = [
  { value: '', label: 'Wszystkie kategorie' },
  { value: 'strength', label: 'Siłowe' },
  { value: 'stretching', label: 'Rozciąganie' },
  { value: 'mobility', label: 'Mobilność' },
  { value: 'balance', label: 'Równowaga' },
];

const bodyPartOptions: { value: BodyPart | ''; label: string }[] = [
  { value: '', label: 'Wszystkie części ciała' },
  { value: 'knee', label: 'Kolano' },
  { value: 'shoulder', label: 'Bark' },
  { value: 'spine', label: 'Kręgosłup' },
  { value: 'hip', label: 'Biodro' },
  { value: 'ankle', label: 'Kostka' },
];

export default function ExercisesPage() {
  const { exercises, isLoading } = useApp();
  const [categoryFilter, setCategoryFilter] = useState<ExerciseCategory | ''>('');
  const [bodyPartFilter, setBodyPartFilter] = useState<BodyPart | ''>('');

  const filteredExercises = exercises.filter((exercise) => {
    if (categoryFilter && exercise.category !== categoryFilter) return false;
    if (bodyPartFilter && exercise.bodyPart !== bodyPartFilter) return false;
    return true;
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Baza Ćwiczeń</h1>
            <p className="text-gray-500 mt-1">{filteredExercises.length} z {exercises.length} ćwiczeń</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as ExerciseCategory | '')}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent hover:border-gray-300 transition-all"
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={bodyPartFilter}
            onChange={(e) => setBodyPartFilter(e.target.value as BodyPart | '')}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent hover:border-gray-300 transition-all"
          >
            {bodyPartOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <ExerciseList exercises={filteredExercises} />
        )}
      </div>
    </Layout>
  );
}
