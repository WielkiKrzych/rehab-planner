'use client';

import { useEffect, useMemo, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { BodyPart, Exercise } from '@/types';
import { ClinicalTag, Pathology, Phase } from '@/data/clinicalTags';
import { useApp } from '@/context/AppContext';

const bodyPartLabels: Record<BodyPart, string> = {
  knee: 'Kolano',
  shoulder: 'Bark',
  spine: 'Kręgosłup',
  hip: 'Biodro',
  ankle: 'Skokowy / stopa',
  wrist: 'Nadgarstek',
  elbow: 'Łokieć',
  neck: 'Szyja',
};

interface MergedData {
  tags: Record<string, ClinicalTag>;
  pathologies: Pathology[];
  overriddenIds: string[];
  customPathologyIds: string[];
}

const EMPTY_TAG: ClinicalTag = { pathologies: [], phases: [2] };

export default function ClinicalTagsPage() {
  const { exercises } = useApp();
  const [data, setData] = useState<MergedData | null>(null);
  const [regionFilter, setRegionFilter] = useState<BodyPart | ''>('');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ClinicalTag | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [showNewPathology, setShowNewPathology] = useState(false);
  const [npId, setNpId] = useState('');
  const [npLabel, setNpLabel] = useState('');
  const [npBodyParts, setNpBodyParts] = useState<BodyPart[]>([]);

  const refresh = () =>
    fetch('/api/clinical-tags')
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(setData)
      .catch(() => setMessage({ type: 'err', text: 'Nie udało się pobrać tagów.' }));

  useEffect(() => {
    refresh();
  }, []);

  const filtered = useMemo(() => {
    return exercises.filter((ex) => {
      if (regionFilter && ex.bodyPart !== regionFilter) return false;
      if (search.trim() && !ex.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [exercises, regionFilter, search]);

  const selected: Exercise | undefined = exercises.find((e) => e.id === selectedId);
  const isOverridden = !!selectedId && !!data?.overriddenIds.includes(selectedId);

  const openEditor = (ex: Exercise) => {
    setSelectedId(ex.id);
    setMessage(null);
    const tag = data?.tags[ex.id];
    setDraft(tag ? JSON.parse(JSON.stringify(tag)) : { ...EMPTY_TAG });
  };

  const toggleInArray = <T,>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];

  const save = async () => {
    if (!selectedId || !draft) return;
    if (draft.pathologies.length === 0) {
      setMessage({ type: 'err', text: 'Zaznacz przynajmniej jedną patologię.' });
      return;
    }
    if (draft.phases.length === 0) {
      setMessage({ type: 'err', text: 'Zaznacz przynajmniej jedną fazę.' });
      return;
    }
    setSaving(true);
    setMessage(null);
    const cleaned: ClinicalTag = {
      pathologies: draft.pathologies,
      phases: [...draft.phases].sort() as Phase[],
      ...(draft.maxPain !== undefined ? { maxPain: draft.maxPain } : {}),
      ...(draft.tempo ? { tempo: draft.tempo } : {}),
      ...(draft.contraindicatedIn?.length ? { contraindicatedIn: draft.contraindicatedIn } : {}),
      ...(draft.dosage?.sets ? { dosage: draft.dosage } : {}),
    };
    const res = await fetch('/api/clinical-tags', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exerciseId: selectedId, tag: cleaned }),
    });
    setSaving(false);
    if (res.ok) {
      setData(await res.json());
      setMessage({ type: 'ok', text: 'Zapisano nadpisanie.' });
    } else {
      const err = await res.json().catch(() => ({}));
      setMessage({ type: 'err', text: err.error ?? 'Błąd zapisu.' });
    }
  };

  const restoreDefault = async () => {
    if (!selectedId) return;
    setSaving(true);
    const res = await fetch('/api/clinical-tags', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exerciseId: selectedId }),
    });
    setSaving(false);
    if (res.ok) {
      const merged: MergedData = await res.json();
      setData(merged);
      const tag = merged.tags[selectedId];
      setDraft(tag ? JSON.parse(JSON.stringify(tag)) : { ...EMPTY_TAG });
      setMessage({ type: 'ok', text: 'Przywrócono wartości domyślne.' });
    }
  };

  const addPathology = async () => {
    setMessage(null);
    const res = await fetch('/api/clinical-tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: npId.trim(), label: npLabel.trim(), bodyParts: npBodyParts }),
    });
    if (res.ok) {
      setData(await res.json());
      setShowNewPathology(false);
      setNpId('');
      setNpLabel('');
      setNpBodyParts([]);
      setMessage({ type: 'ok', text: 'Dodano patologię do katalogu.' });
    } else {
      const err = await res.json().catch(() => ({}));
      setMessage({
        type: 'err',
        text:
          err.error ??
          'Błąd walidacji — id: małe litery/cyfry/myślniki, nazwa min. 3 znaki, min. 1 region.',
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Tagi kliniczne</h1>
            <p className="text-gray-400 mt-1">
              Edytuj mapowanie ćwiczeń na patologie, fazy i dawkowanie. Zmiany od razu wpływają na
              generator planów.
            </p>
          </div>
          <button
            onClick={() => setShowNewPathology(!showNewPathology)}
            className="px-4 py-2 rounded-xl border border-neon-purple/40 text-neon-purple hover:bg-neon-purple/10 transition text-sm"
          >
            + Nowa patologia
          </button>
        </div>

        {showNewPathology && data && (
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white">Dodaj patologię do katalogu</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/70 mb-1">
                  Identyfikator (np. <code>de-quervain</code>)
                </label>
                <input
                  value={npId}
                  onChange={(e) => setNpId(e.target.value.toLowerCase())}
                  className="form-input w-full"
                  placeholder="male-litery-i-myslniki"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Nazwa wyświetlana</label>
                <input
                  value={npLabel}
                  onChange={(e) => setNpLabel(e.target.value)}
                  className="form-input w-full"
                  placeholder="Zespół de Quervaina"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Regiony</label>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(bodyPartLabels) as BodyPart[]).map((bp) => (
                  <button
                    key={bp}
                    onClick={() => setNpBodyParts(toggleInArray(npBodyParts, bp))}
                    className={`px-3 py-1.5 rounded-full border text-xs transition ${
                      npBodyParts.includes(bp)
                        ? 'border-neon-purple text-neon-purple bg-neon-purple/10'
                        : 'border-white/10 text-white/50 hover:border-white/30'
                    }`}
                  >
                    {bodyPartLabels[bp]}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={addPathology}
              disabled={!npId || !npLabel || npBodyParts.length === 0}
              className="px-5 py-2 rounded-xl font-semibold bg-neon-purple/20 border border-neon-purple text-neon-purple hover:bg-neon-purple/30 transition disabled:opacity-30"
            >
              Dodaj
            </button>
          </div>
        )}

        {message && (
          <div
            className={`rounded-xl px-4 py-3 text-sm border ${
              message.type === 'ok'
                ? 'border-neon-green/40 bg-neon-green/10 text-neon-green'
                : 'border-red-500/40 bg-red-500/10 text-red-300'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid lg:grid-cols-[380px_1fr] gap-6">
          {/* Lista ćwiczeń */}
          <div className="glass-card rounded-2xl p-4 space-y-3 self-start">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Szukaj ćwiczenia…"
              className="form-input w-full"
            />
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setRegionFilter('')}
                className={`px-2.5 py-1 rounded-full border text-xs ${
                  regionFilter === ''
                    ? 'border-neon-cyan text-neon-cyan'
                    : 'border-white/10 text-white/50'
                }`}
              >
                Wszystkie
              </button>
              {(Object.keys(bodyPartLabels) as BodyPart[]).map((bp) => (
                <button
                  key={bp}
                  onClick={() => setRegionFilter(bp)}
                  className={`px-2.5 py-1 rounded-full border text-xs ${
                    regionFilter === bp
                      ? 'border-neon-cyan text-neon-cyan'
                      : 'border-white/10 text-white/50'
                  }`}
                >
                  {bodyPartLabels[bp]}
                </button>
              ))}
            </div>
            <div className="max-h-[60vh] overflow-y-auto space-y-1 pr-1">
              {filtered.map((ex) => {
                const overridden = data?.overriddenIds.includes(ex.id);
                const tagged = !!data?.tags[ex.id];
                return (
                  <button
                    key={ex.id}
                    onClick={() => openEditor(ex)}
                    className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition ${
                      selectedId === ex.id
                        ? 'border-neon-cyan text-neon-cyan bg-neon-cyan/10'
                        : 'border-white/5 text-white/70 hover:border-white/20'
                    }`}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span>{ex.name}</span>
                      <span className="flex gap-1 shrink-0">
                        {overridden && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-neon-pink/20 text-neon-pink">
                            edytowane
                          </span>
                        )}
                        {!tagged && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-300">
                            brak tagu
                          </span>
                        )}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Panel edycji */}
          <div className="glass-card rounded-2xl p-6 self-start">
            {!selected || !draft || !data ? (
              <p className="text-white/30 text-sm py-16 text-center">
                Wybierz ćwiczenie z listy, aby edytować jego tagi kliniczne.
              </p>
            ) : (
              <div className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">{selected.name}</h2>
                    <p className="text-sm text-white/50">
                      {bodyPartLabels[selected.bodyPart]} · trudność {selected.difficulty}/3
                      {isOverridden && (
                        <span className="ml-2 text-neon-pink">— nadpisane lokalnie</span>
                      )}
                    </p>
                  </div>
                  {isOverridden && (
                    <button
                      onClick={restoreDefault}
                      disabled={saving}
                      className="px-3 py-1.5 rounded-lg border border-white/20 text-white/60 text-xs hover:border-white/50 transition shrink-0"
                    >
                      ↺ Przywróć domyślne
                    </button>
                  )}
                </div>

                <section>
                  <h3 className="text-sm text-white/70 mb-2">
                    Patologie <span className="text-white/30">(dla których ćwiczenie jest wskazane)</span>
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {data.pathologies.map((p) => (
                      <button
                        key={p.id}
                        onClick={() =>
                          setDraft({ ...draft, pathologies: toggleInArray(draft.pathologies, p.id) })
                        }
                        className={`px-2.5 py-1 rounded-full border text-xs transition ${
                          draft.pathologies.includes(p.id)
                            ? 'border-neon-green text-neon-green bg-neon-green/10'
                            : 'border-white/10 text-white/50 hover:border-white/30'
                        }`}
                        title={p.label}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-sm text-white/70 mb-2">Fazy rehabilitacji</h3>
                  <div className="flex gap-2">
                    {([1, 2, 3] as Phase[]).map((ph) => (
                      <button
                        key={ph}
                        onClick={() =>
                          setDraft({ ...draft, phases: toggleInArray(draft.phases, ph) })
                        }
                        className={`px-4 py-2 rounded-xl border text-sm transition ${
                          draft.phases.includes(ph)
                            ? 'border-neon-purple text-neon-purple bg-neon-purple/10'
                            : 'border-white/10 text-white/50 hover:border-white/30'
                        }`}
                      >
                        {ph}. {['Ostra', 'Przebudowa', 'Funkcjonalna'][ph - 1]}
                      </button>
                    ))}
                  </div>
                </section>

                <div className="grid sm:grid-cols-2 gap-6">
                  <section>
                    <div className="flex justify-between mb-2">
                      <h3 className="text-sm text-white/70">Maks. ból (NRS)</h3>
                      <span className="text-neon-pink font-bold">{draft.maxPain ?? 5}/10</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={10}
                      value={draft.maxPain ?? 5}
                      onChange={(e) => setDraft({ ...draft, maxPain: Number(e.target.value) })}
                      className="w-full"
                    />
                  </section>
                  <section>
                    <h3 className="text-sm text-white/70 mb-2">
                      Tempo <span className="text-white/30">(E-P-K-P, tylko siłowe)</span>
                    </h3>
                    <input
                      value={draft.tempo ?? ''}
                      onChange={(e) =>
                        setDraft({ ...draft, tempo: e.target.value.trim() || undefined })
                      }
                      placeholder="np. 3-0-1-0"
                      className="form-input w-full"
                    />
                  </section>
                </div>

                <section>
                  <h3 className="text-sm text-white/70 mb-2">
                    Przeciwwskazane przy <span className="text-white/30">(twarde wykluczenie)</span>
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {data.pathologies.map((p) => (
                      <button
                        key={p.id}
                        onClick={() =>
                          setDraft({
                            ...draft,
                            contraindicatedIn: toggleInArray(
                              draft.contraindicatedIn ?? [],
                              p.id
                            ),
                          })
                        }
                        className={`px-2.5 py-1 rounded-full border text-xs transition ${
                          draft.contraindicatedIn?.includes(p.id)
                            ? 'border-red-400 text-red-300 bg-red-500/10'
                            : 'border-white/10 text-white/50 hover:border-white/30'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-sm text-white/70 mb-2">
                    Dawkowanie <span className="text-white/30">(nadpisuje reguły fazowe; zostaw serie=0 aby użyć reguł)</span>
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <label className="text-white/50">
                      Serie{' '}
                      <input
                        type="number"
                        min={0}
                        max={10}
                        value={draft.dosage?.sets ?? 0}
                        onChange={(e) => {
                          const sets = Number(e.target.value);
                          setDraft({
                            ...draft,
                            dosage: sets
                              ? { ...(draft.dosage ?? { sets }), sets }
                              : undefined,
                          });
                        }}
                        className="form-input w-20 ml-1"
                      />
                    </label>
                    <label className="text-white/50">
                      Powtórzenia{' '}
                      <input
                        type="number"
                        min={0}
                        max={50}
                        disabled={!draft.dosage?.sets}
                        value={draft.dosage?.reps ?? 0}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            dosage: draft.dosage
                              ? { ...draft.dosage, reps: Number(e.target.value) || undefined }
                              : undefined,
                          })
                        }
                        className="form-input w-20 ml-1 disabled:opacity-30"
                      />
                    </label>
                    <label className="text-white/50">
                      Hold (s){' '}
                      <input
                        type="number"
                        min={0}
                        max={300}
                        step={5}
                        disabled={!draft.dosage?.sets}
                        value={draft.dosage?.holdSeconds ?? 0}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            dosage: draft.dosage
                              ? {
                                  ...draft.dosage,
                                  holdSeconds: Number(e.target.value) || undefined,
                                }
                              : undefined,
                          })
                        }
                        className="form-input w-24 ml-1 disabled:opacity-30"
                      />
                    </label>
                  </div>
                </section>

                <button
                  onClick={save}
                  disabled={saving}
                  className="w-full py-3 rounded-xl font-semibold bg-neon-cyan/20 border border-neon-cyan text-neon-cyan hover:bg-neon-cyan/30 transition disabled:opacity-50"
                >
                  {saving ? 'Zapisywanie…' : '💾 Zapisz tagi ćwiczenia'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
