# Rehab Planner - Design Document

**Data:** 2026-02-12
**Status:** Approved

## Overview

Aplikacja webowa dla fizjoterapeutów do tworzenia i zarządzania planami rehabilitacji pacjentów.

## Architektura UI

```
┌─────────────────────────────────────────────────────────────┐
│                        SIDEBAR                               │
│  ┌─────────────┐                                            │
│  │ 📋 Dashboard │    MAIN CONTENT AREA                       │
│  │ 👥 Pacjenci  │                                            │
│  │ 📑 Plany     │    ┌────────────────────────────────────┐  │
│  │ 🏋️ Ćwiczenia │    │                                    │  │
│  │ 📊 Statystyki│    │    Dynamic content based on        │  │
│  │ ⚙️ Ustawienia│    │    selected section                │  │
│  └─────────────┘    │                                    │  │
│                     └────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Główne widoki

1. **Dashboard** - przegląd: ostatni pacjenci, aktualne plany, szybkie akcje
2. **Pacjenci** - lista, dodawanie, edycja, podgląd planów pacjenta
3. **Plany** - biblioteka szablonów planów + plany przypisane do pacjentów
4. **Ćwiczenia** - baza ćwiczeń z filtrami (kategoria, ciało, trudność)
5. **Statystyki** - ile planów, pacjentów, najczęstsze schorzenia

### Layout
- Responsywny - na mobile sidebar jako hamburger menu
- Na desktop stały sidebar

## Baza Ćwiczeń

### Struktura danych

```typescript
interface Exercise {
  id: string;
  name: string;                    // "Przysiady przy ścianie"
  description: string;             // Instrukcja wykonania
  category: ExerciseCategory;      // Siłowe | Rozciąganie | Mobilność | Równowaga
  bodyPart: BodyPart;              // Kolano | Bark | Kręgosłup | Biodro | etc.
  difficulty: 1 | 2 | 3;           // Łatwy | Średni | Trudny
  duration?: number;               // Czas w sekundach (dla statycznych)
  reps?: number;                   // Powtórzenia
  sets?: number;                   // Serie
  equipment: string[];             // ["piłka", "taśma", "bez sprzętu"]
  imageUrl?: string;               // Obrazek/diagram
  tags: string[];                  // ["rehab kolana", "po ACL", "urazy sportowe"]
}

type ExerciseCategory = 'strength' | 'stretching' | 'mobility' | 'balance';
type BodyPart = 'knee' | 'shoulder' | 'spine' | 'hip' | 'ankle' | 'wrist' | 'elbow' | 'neck';
```

### Kategorie bazy (startowe ~30-50 ćwiczeń)

- **Kolano:** ćwiczenia po kontuzjach, ACL, menisk
- **Bark:** rotatory, impingement, rehabilitacja po operacjach
- **Kręgosłup:** lędźwie, szyja, postawa
- **Biodro:** mobilność, stabilizacja
- **Kostka:** propriocepcja, stabilizacja

## Zarządzanie Pacjentami

### Struktura danych

```typescript
interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  phone?: string;
  email?: string;
  diagnoses: Diagnosis[];          // Historia diagnoz
  activePlanId?: string;           // Aktualny plan
  notes: string;                   // Notatki terapeuty
  createdAt: string;
  updatedAt: string;
}

interface Diagnosis {
  id: string;
  name: string;                    // "Uszkodzenie ACL", "Zespół cieśni nadgarstka"
  date: string;                    // Data diagnozy
  notes?: string;
}
```

### Widok pacjenta

- Karta pacjenta z danymi podstawowymi
- Historia diagnoz (timeline)
- Lista przypisanych planów (aktywny + archiwum)
- Notatki terapeuty (z datami)

### Funkcje

- Dodawanie/edycja pacjenta
- Przypisywanie planu (z szablonu lub nowy)
- Archiwizacja planu (gdy zakończony)
- Szybkie wyszukiwanie po nazwisku

## Kreator Planów

### Struktura danych

```typescript
interface RehabilitationPlan {
  id: string;
  name: string;                    // "Rehabilitacja kolana - tydzień 1-4"
  description?: string;
  patientId?: string;              // null = szablon
  weeks: PlanWeek[];
  createdAt: string;
  status: 'template' | 'active' | 'completed';
}

interface PlanWeek {
  weekNumber: number;
  days: PlanDay[];
  focus?: string;                  // "Mobilność", "Wzmacnianie"
}

interface PlanDay {
  dayNumber: number;
  exercises: PlanExercise[];
  notes?: string;
}

interface PlanExercise {
  exerciseId: string;
  sets: number;
  reps: number;
  holdSeconds?: number;
  notes?: string;                  // "Zwiększyć gdy bez bólu"
}
```

### UX Kreatora

1. **Wybór szablonu lub od zera** - szybki start lub pełna customizacja
2. **Drag & drop** - przeciąganie ćwiczeń z bazy do dni tygodnia
3. **Filtrowanie ćwiczeń** - po kategorii, części ciała, trudności
4. **Podgląd** - widok kalendarzowy (siatka tygodniowa)
5. **Duplikowanie** - kopiowanie dni/tygodni
6. **Zapisz jako szablon** - do ponownego użycia

## Statystyki & Dashboard

### Dashboard - karty

| Karta | Wartość |
|-------|---------|
| Pacjenci | Liczba aktywnych |
| Aktywne plany | Liczba |
| Ćwiczenia w bazie | Liczba |
| Szablony | Liczba |

### Ostatnia aktywność

- Lista 5 ostatnio edytowanych pacjentów
- Lista 5 ostatnio edytowanych planów

### Statystyki szczegółowe

- Wykres: Pacjenci wg diagnozy (bar chart)
- Wykres: Najczęściej używane ćwiczenia
- Rozkład planów wg statusu (active/completed/template)

## Stack Techniczny

| Warstwa | Technologia |
|---------|-------------|
| Frontend | Next.js 16 + React 19 + TypeScript |
| Styling | Tailwind CSS 4 |
| State Management | React Context + useReducer |
| Storage | localStorage + JSON |
| UI Components | Custom components |

## Data Storage

Dane przechowywane w localStorage:

```typescript
// Klucze localStorage
const STORAGE_KEYS = {
  PATIENTS: 'rehab-planner-patients',
  EXERCISES: 'rehab-planner-exercises',
  PLANS: 'rehab-planner-plans',
  SETTINGS: 'rehab-planner-settings',
};
```

## Roadmapa implementacji

### Faza 1: Foundation
- [ ] Setup projektu i struktura folderów
- [ ] Layout z sidebar
- [ ] Routing między widokami

### Faza 2: Data Layer
- [ ] Modele TypeScript
- [ ] localStorage service
- [ ] Seed danych (ćwiczenia)

### Faza 3: Core Features
- [ ] Baza ćwiczeń (lista, filtry)
- [ ] Lista pacjentów + CRUD
- [ ] Kreator planów

### Faza 4: Polish
- [ ] Dashboard
- [ ] Statystyki
- [ ] UX improvements
