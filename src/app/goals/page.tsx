'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useApp } from '@/context/AppContext';

export default function GoalsPage() {
  const { patients } = useApp();
  const [selectedPatient, setSelectedPatient] = useState('');
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [goalType, setGoalType] = useState('recovery');
  const [targetDate, setTargetDate] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);

  const loadGoals = async (patientId: string) => {
    try {
      const res = await fetch(`/api/goals?patientId=${patientId}`);
      const data = await res.json();
      setGoals(data);
    } catch (error) {
      console.error('Failed to load goals:', error);
    }
  };

  const handlePatientChange = (patientId: string) => {
    setSelectedPatient(patientId);
    setGeneratedPlan(null);
    if (patientId) {
      loadGoals(patientId);
    } else {
      setGoals([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !name) return;

    setLoading(true);
    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: selectedPatient,
          name,
          description,
          goalType,
          targetDate: targetDate || undefined,
        }),
      });

      const data = await res.json();
      
      if (data.goal) {
        setGoals(prev => [data.goal, ...prev]);
        if (data.weeklyPlan) {
          setGeneratedPlan(data.weeklyPlan);
        }
        setShowForm(false);
        setName('');
        setDescription('');
        setGoalType('recovery');
        setTargetDate('');
      }
    } catch (error) {
      console.error('Failed to create goal:', error);
    } finally {
      setLoading(false);
    }
  };

  const goalTypeLabels: Record<string, string> = {
    recovery: 'Powrót po urazie',
    strength: 'Wzmocnienie',
    mobility: 'Mobilność',
    endurance: 'Wytrzymałość',
    pain_free: 'Eliminacja bólu',
    function: 'Funkcjonalność',
    other: 'Inny',
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-white">AI </span>
            <span className="gradient-text glow-text">Cele i Plany</span>
          </h1>
          <p className="text-white/50">Definiuj cele i otrzymuj wygenerowane przez AI plany treningowe.</p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <label className="block text-sm text-white/70 mb-2">Wybierz pacjenta</label>
          <select
            value={selectedPatient}
            onChange={(e) => handlePatientChange(e.target.value)}
            className="form-input w-full max-w-md"
          >
            <option value="">Wybierz pacjenta...</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.firstName} {p.lastName}
              </option>
            ))}
          </select>
        </div>

        {selectedPatient && (
          <>
            {!showForm ? (
              <div className="flex justify-end">
                <button
                  onClick={() => setShowForm(true)}
                  className="btn-neon rounded-xl px-6 py-3"
                >
                  + Dodaj nowy cel
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-white">Nowy cel</h3>
                
                <div>
                  <label className="block text-sm text-white/70 mb-2">Nazwa celu</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input w-full"
                    placeholder="np. Powrót do biegania"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">Typ celu</label>
                  <select
                    value={goalType}
                    onChange={(e) => setGoalType(e.target.value)}
                    className="form-input w-full"
                  >
                    {Object.entries(goalTypeLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">Opis (opcjonalne)</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="form-input w-full h-24 resize-none"
                    placeholder="Dodatkowe informacje o celu..."
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">Data docelowa (opcjonalne)</label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="form-input w-full"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-neon rounded-xl py-2 px-4 disabled:opacity-50"
                  >
                    {loading ? 'Generuję...' : 'Generuj plan'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 rounded-xl text-white/60 hover:text-white"
                  >
                    Anuluj
                  </button>
                </div>
              </form>
            )}

            {generatedPlan && (
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  Wygenerowany plan: {generatedPlan.goal}
                </h3>
                
                <div className="space-y-6">
                  {generatedPlan.weeks.map((week: any) => (
                    <div key={week.weekNumber} className="border border-white/10 rounded-xl p-4">
                      <h4 className="text-lg font-semibold text-neon-cyan mb-3">
                        Tydzień {week.weekNumber}: {week.focus}
                      </h4>
                      <div className="grid grid-cols-7 gap-2">
                        {week.dailyPlan.map((day: any, idx: number) => (
                          <div
                            key={idx}
                            className={`p-2 rounded-lg text-xs ${
                              day.intensity === 'brak'
                                ? 'bg-white/5 text-white/40'
                                : day.intensity === 'niska'
                                ? 'bg-green-500/20 text-green-400'
                                : day.intensity === 'średnia'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            <div className="font-semibold">Dzień {day.day}</div>
                            <div className="mt-1">{day.duration} min</div>
                            <div className="mt-1 opacity-70">{day.intensity}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {goals.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Istniejące cele</h3>
                {goals.map((goal) => (
                  <div key={goal.id} className="glass-card rounded-xl p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-white">{goal.name}</h4>
                        <p className="text-sm text-white/50">
                          {goalTypeLabels[goal.goalType] || goal.goalType}
                        </p>
                        {goal.description && (
                          <p className="text-sm text-white/40 mt-1">{goal.description}</p>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        goal.status === 'active'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {goal.status === 'active' ? 'Aktywny' : goal.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
