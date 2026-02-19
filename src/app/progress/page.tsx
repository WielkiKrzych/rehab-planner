'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useApp } from '@/context/AppContext';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

interface CheckinData {
  id: string;
  date: string;
  painLevel: number;
  energyLevel: number;
  sleepQuality: number;
  mood: number;
  readinessScore?: number;
}

export default function ProgressChartsPage() {
  const { patients } = useApp();
  const [selectedPatient, setSelectedPatient] = useState('');
  const [checkins, setCheckins] = useState<CheckinData[]>([]);
  const [loading, setLoading] = useState(false);

  const loadCheckins = async (patientId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/checkins?patientId=${patientId}`);
      const data = await res.json();
      
      const enrichedData = data.map((c: CheckinData, idx: number) => ({
        ...c,
        readinessScore: Math.round(((10 - c.painLevel) + c.energyLevel + c.sleepQuality + c.mood) / 4 * 10),
      }));
      
      setCheckins(enrichedData);
    } catch (error) {
      console.error('Failed to load checkins:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientChange = (patientId: string) => {
    setSelectedPatient(patientId);
    if (patientId) {
      loadCheckins(patientId);
    } else {
      setCheckins([]);
    }
  };

  const chartData = checkins.map(c => ({
    date: new Date(c.date).toLocaleDateString('pl-PL', { month: 'short', day: 'numeric' }),
    'Poziom bólu': c.painLevel,
    Energia: c.energyLevel,
    'Jakość snu': c.sleepQuality,
    Nastrój: c.mood,
    Gotowość: c.readinessScore || 0,
  })).reverse();

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-white">Wykresy </span>
            <span className="gradient-text glow-text">Postępów</span>
          </h1>
          <p className="text-white/50">Wizualizacja danych z codziennych ocen gotowości.</p>
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

        {selectedPatient && checkins.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Gotowość</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorGotowosc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                    <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a1a25', border: '1px solid rgba(0,240,255,0.3)', borderRadius: '8px' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="Gotowość" stroke="#00f0ff" fillOpacity={1} fill="url(#colorGotowosc)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Poziom bólu vs Energia</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                    <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} domain={[0, 10]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a1a25', border: '1px solid rgba(0,240,255,0.3)', borderRadius: '8px' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="Poziom bólu" stroke="#ff4444" strokeWidth={2} dot={{ fill: '#ff4444' }} />
                    <Line type="monotone" dataKey="Energia" stroke="#00ff88" strokeWidth={2} dot={{ fill: '#00ff88' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Wszystkie wskaźniki</h3>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                  <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} domain={[0, 10]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a25', border: '1px solid rgba(0,240,255,0.3)', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="Poziom bólu" stroke="#ff4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="Energia" stroke="#00ff88" strokeWidth={2} />
                  <Line type="monotone" dataKey="Jakość snu" stroke="#b829dd" strokeWidth={2} />
                  <Line type="monotone" dataKey="Nastrój" stroke="#ff00ff" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Śr. ból', key: 'Poziom bólu', color: '#ff4444' },
                { label: 'Śr. energia', key: 'Energia', color: '#00ff88' },
                { label: 'Śr. sen', key: 'Jakość snu', color: '#b829dd' },
                { label: 'Śr. nastrój', key: 'Nastrój', color: '#ff00ff' },
              ].map((stat) => {
                const avg = chartData.reduce((sum, d) => sum + (d[stat.key as keyof typeof d] as number), 0) / chartData.length;
                return (
                  <div key={stat.key} className="glass-card rounded-xl p-4 text-center">
                    <p className="text-sm text-white/50">{stat.label}</p>
                    <p className="text-3xl font-bold" style={{ color: stat.color }}>{avg.toFixed(1)}</p>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {selectedPatient && checkins.length === 0 && !loading && (
          <div className="glass-card rounded-2xl p-8 text-center">
            <p className="text-white/50">Brak danych do wyświetlenia. Zacznij wypełniać AI Check-in codziennie.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
