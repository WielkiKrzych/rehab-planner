'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { useApp } from '@/context/AppContext';
import { BodyPart } from '@/types';
import { Phase } from '@/data/clinicalTags';
import {
  generatePlan,
  progressWeeks,
  GeneratorResult,
  ClinicalContext,
  DEFAULT_CONTEXT,
} from '@/lib/planGenerator';

const bodyPartLabels: Record<BodyPart, string> = {
  knee: 'Kolano',
  shoulder: 'Bark',
  spine: 'Kręgosłup',
  hip: 'Biodro',
  ankle: 'Staw skokowy / stopa',
  wrist: 'Nadgarstek',
  elbow: 'Łokieć',
  neck: 'Szyja',
};

const phaseLabels: Record<Phase, { name: string; desc: string }> = {
  1: { name: 'Faza ostra', desc: 'kontrola bólu, wczesna mobilizacja' },
  2: { name: 'Faza przebudowy', desc: 'odbudowa siły i zakresu ruchu' },
  3: { name: 'Faza funkcjonalna', desc: 'powrót do aktywności' },
};

const EQUIPMENT_OPTIONS = [
  'resistance band',
  'dumbbell',
  'step',
  'bench',
  'foam roller',
  'towel',
  'marbles',
  'stress ball',
  'grip strengthener',
  'hammer',
];

const equipmentLabels: Record<string, string> = {
  'resistance band': 'Taśma oporowa',
  dumbbell: 'Hantle',
  step: 'Stopień',
  bench: 'Ławka',
  'foam roller': 'Roller',
  towel: 'Ręcznik',
  marbles: 'Kulki/drobne przedmioty',
  'stress ball': 'Piłka antystresowa',
  'grip strengthener': 'Ściskacz',
  hammer: 'Młotek/hantelka',
};

