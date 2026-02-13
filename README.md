# Rehab Planner

Aplikacja webowa dla fizjoterapeutów do tworzenia i zarządzania planami rehabilitacji pacjentów.

## Funkcjonalności

- **Dashboard** - przegląd statystyk, ostatni pacjenci i plany
- **Pacjenci** - zarządzanie pacjentami, dodawanie diagnoz
- **Plany rehabilitacji** - kreator planów z bazą ćwiczeń
- **Baza ćwiczeń** - 30 predefiniowanych ćwiczeń z filtrami
- **Statystyki** - wizualizacja danych pacjentów i planów

## Technologie

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- localStorage (bez backendu)

## Uruchomienie

```bash
npm install
npm run dev
```

Otwórz [http://localhost:3000](http://localhost:3000) w przeglądarce.

## Struktura projektu

```
src/
├── app/                    # Next.js App Router pages
│   ├── patients/           # Zarządzanie pacjentami
│   ├── plans/              # Plany rehabilitacji
│   ├── exercises/          # Baza ćwiczeń
│   └── stats/              # Statystyki
├── components/             # React components
│   ├── exercises/          # Komponenty ćwiczeń
│   ├── layout/             # Layout i sidebar
│   ├── patients/           # Komponenty pacjentów
│   └── plans/              # Komponenty planów
├── context/                # React Context
├── data/                   # Seed data
├── lib/                    # Utilities
└── types/                  # TypeScript types
```

## Użycie

1. **Dodaj pacjenta** - Kliknij "Pacjenci" → "Dodaj pacjenta"
2. **Utwórz plan** - Kliknij "Plany" → "Utwórz plan"
3. **Dodaj ćwiczenia** - Wybierz z bazy i przypisz do dni tygodnia
4. **Przypisz pacjentowi** - Zapisz jako aktywny plan i wybierz pacjenta

## License

MIT
