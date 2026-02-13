'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Exercise, RehabilitationPlan, PlanWeek, PlanExercise, ExerciseCategory, BodyPart } from '@/types';
import { useApp } from '@/context/AppContext';

interface PlanBuilderProps {
  initialPlan?: RehabilitationPlan;
}

const categoryLabels: Record<ExerciseCategory, string> = {
  strength: 'Siłowe',
  stretching: 'Rozciąganie',
  mobility: 'Mobilność',
  balance: 'Równowaga',
};

const bodyPartLabels: Record<BodyPart, string> = {
  knee: 'Kolano',
  shoulder: 'Bark',
  spine: 'Kręgosłup',
  hip: 'Biodro',
  ankle: 'Kostka',
  wrist: 'Nadgarstek',
  elbow: 'Łokieć',
  neck: 'Szyja',
};

const dayNames = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nd'];

function createEmptyWeek(weekNumber: number): PlanWeek {
  return {
    weekNumber,
    days: Array.from({ length: 7 }, (_, i) => ({
      dayNumber: i + 1,
      exercises: [],
    })),
  };
}

export function PlanBuilder({ initialPlan }: PlanBuilderProps) {
  const router = useRouter();
  const { exercises, patients, plans, setPlans } = useApp();

  const [name, setName] = useState(initialPlan?.name || '');
  const [description, setDescription] = useState(initialPlan?.description || '');
  const [weeks, setWeeks] = useState<PlanWeek[]>(
    initialPlan?.weeks || [createEmptyWeek(1)]
  );
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [selectedDay, setSelectedDay] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState<ExerciseCategory | ''>('');
  const [bodyPartFilter, setBodyPartFilter] = useState<BodyPart | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPatientSelector, setShowPatientSelector] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  const filteredExercises = useMemo(() => {
    return exercises.filter((exercise) => {
      if (categoryFilter && exercise.category !== categoryFilter) return false;
      if (bodyPartFilter && exercise.bodyPart !== bodyPartFilter) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        if (!exercise.name.toLowerCase().includes(query)) return false;
      }
      return true;
    });
  }, [exercises, categoryFilter, bodyPartFilter, searchQuery]);

  const currentWeek = weeks[selectedWeek];

  const addWeek = () => {
    setWeeks([...weeks, createEmptyWeek(weeks.length + 1)]);
    setSelectedWeek(weeks.length);
  };

  const removeWeek = (weekIndex: number) => {
    if (weeks.length <= 1) return;
    const newWeeks = weeks.filter((_, i) => i !== weekIndex);
    newWeeks.forEach((week, i) => {
      week.weekNumber = i + 1;
    });
    setWeeks(newWeeks);
    if (selectedWeek >= newWeeks.length) {
      setSelectedWeek(newWeeks.length - 1);
    }
  };

  const addExerciseToDay = (exercise: Exercise) => {
    const newWeeks = [...weeks];
    const planExercise: PlanExercise = {
      exerciseId: exercise.id,
      sets: exercise.sets || 3,
      reps: exercise.reps || 10,
      holdSeconds: exercise.duration,
    };
    newWeeks[selectedWeek] = {
      ...newWeeks[selectedWeek],
      days: newWeeks[selectedWeek].days.map((day, i) =>
        i === selectedDay
          ? { ...day, exercises: [...day.exercises, planExercise] }
          : day
      ),
    };
    setWeeks(newWeeks);
  };

  const updateExerciseInDay = (
    dayIndex: number,
    exerciseIndex: number,
    updates: Partial<PlanExercise>
  ) => {
    const newWeeks = [...weeks];
    newWeeks[selectedWeek] = {
      ...newWeeks[selectedWeek],
      days: newWeeks[selectedWeek].days.map((day, i) =>
        i === dayIndex
          ? {
              ...day,
              exercises: day.exercises.map((ex, j) =>
                j === exerciseIndex ? { ...ex, ...updates } : ex
              ),
            }
          : day
      ),
    };
    setWeeks(newWeeks);
  };

  const removeExerciseFromDay = (dayIndex: number, exerciseIndex: number) => {
    const newWeeks = [...weeks];
    newWeeks[selectedWeek] = {
      ...newWeeks[selectedWeek],
      days: newWeeks[selectedWeek].days.map((day, i) =>
        i === dayIndex
          ? {
              ...day,
              exercises: day.exercises.filter((_, j) => j !== exerciseIndex),
            }
          : day
      ),
    };
    setWeeks(newWeeks);
  };

  const getExerciseById = (id: string): Exercise | undefined => {
    return exercises.find((ex) => ex.id === id);
  };

  const savePlan = async (status: 'template' | 'active', patientId?: string) => {
    if (!name.trim()) {
      alert('Podaj nazwę planu');
      return;
    }

    setIsSaving(true);

    const plan: RehabilitationPlan = {
      id: initialPlan?.id || `plan-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || undefined,
      patientId: status === 'active' ? patientId : undefined,
      weeks,
      createdAt: initialPlan?.createdAt || new Date().toISOString(),
      status,
    };

    let newPlans: RehabilitationPlan[];
    if (initialPlan) {
      newPlans = plans.map((p) => (p.id === initialPlan.id ? plan : p));
    } else {
      newPlans = [...plans, plan];
    }

    setPlans(newPlans);
    setIsSaving(false);
    router.push(`/plans/${plan.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nazwa planu *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="np. Rehabilitacja po urazie ACL"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Opis (opcjonalnie)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Krótki opis planu"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-4 max-h-[600px] overflow-hidden flex flex-col">
          <h3 className="font-semibold text-gray-900 mb-3">Baza ćwiczeń</h3>

          <div className="space-y-2 mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Szukaj ćwiczenia..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <div className="flex gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as ExerciseCategory | '')}
                className="flex-1 px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Kategoria</option>
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <select
                value={bodyPartFilter}
                onChange={(e) => setBodyPartFilter(e.target.value as BodyPart | '')}
                className="flex-1 px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Ciało</option>
                {Object.entries(bodyPartLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredExercises.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-8">
                Brak ćwiczeń pasujących do filtrów
              </p>
            ) : (
              filteredExercises.map((exercise) => (
                <button
                  key={exercise.id}
                  onClick={() => addExerciseToDay(exercise)}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-teal-50 hover:border-teal-200 border border-gray-100 rounded-lg transition-all group"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate group-hover:text-teal-700">
                        {exercise.name}
                      </p>
                      <div className="flex gap-1 mt-1">
                        <span className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">
                          {categoryLabels[exercise.category]}
                        </span>
                        <span className="px-1.5 py-0.5 text-xs bg-purple-100 text-purple-700 rounded">
                          {bodyPartLabels[exercise.bodyPart]}
                        </span>
                      </div>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-300 group-hover:text-teal-500 transition-colors shrink-0 ml-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-4 overflow-hidden flex flex-col">
          <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
            {weeks.map((week, index) => (
              <button
                key={index}
                onClick={() => setSelectedWeek(index)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedWeek === index
                    ? 'bg-teal-500 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Tydzień {week.weekNumber}
              </button>
            ))}
            <button
              onClick={addWeek}
              className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-all"
            >
              + Dodaj tydzień
            </button>
            {weeks.length > 1 && (
              <button
                onClick={() => removeWeek(selectedWeek)}
                className="ml-auto px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
              >
                Usuń tydzień
              </button>
            )}
          </div>

          <div className="flex-1 overflow-x-auto">
            <div className="grid grid-cols-7 gap-2 min-w-[700px]">
              {currentWeek?.days.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  onClick={() => setSelectedDay(dayIndex)}
                  className={`p-2 rounded-lg border-2 transition-all cursor-pointer min-h-[300px] ${
                    selectedDay === dayIndex
                      ? 'border-teal-400 bg-teal-50'
                      : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                  }`}
                >
                  <p className="font-medium text-sm text-gray-700 text-center mb-2 pb-2 border-b border-gray-200">
                    {dayNames[dayIndex]}
                  </p>
                  <div className="space-y-2">
                    {day.exercises.length === 0 ? (
                      <p className="text-xs text-gray-400 text-center py-4">Kliknij ćwiczenie</p>
                    ) : (
                      day.exercises.map((planEx, exIndex) => {
                        const exercise = getExerciseById(planEx.exerciseId);
                        if (!exercise) return null;
                        return (
                          <div
                            key={exIndex}
                            className="bg-white p-2 rounded border border-gray-200 text-xs group relative"
                          >
                            <p className="font-medium text-gray-800 truncate pr-4">{exercise.name}</p>
                            <div className="flex items-center gap-1 mt-1 text-gray-500">
                              <input
                                type="number"
                                value={planEx.sets}
                                onChange={(e) =>
                                  updateExerciseInDay(dayIndex, exIndex, {
                                    sets: parseInt(e.target.value) || 1,
                                  })
                                }
                                onClick={(e) => e.stopPropagation()}
                                className="w-8 px-1 py-0.5 border border-gray-200 rounded text-center"
                              />
                              <span>x</span>
                              <input
                                type="number"
                                value={planEx.reps}
                                onChange={(e) =>
                                  updateExerciseInDay(dayIndex, exIndex, {
                                    reps: parseInt(e.target.value) || 1,
                                  })
                                }
                                onClick={(e) => e.stopPropagation()}
                                className="w-8 px-1 py-0.5 border border-gray-200 rounded text-center"
                              />
                            </div>
                            {planEx.holdSeconds && (
                              <p className="text-gray-400 mt-0.5">{planEx.holdSeconds}s</p>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeExerciseFromDay(dayIndex, exIndex);
                              }}
                              className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center text-gray-300 hover:text-red-500 transition-colors"
                            >
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 text-sm text-gray-500">
            Wybrany dzień: {dayNames[selectedDay]}, Tydzień {selectedWeek + 1}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => router.push('/plans')}
            className="px-5 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Anuluj
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => savePlan('template')}
              disabled={isSaving || !name.trim()}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Zapisz jako szablon
            </button>
            <button
              onClick={() => setShowPatientSelector(true)}
              disabled={isSaving || !name.trim()}
              className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium rounded-lg hover:from-teal-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
            >
              Zapisz i przypisz
            </button>
          </div>
        </div>
      </div>

      {showPatientSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Przypisz do pacjenta</h3>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4"
            >
              <option value="">Wybierz pacjenta...</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.firstName} {patient.lastName}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowPatientSelector(false);
                  setSelectedPatientId('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Anuluj
              </button>
              <button
                onClick={() => {
                  if (selectedPatientId) {
                    savePlan('active', selectedPatientId);
                  }
                }}
                disabled={!selectedPatientId}
                className="px-4 py-2 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Zapisz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