export default function GeneratePlanPage() {
  const router = useRouter();
  const { exercises, patients, addPlan } = useApp();

  const [bodyPart, setBodyPart] = useState<BodyPart | ''>('');
  const [pathologyId, setPathologyId] = useState('');
  const [phase, setPhase] = useState<Phase>(2);
  const [painLevel, setPainLevel] = useState(3);
  const [equipment, setEquipment] = useState<string[]>(['resistance band', 'towel']);
  const [weeksCount, setWeeksCount] = useState(2);
  const [result, setResult] = useState<GeneratorResult | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [ctx, setCtx] = useState<ClinicalContext>(DEFAULT_CONTEXT);

  // Scalone tagi (domyślne + nadpisania z edytora /clinical-tags)
  useEffect(() => {
    fetch('/api/clinical-tags')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setCtx({ tags: d.tags, pathologies: d.pathologies }))
      .catch(() => {}); // offline/fallback: wbudowane domyślne
  }, []);

  const availablePathologies = useMemo(
    () => ctx.pathologies.filter((p) => bodyPart && p.bodyParts.includes(bodyPart)),
    [bodyPart, ctx.pathologies]
  );

  const toggleEquipment = (item: string) => {
    setEquipment((prev) =>
      prev.includes(item) ? prev.filter((e) => e !== item) : [...prev, item]
    );
  };

  const handleGenerate = () => {
    if (!bodyPart || !pathologyId) return;
    setResult(
      generatePlan(
        { bodyPart, pathologyId, phase, painLevel, availableEquipment: equipment },
        exercises,
        ctx
      )
    );
  };

  const handleSaveAsPlan = async () => {
    if (!result || result.selected.length === 0) return;
    setIsSaving(true);
    try {
      const pathologyLabel = ctx.pathologies.find((p) => p.id === pathologyId)?.label ?? pathologyId;
      // Progresja wielotygodniowa, 3 dni treningowe (pon/śr/pt)
      const weekly = progressWeeks(result.selected, weeksCount);
      const weeks = weekly.map((w) => ({
        weekNumber: w.weekNumber,
        focus: w.focus,
        days: Array.from({ length: 7 }, (_, i) => ({
          dayNumber: i + 1,
          exercises: [0, 2, 4].includes(i)
            ? w.exercises.map((e) => ({
                exerciseId: e.exerciseId,
                sets: e.sets,
                reps: e.reps ?? 1,
                holdSeconds: e.holdSeconds,
                notes: e.notes,
              }))
            : [],
        })),
      }));
      const newPlan = await addPlan({
        name: `${pathologyLabel} — ${phaseLabels[phase].name}`,
        description: `Plan wygenerowany automatycznie (${weeksCount} tyg.). Ból: ${painLevel}/10. Do weryfikacji klinicznej.`,
        status: selectedPatientId ? 'active' : 'template',
        patientId: selectedPatientId || undefined,
        weeks,
      });
      router.push(`/plans/${newPlan.id}/edit`);
    } catch {
      setIsSaving(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Generator planu</h1>
          <p className="text-gray-400 mt-1">
            Dobór 5 ćwiczeń na podstawie patologii, fazy rehabilitacji i poziomu bólu. Algorytm
            deterministyczny — wynik zawsze zweryfikuj klinicznie.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-6">
          {/* Region */}
          <div>
            <label className="block text-sm text-white/70 mb-2">1. Region ciała</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(bodyPartLabels) as BodyPart[]).map((bp) => (
                <button
                  key={bp}
                  onClick={() => {
                    setBodyPart(bp);
                    setPathologyId('');
                    setResult(null);
                  }}
                  className={`px-3 py-2 rounded-xl border text-sm transition ${
                    bodyPart === bp
                      ? 'border-neon-cyan text-neon-cyan bg-neon-cyan/10'
                      : 'border-white/10 text-white/70 hover:border-white/30'
                  }`}
                >
                  {bodyPartLabels[bp]}
                </button>
              ))}
            </div>
          </div>

          {/* Patologia */}
          {bodyPart && (
            <div>
              <label className="block text-sm text-white/70 mb-2">2. Patologia</label>
              <div className="space-y-2">
                {availablePathologies.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setPathologyId(p.id);
                      setResult(null);
                    }}
                    className={`w-full text-left px-4 py-2 rounded-xl border text-sm transition ${
                      pathologyId === p.id
                        ? 'border-neon-green text-neon-green bg-neon-green/10'
                        : 'border-white/10 text-white/70 hover:border-white/30'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Faza */}
          <div>
            <label className="block text-sm text-white/70 mb-2">3. Faza rehabilitacji</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {([1, 2, 3] as Phase[]).map((ph) => (
                <button
                  key={ph}
                  onClick={() => {
                    setPhase(ph);
                    setResult(null);
                  }}
                  className={`px-3 py-3 rounded-xl border text-left transition ${
                    phase === ph
                      ? 'border-neon-purple text-neon-purple bg-neon-purple/10'
                      : 'border-white/10 text-white/70 hover:border-white/30'
                  }`}
                >
                  <div className="font-semibold text-sm">{phaseLabels[ph].name}</div>
                  <div className="text-xs opacity-70">{phaseLabels[ph].desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Ból */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm text-white/70">4. Aktualny poziom bólu (NRS)</label>
              <span className="text-neon-pink font-bold">{painLevel}/10</span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              value={painLevel}
              onChange={(e) => {
                setPainLevel(Number(e.target.value));
                setResult(null);
              }}
              className="w-full"
            />
          </div>

          {/* Sprzęt */}
          <div>
            <label className="block text-sm text-white/70 mb-2">5. Dostępny sprzęt</label>
            <div className="flex flex-wrap gap-2">
              {EQUIPMENT_OPTIONS.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    toggleEquipment(item);
                    setResult(null);
                  }}
                  className={`px-3 py-1.5 rounded-full border text-xs transition ${
                    equipment.includes(item)
                      ? 'border-neon-cyan text-neon-cyan bg-neon-cyan/10'
                      : 'border-white/10 text-white/50 hover:border-white/30'
                  }`}
                >
                  {equipmentLabels[item]}
                </button>
              ))}
            </div>
          </div>

          {/* Liczba tygodni */}
          <div>
            <label className="block text-sm text-white/70 mb-2">
              6. Długość planu (progresja tygodniowa)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((w) => (
                <button
                  key={w}
                  onClick={() => setWeeksCount(w)}
                  className={`px-3 py-2 rounded-xl border text-sm transition ${
                    weeksCount === w
                      ? 'border-neon-green text-neon-green bg-neon-green/10'
                      : 'border-white/10 text-white/70 hover:border-white/30'
                  }`}
                >
                  {w} {w === 1 ? 'tydzień' : 'tyg.'}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!bodyPart || !pathologyId}
            className="w-full py-3 rounded-xl font-semibold bg-neon-cyan/20 border border-neon-cyan text-neon-cyan hover:bg-neon-cyan/30 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ⚙️ Dobierz ćwiczenia
          </button>
        </div>

        {/* Wynik */}
        {result && (
          <div className="space-y-4">
            {result.warnings.map((w, i) => (
              <div
                key={i}
                className="bg-yellow-500/10 border border-yellow-500/40 rounded-xl p-4 text-yellow-300 text-sm"
              >
                ⚠️ {w}
              </div>
            ))}

            {result.selected.map((g, idx) => (
              <div key={g.exercise.id} className="glass-card rounded-2xl p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">
                      {idx + 1}. {g.exercise.name}
                    </h3>
                    <p className="text-sm text-white/60 mt-1">{g.exercise.description}</p>
                    <p className="text-xs text-white/40 mt-2">Dobór: {g.rationale}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-neon-cyan font-bold">
                      {g.sets} × {g.holdSeconds ? `${g.holdSeconds}s` : `${g.reps} powt.`}
                    </div>
                    {g.tempo && (
                      <div className="text-neon-purple text-sm mt-1">Tempo {g.tempo}</div>
                    )}
                    <a
                      href={g.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-xs text-neon-pink hover:underline"
                    >
                      ▶ YouTube
                    </a>
                  </div>
                </div>
              </div>
            ))}

            {result.selected.length > 0 && (
              <div className="glass-card rounded-2xl p-6 space-y-4">
                <label className="block text-sm text-white/70">
                  Przypisz pacjentowi (opcjonalnie)
                </label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="form-input w-full"
                >
                  <option value="">— zapisz jako szablon —</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleSaveAsPlan}
                  disabled={isSaving}
                  className="w-full py-3 rounded-xl font-semibold bg-neon-green/20 border border-neon-green text-neon-green hover:bg-neon-green/30 transition disabled:opacity-50"
                >
                  {isSaving ? 'Zapisywanie…' : '💾 Zapisz jako plan i edytuj'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
