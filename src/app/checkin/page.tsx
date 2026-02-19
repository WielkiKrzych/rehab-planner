'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useApp } from '@/context/AppContext';

export default function DailyCheckinPage() {
  const { patients } = useApp();
  const [selectedPatient, setSelectedPatient] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [painLevel, setPainLevel] = useState(0);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [sleepQuality, setSleepQuality] = useState(5);
  const [mood, setMood] = useState(5);
  const [notes, setNotes] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) {
      setError('Wybierz pacjenta');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/checkins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: selectedPatient,
          date,
          painLevel,
          energyLevel,
          sleepQuality,
          mood,
          notes,
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Wystąpił błąd');
        return;
      }

      setResult(data);
    } catch (err) {
      setError('Wystąpił błąd podczas wysyłania');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'full': return '#00ff88';
      case 'normal': return '#00f0ff';
      case 'light': return '#ffaa00';
      case 'rest': return '#ff4444';
      default: return '#666';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'full': return 'Pełna gotowość';
      case 'normal': return 'Normalna forma';
      case 'light': return 'Lekka aktywność';
      case 'rest': return 'Odpoczynek';
      default: return status;
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-white">Codzienna </span>
            <span className="gradient-text glow-text">Ocena Gotowości</span>
          </h1>
          <p className="text-white/50">Wypełnij ankietę przed treningiem, aby dostosować intensywność.</p>
        </div>

        {result ? (
          <div className="glass-card rounded-2xl p-8">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">
                {result.status === 'full' ? '💪' : result.status === 'rest' ? '😴' : '👍'}
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{getStatusLabel(result.status)}</h2>
              <div className="text-4xl font-bold gradient-text mb-4">
                {result.readinessScore}/100
              </div>
            </div>
            
            <div className="bg-black/30 rounded-xl p-4 mb-6">
              <p className="text-white/80">{result.aiRecommendation}</p>
            </div>

            <button
              onClick={() => setResult(null)}
              className="w-full btn-neon rounded-xl py-3"
            >
              Wypełnij ponownie
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-400">
                {error}
              </div>
            )}

            <div className="glass-card rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-white">Wybierz pacjenta</h3>
              <select
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                className="form-input w-full"
              >
                <option value="">Wybierz pacjenta...</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.firstName} {p.lastName}
                  </option>
                ))}
              </select>

              <div>
                <label className="block text-sm text-white/70 mb-2">Data</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="form-input w-full"
                />
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 space-y-6">
              <h3 className="text-lg font-semibold text-white">Jak się czujesz?</h3>
              
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-white/70">Poziom bólu (0-10)</label>
                  <span className="text-neon-cyan font-bold">{painLevel}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={painLevel}
                  onChange={(e) => setPainLevel(Number(e.target.value))}
                  className="w-full accent-neon-cyan"
                />
                <div className="flex justify-between text-xs text-white/40 mt-1">
                  <span>Brak bólu</span>
                  <span>Nie do zniesienia</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-white/70">Poziom energii (1-10)</label>
                  <span className="text-neon-green font-bold">{energyLevel}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={energyLevel}
                  onChange={(e) => setEnergyLevel(Number(e.target.value))}
                  className="w-full accent-neon-green"
                />
                <div className="flex justify-between text-xs text-white/40 mt-1">
                  <span>Zupełny brak</span>
                  <span>Pełen wigor</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-white/70">Jakość snu (1-10)</label>
                  <span className="text-neon-purple font-bold">{sleepQuality}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={sleepQuality}
                  onChange={(e) => setSleepQuality(Number(e.target.value))}
                  className="w-full accent-neon-purple"
                />
                <div className="flex justify-between text-xs text-white/40 mt-1">
                  <span>Zły sen</span>
                  <span>Idealny sen</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-white/70">Nastrój (1-10)</label>
                  <span className="text-neon-pink font-bold">{mood}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={mood}
                  onChange={(e) => setMood(Number(e.target.value))}
                  className="w-full accent-neon-pink"
                />
                <div className="flex justify-between text-xs text-white/40 mt-1">
                  <span>Zły</span>
                  <span>Świetny</span>
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-2">Dodatkowe uwagi</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="form-input w-full h-24 resize-none"
                  placeholder="Wszelkie dodatkowe informacje..."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-neon rounded-xl py-4 text-lg font-semibold disabled:opacity-50"
            >
              {loading ? 'Analizuję...' : 'Wyślij ocenę'}
            </button>
          </form>
        )}
      </div>
    </Layout>
  );
}
