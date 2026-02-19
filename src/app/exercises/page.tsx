'use client';

import { useState, useMemo } from 'react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ExerciseCategory | ''>('');
  const [bodyPartFilter, setBodyPartFilter] = useState<BodyPart | ''>('');

  const filteredExercises = useMemo(() => {
    let result = exercises;
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((exercise) => 
        exercise.name.toLowerCase().includes(query) ||
        exercise.description.toLowerCase().includes(query) ||
        exercise.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    if (categoryFilter) {
      result = result.filter((exercise) => exercise.category === categoryFilter);
    }
    
    if (bodyPartFilter) {
      result = result.filter((exercise) => exercise.bodyPart === bodyPartFilter);
    }
    
    return result;
  }, [exercises, searchQuery, categoryFilter, bodyPartFilter]);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Baza Ćwiczeń</h1>
            <p className="text-gray-400 mt-1">{filteredExercises.length} z {exercises.length} ćwiczeń</p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Szukaj ćwiczeń..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input w-full pl-11 pr-4 py-3"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as ExerciseCategory | '')}
            className="form-input px-4 py-2.5 min-w-[180px]"
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
            className="form-input px-4 py-2.5 min-w-[180px]"
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
            <div className="w-8 h-8 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <ExerciseList exercises={filteredExercises} />
        )}
      </div>
    </Layout>
  );
}
