# Rehab Planner Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Zbudować pełną aplikację do zarządzania planami rehabilitacji dla fizjoterapeutów.

**Architecture:** Next.js App Router z client-side routing, localStorage jako baza danych, React Context do state management. Sidebar layout z dynamic content area.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, localStorage

---

## Faza 1: Foundation

### Task 1: Project Structure & Types

**Files:**
- Create: `src/types/index.ts`
- Create: `src/types/exercise.ts`
- Create: `src/types/patient.ts`
- Create: `src/types/plan.ts`

**Step 1: Create type definitions**

Create `src/types/exercise.ts`:
```typescript
export type ExerciseCategory = 'strength' | 'stretching' | 'mobility' | 'balance';
export type BodyPart = 'knee' | 'shoulder' | 'spine' | 'hip' | 'ankle' | 'wrist' | 'elbow' | 'neck';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: ExerciseCategory;
  bodyPart: BodyPart;
  difficulty: 1 | 2 | 3;
  duration?: number;
  reps?: number;
  sets?: number;
  equipment: string[];
  imageUrl?: string;
  tags: string[];
}
```

Create `src/types/patient.ts`:
```typescript
export interface Diagnosis {
  id: string;
  name: string;
  date: string;
  notes?: string;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  phone?: string;
  email?: string;
  diagnoses: Diagnosis[];
  activePlanId?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}
```

Create `src/types/plan.ts`:
```typescript
export interface PlanExercise {
  exerciseId: string;
  sets: number;
  reps: number;
  holdSeconds?: number;
  notes?: string;
}

export interface PlanDay {
  dayNumber: number;
  exercises: PlanExercise[];
  notes?: string;
}

export interface PlanWeek {
  weekNumber: number;
  days: PlanDay[];
  focus?: string;
}

export interface RehabilitationPlan {
  id: string;
  name: string;
  description?: string;
  patientId?: string;
  weeks: PlanWeek[];
  createdAt: string;
  status: 'template' | 'active' | 'completed';
}
```

Create `src/types/index.ts`:
```typescript
export * from './exercise';
export * from './patient';
export * from './plan';
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/types/
git commit -m "feat: add TypeScript type definitions"
```

---

### Task 2: Storage Service

**Files:**
- Create: `src/lib/storage.ts`

**Step 1: Create localStorage service**

```typescript
import { Exercise, Patient, RehabilitationPlan } from '@/types';

const STORAGE_KEYS = {
  PATIENTS: 'rehab-planner-patients',
  EXERCISES: 'rehab-planner-exercises',
  PLANS: 'rehab-planner-plans',
} as const;

function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  const item = localStorage.getItem(key);
  if (!item) return defaultValue;
  try {
    return JSON.parse(item) as T;
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  // Patients
  getPatients: (): Patient[] => getItem(STORAGE_KEYS.PATIENTS, []),
  setPatients: (patients: Patient[]) => setItem(STORAGE_KEYS.PATIENTS, patients),
  
  // Exercises
  getExercises: (): Exercise[] => getItem(STORAGE_KEYS.EXERCISES, []),
  setExercises: (exercises: Exercise[]) => setItem(STORAGE_KEYS.EXERCISES, exercises),
  
  // Plans
  getPlans: (): RehabilitationPlan[] => getItem(STORAGE_KEYS.PLANS, []),
  setPlans: (plans: RehabilitationPlan[]) => setItem(STORAGE_KEYS.PLANS, plans),
};
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/lib/storage.ts
git commit -m "feat: add localStorage service"
```

---

### Task 3: App Context Provider

**Files:**
- Create: `src/context/AppContext.tsx`
- Modify: `src/app/layout.tsx`

**Step 1: Create AppContext**

