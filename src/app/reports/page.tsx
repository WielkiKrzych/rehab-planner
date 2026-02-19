'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useApp } from '@/context/AppContext';

export default function ReportsPage() {
  const { patients } = useApp();
  const [selectedPatient, setSelectedPatient] = useState('');
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadReports = async (patientId: string) => {
    try {
      const res = await fetch(`/api/reports?patientId=${patientId}`);
      const data = await res.json();
      setReports(data);
    } catch (error) {
      console.error('Failed to load reports:', error);
    }
  };

  const handlePatientChange = (patientId: string) => {
    setSelectedPatient(patientId);
    if (patientId) {
      loadReports(patientId);
    } else {
      setReports([]);
    }
  };

  const handleGenerateReport = async () => {
    if (!selectedPatient) return;

    setLoading(true);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId: selectedPatient }),
      });

      const data = await res.json();
      
      if (data.report) {
        setReports(prev => [data.report, ...prev]);
      } else if (data.error) {
        alert(data.error);
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-white">Raporty </span>
            <span className="gradient-text glow-text">Postępów</span>
          </h1>
          <p className="text-white/50">Cotygodniowa analiza z trendami oparta na danych z AI.</p>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-4">
          <div>
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
            <button
              onClick={handleGenerateReport}
              disabled={loading}
              className="btn-neon rounded-xl px-6 py-3 disabled:opacity-50"
            >
              {loading ? 'Generuję...' : 'Generuj raport tego tygodnia'}
            </button>
          )}
        </div>

        {reports.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Historia raportów</h3>
            {reports.map((report) => (
              <div key={report.id} className="glass-card rounded-2xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white">
                      {report.weekStart} - {report.weekEnd}
                    </h4>
                    <p className="text-sm text-white/50">
                      {new Date(report.createdAt).toLocaleDateString('pl-PL')}
                    </p>
                  </div>
                </div>
                
                {report.aiAnalysis && (
                  <div className="bg-black/30 rounded-xl p-4 space-y-3">
                    {report.aiAnalysis.split('\n').map((line: string, idx: number) => {
                      if (line.startsWith('## ')) {
                        return <h4 key={idx} className="text-lg font-bold text-neon-cyan mt-4">{line.replace('## ', '')}</h4>;
                      }
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return <h5 key={idx} className="font-semibold text-white mt-3">{line.replace(/\*\*/g, '')}</h5>;
                      }
                      if (line.startsWith('- ')) {
                        return <p key={idx} className="text-white/70 ml-4">{line}</p>;
                      }
                      if (line.startsWith('✅') || line.startsWith('⚠️') || line.startsWith('❌')) {
                        return <p key={idx} className="text-white font-medium">{line}</p>;
                      }
                      return <p key={idx} className="text-white/60">{line}</p>;
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
