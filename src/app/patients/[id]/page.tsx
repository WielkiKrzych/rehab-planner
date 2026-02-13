'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
import { useApp } from '@/context/AppContext';
import { RehabilitationPlan } from '@/types';

function formatBirthDate(dateString: string): string {
  if (!dateString) return 'Nie podano';
  const date = new Date(dateString);
  return date.toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('pl-PL', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { patients, plans, isLoading, addDiagnosis, addPlan, updatePatient } = useApp();
  const [isDiagnosisModalOpen, setIsDiagnosisModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [diagnosisForm, setDiagnosisForm] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const patient = patients.find((p) => p.id === params.id);

  const patientPlans = useMemo(() => 
    plans.filter(p => p.patientId === params.id),
    [plans, params.id]
  );

  const templates = useMemo(() => 
    plans.filter(p => p.status === 'template'),
    [plans]
  );

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  if (!patient) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Pacjent nie znaleziony</h2>
          <Link href="/patients" className="text-teal-600 hover:text-teal-700">
            Powrót do listy pacjentów
          </Link>
        </div>
      </Layout>
    );
  }

  const handleAddDiagnosis = async () => {
    if (!diagnosisForm.name.trim()) return;

    await addDiagnosis(patient.id, {
      name: diagnosisForm.name,
      date: diagnosisForm.date,
      notes: diagnosisForm.notes || undefined,
    });
    
    setIsDiagnosisModalOpen(false);
    setDiagnosisForm({ name: '', date: new Date().toISOString().split('T')[0], notes: '' });
  };

  const handleAssignPlan = async (templateId: string) => {
    const template = plans.find(p => p.id === templateId);
    if (!template) return;

    const newPlanData: Omit<RehabilitationPlan, 'id' | 'createdAt'> = {
      name: template.name,
      description: template.description,
      patientId: patient.id,
      status: 'active',
      weeks: template.weeks,
    };
    
    const newPlan = await addPlan(newPlanData);
    
    await updatePatient(patient.id, { activePlanId: newPlan.id });
    
    setIsPlanModalOpen(false);
    router.push(`/plans/${newPlan.id}`);
  };

  const initials = `${patient.firstName[0]}${patient.lastName[0]}`.toUpperCase();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors">
          <Link href="/patients" className="inline-flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Powrót do listy pacjentów
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-8 py-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-xl">
                  {initials}
                </div>
                <div className="text-white">
                  <h1 className="text-2xl font-bold">
                    {patient.firstName} {patient.lastName}
                  </h1>
                  <p className="text-white/80 mt-1">
                    {formatBirthDate(patient.birthDate)}
                  </p>
                </div>
              </div>
              <Link
                href={`/patients/${patient.id}/edit`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edytuj
              </Link>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {patient.phone && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Telefon</p>
                    <p className="font-medium text-gray-900">{patient.phone}</p>
                  </div>
                </div>
              )}

              {patient.email && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{patient.email}</p>
                  </div>
                </div>
              )}
            </div>

            {patient.notes && (
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Notatki</h3>
                <p className="text-gray-700 bg-gray-50 rounded-lg p-4">{patient.notes}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Diagnozy</h2>
            <button
              onClick={() => setIsDiagnosisModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Dodaj diagnozę
            </button>
          </div>

          {patient.diagnoses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p>Brak zapisanych diagnoz</p>
            </div>
          ) : (
            <div className="space-y-3">
              {patient.diagnoses.map((diagnosis) => (
                <div
                  key={diagnosis.id}
                  className="flex items-start gap-4 p-4 bg-amber-50 border border-amber-100 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900">{diagnosis.name}</h4>
                      <span className="text-xs text-gray-500">{formatDate(diagnosis.date)}</span>
                    </div>
                    {diagnosis.notes && (
                      <p className="text-sm text-gray-600 mt-1">{diagnosis.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Plany rehabilitacji</h2>
            <button
              onClick={() => setIsPlanModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Przypisz plan
            </button>
          </div>

          {patientPlans.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p>Brak przypisanych planów</p>
            </div>
          ) : (
            <div className="space-y-3">
              {patientPlans.map((plan) => {
                const statusColors: Record<string, string> = {
                  active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
                  completed: 'bg-gray-100 text-gray-600 border-gray-200',
                };
                const statusLabels: Record<string, string> = {
                  active: 'Aktywny',
                  completed: 'Zakończony',
                };
                return (
                  <Link
                    key={plan.id}
                    href={`/plans/${plan.id}`}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{plan.name}</p>
                      <p className="text-sm text-gray-500">{plan.weeks.length} tygodni • {formatDate(plan.createdAt)}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${statusColors[plan.status]}`}>
                      {statusLabels[plan.status]}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {isPlanModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsPlanModalOpen(false)}
            />
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 z-10 max-h-[80vh] overflow-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Przypisz plan z szablonu</h3>
              
              {templates.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Brak szablonów planów</p>
                  <Link
                    href="/plans/new"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Utwórz szablon
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleAssignPlan(template.id)}
                      className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-teal-300 hover:bg-teal-50 transition-all"
                    >
                      <p className="font-medium text-gray-900">{template.name}</p>
                      <p className="text-sm text-gray-500">{template.weeks.length} tygodni</p>
                      {template.description && (
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{template.description}</p>
                      )}
                    </button>
                  ))}
                </div>
              )}
              
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setIsPlanModalOpen(false)}
                  className="px-4 py-2.5 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Anuluj
                </button>
              </div>
            </div>
          </div>
        )}

        {isDiagnosisModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsDiagnosisModalOpen(false)}
            />
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 z-10">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Nowa diagnoza</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Nazwa diagnozy
                  </label>
                  <input
                    type="text"
                    value={diagnosisForm.name}
                    onChange={(e) => setDiagnosisForm({ ...diagnosisForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="np. Zerwanie więzadła ACL"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Data diagnozy
                  </label>
                  <input
                    type="date"
                    value={diagnosisForm.date}
                    onChange={(e) => setDiagnosisForm({ ...diagnosisForm, date: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Notatki (opcjonalnie)
                  </label>
                  <textarea
                    value={diagnosisForm.notes}
                    onChange={(e) => setDiagnosisForm({ ...diagnosisForm, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                    placeholder="Dodatkowe informacje..."
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAddDiagnosis}
                  disabled={!diagnosisForm.name.trim()}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium rounded-lg hover:from-teal-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Dodaj
                </button>
                <button
                  onClick={() => setIsDiagnosisModalOpen(false)}
                  className="px-4 py-2.5 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Anuluj
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