```typescript
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Exercise, Patient, RehabilitationPlan } from '@/types';
import { storage } from '@/lib/storage';

interface AppContextType {
  patients: Patient[];
  setPatients: (patients: Patient[]) => void;
  exercises: Exercise[];
  setExercises: (exercises: Exercise[]) => void;
  plans: RehabilitationPlan[];
  setPlans: (plans: RehabilitationPlan[]) => void;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [plans, setPlans] = useState<RehabilitationPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setPatients(storage.getPatients());
    setExercises(storage.getExercises());
    setPlans(storage.getPlans());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      storage.setPatients(patients);
    }
  }, [patients, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      storage.setExercises(exercises);
    }
  }, [exercises, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      storage.setPlans(plans);
    }
  }, [plans, isLoading]);

  return (
    <AppContext.Provider value={{ patients, setPatients, exercises, setExercises, plans, setPlans, isLoading }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
```

**Step 2: Update layout.tsx**

Wrap children with AppProvider in `src/app/layout.tsx`.

**Step 3: Verify app loads**

Run: `npm run dev`
Open: http://localhost:3000
Expected: Page loads without errors

**Step 4: Commit**

```bash
git add src/context/AppContext.tsx src/app/layout.tsx
git commit -m "feat: add AppContext for state management"
```

---

### Task 4: Seed Data - Exercises

**Files:**
- Create: `src/data/exercises.ts`
- Create: `src/lib/seed.ts`

**Step 1: Create exercise data**

Create `src/data/exercises.ts` with 30 exercises covering:
- Knee (6): Wall sits, leg raises, hamstring curls, step-ups, squats, lunges
- Shoulder (6): Pendulum, external rotation, internal rotation, wall climb, shoulder blade squeeze, arm circles
- Spine (6): Cat-cow, bird-dog, bridge, pelvic tilt, knee-to-chest, trunk rotation
- Hip (6): Clamshells, hip abduction, hip flexor stretch, glute bridge, side-lying leg lift, piriformis stretch
- Ankle (6): Alphabet, calf raises, single-leg balance, resistance band dorsiflexion, toe raises, ankle circles

**Step 2: Create seed utility**

```typescript
import { storage } from '@/lib/storage';
import { defaultExercises } from '@/data/exercises';

export function seedDatabase() {
  const existing = storage.getExercises();
  if (existing.length === 0) {
    storage.setExercises(defaultExercises);
    return true;
  }
  return false;
}
```

**Step 3: Commit**

```bash
git add src/data/exercises.ts src/lib/seed.ts
git commit -m "feat: add seed data for exercises"
```

---

### Task 5: Layout with Sidebar

**Files:**
- Create: `src/components/layout/Sidebar.tsx`
- Create: `src/components/layout/Layout.tsx`
- Modify: `src/app/page.tsx`

**Step 1: Create Sidebar component**

```typescript
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Dashboard', icon: '📋' },
  { href: '/patients', label: 'Pacjenci', icon: '👥' },
  { href: '/plans', label: 'Plany', icon: '📑' },
  { href: '/exercises', label: 'Ćwiczenia', icon: '🏋️' },
  { href: '/stats', label: 'Statystyki', icon: '📊' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-800 text-white min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold">Rehab Planner</h1>
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              pathname === item.href ? 'bg-slate-700' : 'hover:bg-slate-700/50'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
```

**Step 2: Create Layout wrapper**

```typescript
'use client';

import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
```

**Step 3: Update page.tsx**

Wrap content with Layout component.

**Step 4: Verify sidebar renders**

Run: `npm run dev`
Expected: Sidebar visible on left, content on right

**Step 5: Commit**

```bash
git add src/components/layout/
git commit -m "feat: add sidebar layout"
```

---

## Faza 2: Exercises Feature

### Task 6: Exercise List Page

**Files:**
- Create: `src/app/exercises/page.tsx`
- Create: `src/components/exercises/ExerciseCard.tsx`
- Create: `src/components/exercises/ExerciseList.tsx`

**Step 1: Create ExerciseCard**

Display exercise name, category, body part, difficulty badge.

**Step 2: Create ExerciseList**

Grid of ExerciseCards with filtering by category and body part.

**Step 3: Create exercises page**

Use useApp hook to get exercises, display ExerciseList.

**Step 4: Test navigation**

Click "Ćwiczenia" in sidebar, verify page loads.

**Step 5: Commit**

```bash
git add src/app/exercises/ src/components/exercises/
git commit -m "feat: add exercises list page with filtering"
```

---

### Task 7: Exercise Filtering

**Files:**
- Modify: `src/app/exercises/page.tsx`

**Step 1: Add filter dropdowns**

Add select inputs for category and bodyPart filters.

**Step 2: Implement filtering logic**

Filter exercises array based on selected filters.

**Step 3: Test filtering**

Select different filters, verify list updates.

**Step 4: Commit**

```bash
git add src/app/exercises/page.tsx
git commit -m "feat: add exercise filtering by category and body part"
```

---

## Faza 3: Patients Feature

### Task 8: Patient List Page

**Files:**
- Create: `src/app/patients/page.tsx`
- Create: `src/components/patients/PatientCard.tsx`
- Create: `src/components/patients/PatientList.tsx`

**Step 1: Create PatientCard**

Display patient name, active diagnosis, active plan indicator.

**Step 2: Create PatientList**

List of PatientCards with search by name.

**Step 3: Create patients page**

Use useApp to get patients, display PatientList.

**Step 4: Commit**

```bash
git add src/app/patients/ src/components/patients/
git commit -m "feat: add patients list page"
```

---

### Task 9: Add/Edit Patient Form

**Files:**
- Create: `src/app/patients/new/page.tsx`
- Create: `src/app/patients/[id]/edit/page.tsx`
- Create: `src/components/patients/PatientForm.tsx`

**Step 1: Create PatientForm component**

Form with firstName, lastName, birthDate, phone, email, notes fields.

**Step 2: Create new patient page**

PatientForm that adds new patient to state.

**Step 3: Create edit patient page**

PatientForm pre-filled with existing patient data.

**Step 4: Test CRUD**

Create patient → Edit → Verify changes in list.

**Step 5: Commit**

```bash
git add src/app/patients/new/ src/app/patients/[id]/ src/components/patients/PatientForm.tsx
git commit -m "feat: add patient create and edit functionality"
```

---

### Task 10: Patient Detail Page

**Files:**
- Create: `src/app/patients/[id]/page.tsx`

**Step 1: Create patient detail page**

Show patient info, diagnoses, assigned plans, notes.

**Step 2: Add diagnosis management**

Add/remove diagnoses from patient.

**Step 3: Test navigation**

Click patient from list → verify detail page shows.

**Step 4: Commit**

```bash
git add src/app/patients/[id]/page.tsx
git commit -m "feat: add patient detail page with diagnoses"
```

---

## Faza 4: Plans Feature

### Task 11: Plan List Page

**Files:**
- Create: `src/app/plans/page.tsx`
- Create: `src/components/plans/PlanCard.tsx`
- Create: `src/components/plans/PlanList.tsx`

**Step 1: Create PlanCard**

Display plan name, status badge, patient name (if assigned), week count.

**Step 2: Create PlanList**

Filter by status (template/active/completed).

**Step 3: Create plans page**

Show tabs for Templates, Active, Completed.

**Step 4: Commit**

```bash
git add src/app/plans/ src/components/plans/
git commit -m "feat: add plans list page with status tabs"
```

---

### Task 12: Plan Builder - Basic Structure

**Files:**
- Create: `src/app/plans/new/page.tsx`
- Create: `src/app/plans/[id]/edit/page.tsx`
- Create: `src/components/plans/PlanBuilder.tsx`

**Step 1: Create PlanBuilder component**

- Plan name input
- Description textarea
- Week tabs (Week 1, Week 2, etc.)
- Day columns (Mon-Sun)

**Step 2: Create new plan page**

PlanBuilder starting empty.

**Step 3: Create edit plan page**

PlanBuilder with existing plan data.

**Step 4: Commit**

```bash
git add src/app/plans/new/ src/app/plans/[id]/edit/ src/components/plans/PlanBuilder.tsx
git commit -m "feat: add plan builder basic structure"
```

---

### Task 13: Plan Builder - Exercise Selection

**Files:**
- Modify: `src/components/plans/PlanBuilder.tsx`

**Step 1: Add exercise panel**

Side panel showing exercises with filters.

**Step 2: Add drag-drop or click-to-add**

Add exercise to selected day with default sets/reps.

**Step 3: Add exercise inline editing**

Edit sets, reps, holdSeconds for added exercise.

**Step 4: Test adding exercises**

Add exercises to different days, verify data structure.

**Step 5: Commit**

```bash
git add src/components/plans/PlanBuilder.tsx
git commit -m "feat: add exercise selection to plan builder"
```

---

### Task 14: Plan Preview & Save

**Files:**
- Modify: `src/components/plans/PlanBuilder.tsx`

**Step 1: Add preview mode**

Toggle between edit and preview (calendar view).

**Step 2: Add save functionality**

Save plan to state, navigate to plan list.

**Step 3: Add template toggle**

Option to save as template vs assign to patient.

**Step 4: Test save flow**

Create plan → Save → Verify in list.

**Step 5: Commit**

```bash
git add src/components/plans/PlanBuilder.tsx
git commit -m "feat: add plan preview and save functionality"
```

---

### Task 15: Assign Plan to Patient

**Files:**
- Modify: `src/app/patients/[id]/page.tsx`

**Step 1: Add "Assign Plan" button**

Opens modal to select from templates.

**Step 2: Implement assignment logic**

Clone template, set patientId, add to plans.

**Step 3: Update patient activePlanId**

Set active plan reference.

**Step 4: Test assignment**

Assign template → Verify in patient detail.

**Step 5: Commit**

```bash
git add src/app/patients/[id]/page.tsx
git commit -m "feat: add plan assignment to patient"
```

---

## Faza 5: Dashboard & Stats

### Task 16: Dashboard Page

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/components/dashboard/StatCard.tsx`
- Create: `src/components/dashboard/RecentList.tsx`

**Step 1: Create StatCard component**

Display count with icon and label.

**Step 2: Create RecentList component**

Show last 5 edited patients/plans.

**Step 3: Update dashboard page**

Show 4 stat cards + recent activity lists.

**Step 4: Commit**

```bash
git add src/app/page.tsx src/components/dashboard/
git commit -m "feat: add dashboard with stats and recent activity"
```

---

### Task 17: Statistics Page

**Files:**
- Create: `src/app/stats/page.tsx`

**Step 1: Add patient by diagnosis chart**

Bar chart showing patient count per diagnosis.

**Step 2: Add most used exercises**

Top 10 exercises used across all plans.

**Step 3: Add plan status distribution**

Pie chart of template/active/completed counts.

**Step 4: Commit**

```bash
git add src/app/stats/page.tsx
git commit -m "feat: add statistics page with charts"
```

---

## Faza 6: Polish

### Task 18: Mobile Responsiveness

**Files:**
- Modify: `src/components/layout/Sidebar.tsx`
- Modify: `src/components/layout/Layout.tsx`

**Step 1: Add mobile hamburger menu**

Toggle sidebar visibility on mobile.

**Step 2: Make sidebar overlay on mobile**

Full-height overlay with close button.

**Step 3: Test mobile views**

Test all pages on mobile viewport.

**Step 4: Commit**

```bash
git add src/components/layout/
git commit -m "feat: add mobile responsive sidebar"
```

---

### Task 19: UI Polish & Empty States

**Files:**
- Create: `src/components/ui/EmptyState.tsx`
- Modify all list pages

**Step 1: Create EmptyState component**

Illustration + message + CTA button.

**Step 2: Add to all list pages**

Show when list is empty.

**Step 3: Add loading states**

Show skeleton/spinner while loading.

**Step 4: Commit**

```bash
git add src/components/ui/ src/app/
git commit -m "feat: add empty states and loading indicators"
```

---

### Task 20: Final Testing & Documentation

**Step 1: Run full build**

Run: `npm run build`
Expected: Build succeeds

**Step 2: Test all flows**

- Create patient → assign plan → view in dashboard
- Create template → use for multiple patients
- Filter exercises → add to plan

**Step 3: Update README**

Document features and usage.

**Step 4: Final commit**

```bash
git add .
git commit -m "docs: update README with features"
```
