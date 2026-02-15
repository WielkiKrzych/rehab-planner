import { RehabilitationPlan } from '@/types';

export const defaultRehabPlans: Omit<RehabilitationPlan, 'id' | 'createdAt'>[] = [
  // ==================== PLAN 1: SKRĘCENIE STAWU SKOKOWEGO ====================
  {
    name: 'Rehabilitacja po skręceniu stawu skokowego',
    description: 'Program rehabilitacji po inwersyjnym skręceniu stawu skokowego. Skupia się na redukcji obrzęku, odzyskaniu zakresu ruchu, wzmocnieniu mięśni stabilizujących i propriocepcji.',
    status: 'template',
    weeks: [
      {
        weekNumber: 1,
        focus: 'Faza ostra - redukcja obrzęku i bólu, wczesna mobilizacja',
        days: [
          {
            dayNumber: 1,
            notes: 'Odpoczynek, chłodzenie, elevacja. Ćwiczenia pasywne.',
            exercises: [
              { exerciseId: 'ankle-alphabet', sets: 2, reps: 1, holdSeconds: 60, notes: 'Delikatnie, bez bólu' },
              { exerciseId: 'ankle-circles', sets: 2, reps: 10, notes: 'Mały zakres' },
            ],
          },
          {
            dayNumber: 2,
            notes: 'Kontynuacja lekkich ćwiczeń mobilizacyjnych',
            exercises: [
              { exerciseId: 'ankle-alphabet', sets: 3, reps: 1, holdSeconds: 60 },
              { exerciseId: 'ankle-circles', sets: 3, reps: 10 },
              { exerciseId: 'towel-scrunch', sets: 2, reps: 10 },
            ],
          },
          {
            dayNumber: 3,
            exercises: [
              { exerciseId: 'ankle-alphabet', sets: 3, reps: 1, holdSeconds: 60 },
              { exerciseId: 'resistance-band-dorsiflexion', sets: 2, reps: 10, notes: 'Bardzo lekki opór' },
              { exerciseId: 'towel-scrunch', sets: 3, reps: 15 },
            ],
          },
        ],
      },
      {
        weekNumber: 2,
        focus: 'Wzmacnianie początkowe, zwiększanie zakresu ruchu',
        days: [
          {
            dayNumber: 1,
            notes: 'Wzmacnianie zginaczy i prostowników',
            exercises: [
              { exerciseId: 'resistance-band-dorsiflexion', sets: 3, reps: 12 },
              { exerciseId: 'calf-raises', sets: 2, reps: 10, notes: 'Obunóż, częściowy zakres' },
              { exerciseId: 'toe-raises', sets: 3, reps: 12 },
              { exerciseId: 'ankle-alphabet', sets: 2, reps: 1, holdSeconds: 60 },
            ],
          },
          {
            dayNumber: 2,
            notes: 'Wzmacnianie odwodzenia i przywodzenia',
            exercises: [
              { exerciseId: 'ankle-eversion', sets: 3, reps: 12 },
              { exerciseId: 'resisted-ankle-inversion', sets: 3, reps: 12 },
              { exerciseId: 'marble-pickup', sets: 2, reps: 15 },
              { exerciseId: 'ankle-circles', sets: 3, reps: 10 },
            ],
          },
          {
            dayNumber: 3,
            notes: 'Propriocepcja początkowa',
            exercises: [
              { exerciseId: 'single-leg-balance', sets: 3, reps: 1, holdSeconds: 15, notes: 'Z podparciem' },
              { exerciseId: 'calf-raises', sets: 3, reps: 12 },
              { exerciseId: 'towel-scrunch', sets: 3, reps: 20 },
            ],
          },
        ],
      },
      {
        weekNumber: 3,
        focus: 'Zaawansowane wzmacnianie i propriocepcja',
        days: [
          {
            dayNumber: 1,
            exercises: [
              { exerciseId: 'eccentric-calf-raises', sets: 3, reps: 8, notes: 'Ekscentryka na chorej nodze' },
              { exerciseId: 'single-leg-balance', sets: 3, reps: 1, holdSeconds: 20, notes: 'Bez podparcia' },
              { exerciseId: 'ankle-eversion', sets: 3, reps: 15 },
              { exerciseId: 'resisted-ankle-inversion', sets: 3, reps: 15 },
            ],
          },
          {
            dayNumber: 2,
            exercises: [
              { exerciseId: 'calf-raises', sets: 4, reps: 15, notes: 'Jednonóż jeśli możliwe' },
              { exerciseId: 'single-leg-balance', sets: 4, reps: 1, holdSeconds: 25, notes: 'Zamknięte oczy' },
              { exerciseId: 'foam-rolling-calves', sets: 1, reps: 1, holdSeconds: 60 },
            ],
          },
          {
            dayNumber: 3,
            notes: 'Funkcjonalne ćwiczenia przygotowujące do powrotu',
            exercises: [
              { exerciseId: 'step-ups', sets: 3, reps: 10 },
              { exerciseId: 'eccentric-calf-raises', sets: 3, reps: 10 },
              { exerciseId: 'single-leg-balance', sets: 3, reps: 1, holdSeconds: 30 },
            ],
          },
        ],
      },
    ],
  },

  // ==================== PLAN 2: ŁOKIEĆ TENISISTY ====================
  {
    name: 'Rehabilitacja łokcia tenisisty (epikondylopatia boczna)',
    description: 'Program rehabilitacji dla epikondylopatii bocznej (łokieć tenisisty). Skupia się na ekscentrycznym wzmacnianiu prostowników nadgarstka, rozciąganiu i progresywnym obciążeniu.',
    status: 'template',
    weeks: [
      {
        weekNumber: 1,
        focus: 'Redukcja bólu, rozciąganie, izometria',
        days: [
          {
            dayNumber: 1,
            notes: 'Unikanie czynności wywołujących ból',
            exercises: [
              { exerciseId: 'wrist-extensor-stretch', sets: 3, reps: 1, holdSeconds: 30 },
              { exerciseId: 'wrist-circles', sets: 2, reps: 15 },
              { exerciseId: 'grip-squeeze', sets: 2, reps: 10, notes: 'Lekki opór' },
            ],
          },
          {
            dayNumber: 2,
            exercises: [
              { exerciseId: 'wrist-extensor-stretch', sets: 4, reps: 1, holdSeconds: 30 },
              { exerciseId: 'wrist-circles', sets: 3, reps: 15 },
              { exerciseId: 'triceps-stretch-overhead', sets: 2, reps: 1, holdSeconds: 30 },
            ],
          },
          {
            dayNumber: 3,
            notes: 'Wprowadzenie izometrii',
            exercises: [
              { exerciseId: 'wrist-extensor-stretch', sets: 3, reps: 1, holdSeconds: 30 },
              { exerciseId: 'reverse-wrist-curls', sets: 2, reps: 10, notes: 'Tylko faza izometryczna, bez ruchu' },
              { exerciseId: 'grip-squeeze', sets: 3, reps: 12 },
            ],
          },
        ],
      },
      {
        weekNumber: 2,
        focus: 'Wprowadzenie treningu ekscentrycznego',
        days: [
          {
            dayNumber: 1,
            notes: 'Kluczowy tydzień - ekscentryka',
            exercises: [
              { exerciseId: 'eccentric-wrist-extension', sets: 3, reps: 10, notes: '3-5 sekund w dół' },
              { exerciseId: 'wrist-extensor-stretch', sets: 3, reps: 1, holdSeconds: 30 },
              { exerciseId: 'forearm-pronation-supination', sets: 2, reps: 10 },
            ],
          },
          {
            dayNumber: 2,
            exercises: [
              { exerciseId: 'eccentric-wrist-extension', sets: 3, reps: 10, notes: 'Zwiększ obciążenie jeśli bez bólu' },
              { exerciseId: 'reverse-wrist-curls', sets: 2, reps: 12, notes: 'Lekki ciężar' },
              { exerciseId: 'wrist-circles', sets: 2, reps: 20 },
            ],
          },
          {
            dayNumber: 3,
            exercises: [
              { exerciseId: 'eccentric-wrist-extension', sets: 3, reps: 12 },
              { exerciseId: 'eccentric-wrist-flexion', sets: 2, reps: 10, notes: 'Równowaga mięśniowa' },
              { exerciseId: 'grip-squeeze', sets: 3, reps: 15 },
            ],
          },
        ],
      },
      {
        weekNumber: 3,
        focus: 'Progresja obciążenia, powrót do aktywności',
        days: [
          {
            dayNumber: 1,
            exercises: [
              { exerciseId: 'eccentric-wrist-extension', sets: 3, reps: 15, notes: 'Większy ciężar' },
              { exerciseId: 'reverse-wrist-curls', sets: 3, reps: 12 },
              { exerciseId: 'wrist-extensor-stretch', sets: 2, reps: 1, holdSeconds: 30 },
              { exerciseId: 'forearm-pronation-supination', sets: 3, reps: 12 },
            ],
          },
          {
            dayNumber: 2,
            exercises: [
              { exerciseId: 'eccentric-wrist-extension', sets: 3, reps: 15 },
              { exerciseId: 'wrist-curls', sets: 2, reps: 12, notes: 'Dla równowagi' },
              { exerciseId: 'triceps-stretch-overhead', sets: 2, reps: 1, holdSeconds: 30 },
            ],
          },
          {
            dayNumber: 3,
            notes: 'Utrzymanie i profilaktyka',
            exercises: [
              { exerciseId: 'eccentric-wrist-extension', sets: 2, reps: 10 },
              { exerciseId: 'wrist-extensor-stretch', sets: 2, reps: 1, holdSeconds: 30 },
              { exerciseId: 'grip-squeeze', sets: 3, reps: 15 },
            ],
          },
        ],
      },
    ],
  },

  // ==================== PLAN 3: ŁOKIEĆ GOLFISTY ====================
  {
    name: 'Rehabilitacja łokcia golfisty (epikondylopatia przyśrodkowa)',
    description: 'Program rehabilitacji dla epikondylopatii przyśrodkowej (łokieć golfisty). Skupia się na ekscentrycznym wzmacnianiu zginaczy nadgarstka i rozciąganiu.',
    status: 'template',
    weeks: [
      {
        weekNumber: 1,
        focus: 'Redukcja bólu, rozciąganie zginaczy',
        days: [
          {
            dayNumber: 1,
            exercises: [
              { exerciseId: 'wrist-flexor-stretch', sets: 3, reps: 1, holdSeconds: 30 },
              { exerciseId: 'wrist-circles', sets: 2, reps: 15 },
              { exerciseId: 'grip-squeeze', sets: 2, reps: 10, notes: 'Lekki opór' },
            ],
          },
          {
            dayNumber: 2,
            exercises: [
              { exerciseId: 'wrist-flexor-stretch', sets: 4, reps: 1, holdSeconds: 30 },
              { exerciseId: 'wrist-circles', sets: 3, reps: 15 },
              { exerciseId: 'elbow-mobilization', sets: 2, reps: 15 },
            ],
          },
          {
            dayNumber: 3,
            exercises: [
              { exerciseId: 'wrist-flexor-stretch', sets: 3, reps: 1, holdSeconds: 30 },
              { exerciseId: 'biceps-curl-isometric', sets: 2, reps: 1, holdSeconds: 15 },
              { exerciseId: 'grip-squeeze', sets: 3, reps: 12 },
            ],
          },
        ],
      },
      {
        weekNumber: 2,
        focus: 'Trening ekscentryczny zginaczy',
        days: [
          {
            dayNumber: 1,
            exercises: [
              { exerciseId: 'eccentric-wrist-flexion', sets: 3, reps: 10, notes: '3-5 sekund w dół' },
              { exerciseId: 'wrist-flexor-stretch', sets: 3, reps: 1, holdSeconds: 30 },
              { exerciseId: 'forearm-pronation-supination', sets: 2, reps: 10 },
            ],
          },
          {
            dayNumber: 2,
            exercises: [
              { exerciseId: 'eccentric-wrist-flexion', sets: 3, reps: 10 },
              { exerciseId: 'wrist-curls', sets: 2, reps: 12, notes: 'Lekki ciężar' },
              { exerciseId: 'wrist-circles', sets: 2, reps: 20 },
            ],
          },
          {
            dayNumber: 3,
            exercises: [
              { exerciseId: 'eccentric-wrist-flexion', sets: 3, reps: 12 },
              { exerciseId: 'biceps-curl-isometric', sets: 2, reps: 1, holdSeconds: 20 },
              { exerciseId: 'grip-squeeze', sets: 3, reps: 15 },
            ],
          },
        ],
      },
      {
        weekNumber: 3,
        focus: 'Progresja i powrót do funkcji',
        days: [
          {
            dayNumber: 1,
            exercises: [
              { exerciseId: 'eccentric-wrist-flexion', sets: 3, reps: 15 },
              { exerciseId: 'wrist-curls', sets: 3, reps: 12 },
              { exerciseId: 'reverse-wrist-curls', sets: 2, reps: 10, notes: 'Równowaga' },
              { exerciseId: 'forearm-pronation-supination', sets: 3, reps: 12 },
            ],
          },
          {
            dayNumber: 2,
            exercises: [
              { exerciseId: 'eccentric-wrist-flexion', sets: 3, reps: 15 },
              { exerciseId: 'wrist-flexor-stretch', sets: 2, reps: 1, holdSeconds: 30 },
              { exerciseId: 'grip-squeeze', sets: 3, reps: 15 },
            ],
          },
          {
            dayNumber: 3,
            exercises: [
              { exerciseId: 'eccentric-wrist-flexion', sets: 2, reps: 10 },
              { exerciseId: 'eccentric-wrist-extension', sets: 2, reps: 10, notes: 'Równowaga' },
              { exerciseId: 'wrist-flexor-stretch', sets: 2, reps: 1, holdSeconds: 30 },
            ],
          },
        ],
      },
    ],
  },

  // ==================== PLAN 4: KOLANO SKOCZKA ====================
  {
    name: 'Rehabilitacja kolana skoczka (tendinopatia więzadła rzepki)',
    description: 'Program rehabilitacji tendinopatii więzadła rzepki. Oparta na ekscentrycznym i izometrycznym treningu czworogłowych z progresywnym obciążeniem.',
    status: 'template',
    weeks: [
      {
        weekNumber: 1,
        focus: 'Redukcja bólu, izometria, mobilizacja rzepki',
        days: [
          {
            dayNumber: 1,
            notes: 'Unikanie skoków i eksplozywnych ruchów',
            exercises: [
              { exerciseId: 'patellar-mobilization', sets: 2, reps: 20 },
              { exerciseId: 'wall-sits', sets: 3, reps: 1, holdSeconds: 30, notes: 'Izometria - kluczowe' },
              { exerciseId: 'straight-leg-raises', sets: 2, reps: 15 },
            ],
          },
          {
            dayNumber: 2,
            exercises: [
              { exerciseId: 'wall-sits', sets: 4, reps: 1, holdSeconds: 40 },
              { exerciseId: 'terminal-knee-extension', sets: 3, reps: 15 },
              { exerciseId: 'foam-rolling-quads', sets: 1, reps: 1, holdSeconds: 60 },
            ],
          },
          {
            dayNumber: 3,
            exercises: [
              { exerciseId: 'wall-sits', sets: 4, reps: 1, holdSeconds: 45 },
              { exerciseId: 'patellar-mobilization', sets: 2, reps: 20 },
              { exerciseId: 'mini-squats', sets: 2, reps: 10, notes: 'Płytki zakres' },
            ],
          },
        ],
      },
      {
        weekNumber: 2,
        focus: 'Wprowadzenie ekscentryki, progresja obciążenia',
        days: [
          {
            dayNumber: 1,
            exercises: [
              { exerciseId: 'eccentric-squats', sets: 3, reps: 8, notes: '5 sekund w dół' },
              { exerciseId: 'wall-sits', sets: 3, reps: 1, holdSeconds: 45 },
              { exerciseId: 'hamstring-curls', sets: 2, reps: 12 },
              { exerciseId: 'foam-rolling-quads', sets: 1, reps: 1, holdSeconds: 90 },
            ],
          },
          {
            dayNumber: 2,
            exercises: [
              { exerciseId: 'eccentric-squats', sets: 3, reps: 10 },
              { exerciseId: 'step-ups', sets: 2, reps: 10, notes: 'Niski stopień' },
              { exerciseId: 'terminal-knee-extension', sets: 3, reps: 15 },
            ],
          },
          {
            dayNumber: 3,
            exercises: [
              { exerciseId: 'eccentric-squats', sets: 3, reps: 10 },
              { exerciseId: 'wall-sits', sets: 3, reps: 1, holdSeconds: 50 },
              { exerciseId: 'glute-bridge', sets: 3, reps: 15 },
            ],
          },
        ],
      },
      {
        weekNumber: 3,
        focus: 'Zaawansowane wzmacnianie, przygotowanie do powrotu',
        days: [
          {
            dayNumber: 1,
            exercises: [
              { exerciseId: 'eccentric-squats', sets: 3, reps: 12, notes: 'Większa głębokość jeśli bez bólu' },
              { exerciseId: 'step-ups', sets: 3, reps: 12 },
              { exerciseId: 'lunges', sets: 2, reps: 8, notes: 'Ostrożnie, kontrola' },
              { exerciseId: 'clamshells', sets: 3, reps: 15 },
            ],
          },
          {
            dayNumber: 2,
            exercises: [
              { exerciseId: 'wall-sits', sets: 4, reps: 1, holdSeconds: 60 },
              { exerciseId: 'eccentric-squats', sets: 3, reps: 12 },
              { exerciseId: 'single-leg-glute-bridge', sets: 2, reps: 10 },
              { exerciseId: 'foam-rolling-quads', sets: 1, reps: 1, holdSeconds: 60 },
            ],
          },
          {
            dayNumber: 3,
            notes: 'Utrzymanie i profilaktyka',
            exercises: [
              { exerciseId: 'eccentric-squats', sets: 2, reps: 10 },
              { exerciseId: 'wall-sits', sets: 2, reps: 1, holdSeconds: 45 },
              { exerciseId: 'mini-squats', sets: 2, reps: 12 },
            ],
          },
        ],
      },
    ],
  },

  // ==================== PLAN 5: BÓL ODCINKA LĘDŹWIOWEGO ====================
  {
    name: 'Rehabilitacja bólu odcinka lędźwiowego kręgosłupa',
    description: 'Program rehabilitacji dla niespecyficznego bólu lędźwi. Skupia się na stabilizacji core, mobilności i rozciąganiu mięśni przykręgosłupowych.',
    status: 'template',
    weeks: [
      {
        weekNumber: 1,
        focus: 'Redukcja bólu, wczesna mobilizacja, rozciąganie',
        days: [
          {
            dayNumber: 1,
            notes: 'Unikanie zgięć i rotacji w bólu',
            exercises: [
              { exerciseId: 'cat-cow-stretch', sets: 2, reps: 8, notes: 'Delikatnie' },
              { exerciseId: 'pelvic-tilts', sets: 3, reps: 10 },
              { exerciseId: 'knee-to-chest-stretch', sets: 2, reps: 1, holdSeconds: 30 },
            ],
          },
          {
            dayNumber: 2,
            exercises: [
              { exerciseId: 'cat-cow-stretch', sets: 3, reps: 10 },
              { exerciseId: 'pelvic-tilts', sets: 3, reps: 15 },
              { exerciseId: 'child-pose', sets: 1, reps: 1, holdSeconds: 60 },
              { exerciseId: 'glute-bridge', sets: 2, reps: 10 },
            ],
          },
          {
            dayNumber: 3,
            exercises: [
              { exerciseId: 'knee-to-chest-stretch', sets: 3, reps: 1, holdSeconds: 30 },
              { exerciseId: 'trunk-rotation', sets: 2, reps: 10, notes: 'Delikatnie' },
              { exerciseId: 'glute-bridge', sets: 3, reps: 12 },
              { exerciseId: 'cat-cow-stretch', sets: 2, reps: 10 },
            ],
          },
        ],
      },
      {
        weekNumber: 2,
        focus: 'Stabilizacja core, wzmacnianie pośladków',
        days: [
          {
            dayNumber: 1,
            exercises: [
              { exerciseId: 'dead-bug', sets: 3, reps: 8, notes: 'Powoli, kontrola lędźwi' },
              { exerciseId: 'bird-dog', sets: 3, reps: 10 },
              { exerciseId: 'glute-bridge', sets: 3, reps: 15 },
              { exerciseId: 'pelvic-tilts', sets: 2, reps: 15 },
            ],
          },
          {
            dayNumber: 2,
            exercises: [
              { exerciseId: 'bird-dog', sets: 3, reps: 12 },
              { exerciseId: 'clamshells', sets: 3, reps: 15 },
              { exerciseId: 'hip-flexor-stretch', sets: 2, reps: 1, holdSeconds: 30 },
              { exerciseId: 'cat-cow-stretch', sets: 2, reps: 10 },
            ],
          },
          {
            dayNumber: 3,
            exercises: [
              { exerciseId: 'dead-bug', sets: 3, reps: 10 },
              { exerciseId: 'single-leg-glute-bridge', sets: 2, reps: 10 },
              { exerciseId: 'prone-extension', sets: 2, reps: 10 },
              { exerciseId: 'child-pose', sets: 1, reps: 1, holdSeconds: 45 },
            ],
          },
        ],
      },
      {
        weekNumber: 3,
        focus: 'Progresja stabilizacji, funkcjonalność',
        days: [
          {
            dayNumber: 1,
            exercises: [
              { exerciseId: 'dead-bug', sets: 3, reps: 12 },
              { exerciseId: 'bird-dog', sets: 3, reps: 12 },
              { exerciseId: 'single-leg-glute-bridge', sets: 3, reps: 10 },
              { exerciseId: 'thoracic-rotation', sets: 2, reps: 10 },
            ],
          },
          {
            dayNumber: 2,
            exercises: [
              { exerciseId: 'prone-extension', sets: 3, reps: 12 },
              { exerciseId: 'glute-bridge', sets: 3, reps: 15 },
              { exerciseId: 'hip-abduction', sets: 3, reps: 12 },
              { exerciseId: 'standing-back-extension', sets: 2, reps: 10 },
            ],
          },
          {
            dayNumber: 3,
            notes: 'Utrzymanie i profilaktyka',
            exercises: [
              { exerciseId: 'dead-bug', sets: 2, reps: 10 },
              { exerciseId: 'bird-dog', sets: 2, reps: 10 },
              { exerciseId: 'glute-bridge', sets: 2, reps: 12 },
              { exerciseId: 'cat-cow-stretch', sets: 2, reps: 10 },
            ],
          },
        ],
      },
    ],
  },

  // ==================== PLAN 6: KONFLIKT BARKOWY ====================
  {
    name: 'Rehabilitacja konfliktu barkowego (impingement)',
    description: 'Program rehabilitacji dla zespołu konfliktu podbarkowego. Skupia się na wzmacnianiu stożków rotatorów, retrakcji łopatki i poprawie postawy.',
    status: 'template',
    weeks: [
      {
        weekNumber: 1,
        focus: 'Redukcja bólu, mobilność, wczesne wzmacnianie',
        days: [
          {
            dayNumber: 1,
            notes: 'Unikanie unoszenia ramion powyżej 90 stopni',
            exercises: [
              { exerciseId: 'pendulum-swings', sets: 2, reps: 1, holdSeconds: 60 },
              { exerciseId: 'shoulder-blade-squeezes', sets: 3, reps: 12 },
              { exerciseId: 'arm-circles', sets: 2, reps: 10, notes: 'Małe koła' },
            ],
          },
          {
            dayNumber: 2,
            exercises: [
              { exerciseId: 'external-rotation', sets: 3, reps: 12, notes: 'Lekka guma' },
              { exerciseId: 'internal-rotation', sets: 3, reps: 12 },
              { exerciseId: 'sleeper-stretch', sets: 2, reps: 1, holdSeconds: 30 },
              { exerciseId: 'scapular-retraction', sets: 3, reps: 12 },
            ],
          },
          {
            dayNumber: 3,
            exercises: [
              { exerciseId: 'external-rotation', sets: 3, reps: 15 },
              { exerciseId: 'cross-body-stretch', sets: 2, reps: 1, holdSeconds: 30 },
              { exerciseId: 'shoulder-blade-squeezes', sets: 3, reps: 15 },
              { exerciseId: 'pendulum-swings', sets: 2, reps: 1, holdSeconds: 45 },
            ],
          },
        ],
      },
      {
        weekNumber: 2,
        focus: 'Progresja wzmacniania stożków, stabilizacja łopatki',
        days: [
          {
            dayNumber: 1,
            exercises: [
              { exerciseId: 'external-rotation', sets: 3, reps: 15 },
              { exerciseId: 'internal-rotation', sets: 3, reps: 15 },
              { exerciseId: 'empty-can-raises', sets: 2, reps: 10, notes: 'Tylko do 45 stopni' },
              { exerciseId: 'prone-y-raises', sets: 2, reps: 10 },
            ],
          },
          {
            dayNumber: 2,
            exercises: [
              { exerciseId: 'scapular-retraction', sets: 3, reps: 15 },
              { exerciseId: 'prone-horizontal-abduction', sets: 3, reps: 12 },
              { exerciseId: 'wall-walks', sets: 2, reps: 8, notes: 'Do komfortu' },
              { exerciseId: 'sleeper-stretch', sets: 2, reps: 1, holdSeconds: 30 },
            ],
          },
          {
            dayNumber: 3,
            exercises: [
              { exerciseId: 'prone-w-y-t', sets: 2, reps: 8 },
              { exerciseId: 'external-rotation', sets: 3, reps: 15 },
              { exerciseId: 'shoulder-blade-squeezes', sets: 3, reps: 15 },
              { exerciseId: 'cross-body-stretch', sets: 2, reps: 1, holdSeconds: 30 },
            ],
          },
        ],
      },
      {
        weekNumber: 3,
        focus: 'Zaawansowane wzmacnianie, funkcjonalność',
        days: [
          {
            dayNumber: 1,
            exercises: [
              { exerciseId: 'empty-can-raises', sets: 3, reps: 12 },
              { exerciseId: 'prone-y-raises', sets: 3, reps: 12 },
              { exerciseId: 'external-rotation', sets: 3, reps: 15 },
              { exerciseId: 'wall-walks', sets: 3, reps: 10 },
            ],
          },
          {
            dayNumber: 2,
            exercises: [
              { exerciseId: 'prone-w-y-t', sets: 3, reps: 8 },
              { exerciseId: 'scapular-retraction', sets: 3, reps: 15 },
              { exerciseId: 'prone-horizontal-abduction', sets: 3, reps: 12 },
              { exerciseId: 'sleeper-stretch', sets: 2, reps: 1, holdSeconds: 30 },
            ],
          },
          {
            dayNumber: 3,
            notes: 'Utrzymanie',
            exercises: [
              { exerciseId: 'external-rotation', sets: 2, reps: 15 },
              { exerciseId: 'prone-y-raises', sets: 2, reps: 12 },
              { exerciseId: 'scapular-retraction', sets: 2, reps: 15 },
              { exerciseId: 'cross-body-stretch', sets: 2, reps: 1, holdSeconds: 30 },
            ],
          },
        ],
      },
    ],
  },

  // ==================== PLAN 7: URAZ STOŻKÓW ROTATORÓW ====================
  {
    name: 'Rehabilitacja po urazie stożków rotatorów',
    description: 'Program rehabilitacji po uszkodzeniu/cewce stożków rotatorów. Progresywny protokół od mobilności do funkcjonalnego wzmacniania.',
    status: 'template',
    weeks: [
      {
        weekNumber: 1,
        focus: 'Faza ochronna, pasywna mobilność',
        days: [
          {
            dayNumber: 1,
            notes: 'Chronić bark, unikanie aktywnych ruchów ponad głowę',
            exercises: [
              { exerciseId: 'pendulum-swings', sets: 3, reps: 1, holdSeconds: 60, notes: 'Pasywne' },
              { exerciseId: 'shoulder-blade-squeezes', sets: 2, reps: 10 },
              { exerciseId: 'arm-circles', sets: 2, reps: 10, notes: 'Bardzo małe koła' },
            ],
          },
          {
            dayNumber: 2,
            exercises: [
              { exerciseId: 'pendulum-swings', sets: 3, reps: 1, holdSeconds: 90 },
              { exerciseId: 'scapular-retraction', sets: 2, reps: 12 },
              { exerciseId: 'external-rotation', sets: 2, reps: 10, notes: 'Bardzo lekka guma, tylko izometria' },
            ],
          },
          {
            dayNumber: 3,
            exercises: [
              { exerciseId: 'pendulum-swings', sets: 3, reps: 1, holdSeconds: 60 },
              { exerciseId: 'shoulder-blade-squeezes', sets: 3, reps: 12 },
              { exerciseId: 'internal-rotation', sets: 2, reps: 10, notes: 'Lekka guma' },
            ],
          },
        ],
      },
      {
        weekNumber: 2,
        focus: 'Aktywne asystowane ruchy, wzmacnianie początkowe',
        days: [
          {
            dayNumber: 1,
            exercises: [
              { exerciseId: 'wall-walks', sets: 2, reps: 8, notes: 'Tylko do komfortu' },
              { exerciseId: 'external-rotation', sets: 3, reps: 12 },
              { exerciseId: 'internal-rotation', sets: 3, reps: 12 },
              { exerciseId: 'pendulum-swings', sets: 2, reps: 1, holdSeconds: 45 },
            ],
          },
          {
            dayNumber: 2,
            exercises: [
              { exerciseId: 'scapular-retraction', sets: 3, reps: 15 },
              { exerciseId: 'external-rotation', sets: 3, reps: 12 },
              { exerciseId: 'sleeper-stretch', sets: 2, reps: 1, holdSeconds: 30, notes: 'Delikatnie' },
              { exerciseId: 'prone-y-raises', sets: 2, reps: 8 },
            ],
          },
          {
            dayNumber: 3,
            exercises: [
              { exerciseId: 'wall-walks', sets: 3, reps: 8 },
              { exerciseId: 'external-rotation', sets: 3, reps: 15 },
              { exerciseId: 'prone-horizontal-abduction', sets: 2, reps: 10 },
              { exerciseId: 'shoulder-blade-squeezes', sets: 3, reps: 15 },
            ],
          },
        ],
      },
      {
        weekNumber: 3,
        focus: 'Wzmacnianie stożków, stabilizacja łopatki',
        days: [
          {
            dayNumber: 1,
            exercises: [
              { exerciseId: 'empty-can-raises', sets: 2, reps: 10, notes: 'Do 45 stopni' },
              { exerciseId: 'external-rotation', sets: 3, reps: 15 },
              { exerciseId: 'prone-w-y-t', sets: 2, reps: 8 },
              { exerciseId: 'wall-walks', sets: 3, reps: 10 },
            ],
          },
          {
            dayNumber: 2,
            exercises: [
              { exerciseId: 'prone-y-raises', sets: 3, reps: 12 },
              { exerciseId: 'internal-rotation', sets: 3, reps: 15 },
              { exerciseId: 'scapular-retraction', sets: 3, reps: 15 },
              { exerciseId: 'cross-body-stretch', sets: 2, reps: 1, holdSeconds: 30 },
            ],
          },
          {
            dayNumber: 3,
            exercises: [
              { exerciseId: 'external-rotation', sets: 3, reps: 15 },
              { exerciseId: 'prone-horizontal-abduction', sets: 3, reps: 12 },
              { exerciseId: 'empty-can-raises', sets: 2, reps: 12 },
              { exerciseId: 'sleeper-stretch', sets: 2, reps: 1, holdSeconds: 30 },
            ],
          },
        ],
      },
    ],
  },

  // ==================== PLAN 8: BÓL BIODRA BIEGACZA ====================
  {
    name: 'Rehabilitacja bólu biodra biegacza (ITB/snapping hip)',
    description: 'Program rehabilitacji dla zespołu pasma biodrowo-piszczelowego i snapping hip. Skupia się na rozluźnianiu ITB, wzmacnianiu pośladkowego średniego i stabilizacji biodra.',
    status: 'template',
    weeks: [
      {
        weekNumber: 1,
        focus: 'Redukcja napięcia ITB, rozciąganie, wczesne wzmacnianie',
        days: [
          {
            dayNumber: 1,
            notes: 'Redukcja objętości biegania',
            exercises: [
              { exerciseId: 'it-band-stretch', sets: 3, reps: 1, holdSeconds: 30 },
              { exerciseId: 'clamshells', sets: 2, reps: 12 },
              { exerciseId: 'piriformis-stretch', sets: 2, reps: 1, holdSeconds: 30 },
            ],
          },
          {
            dayNumber: 2,
            exercises: [
              { exerciseId: 'foam-rolling-quads', sets: 1, reps: 1, holdSeconds: 90, notes: 'Rolowanie ITB' },
              { exerciseId: 'hip-abduction', sets: 3, reps: 12 },
              { exerciseId: 'hip-flexor-stretch', sets: 2, reps: 1, holdSeconds: 30 },
              { exerciseId: 'side-lying-leg-lift', sets: 2, reps: 12 },
            ],
          },
          {
            dayNumber: 3,
            exercises: [
              { exerciseId: 'figure-4-stretch', sets: 3, reps: 1, holdSeconds: 30 },
              { exerciseId: 'clamshells', sets: 3, reps: 15 },
              { exerciseId: 'glute-bridge', sets: 3, reps: 12 },
              { exerciseId: 'it-band-stretch', sets: 2, reps: 1, holdSeconds: 30 },
            ],
          },
        ],
      },
      {
        weekNumber: 2,
        focus: 'Progresja wzmacniania pośladków, stabilizacja',
        days: [
          {
            dayNumber: 1,
            exercises: [
              { exerciseId: 'fire-hydrants', sets: 3, reps: 12 },
              { exerciseId: 'hip-abduction', sets: 3, reps: 15 },
              { exerciseId: 'single-leg-glute-bridge', sets: 2, reps: 10 },
              { exerciseId: '90-90-stretch', sets: 2, reps: 1, holdSeconds: 45 },
            ],
          },
          {
            dayNumber: 2,
            exercises: [
              { exerciseId: 'clamshells', sets: 3, reps: 15, notes: 'Z gumą' },
              { exerciseId: 'side-lying-clam-advanced', sets: 2, reps: 10 },
              { exerciseId: 'piriformis-stretch', sets: 2, reps: 1, holdSeconds: 30 },
              { exerciseId: 'glute-bridge', sets: 3, reps: 15 },
            ],
          },
          {
            dayNumber: 3,
            exercises: [
              { exerciseId: 'single-leg-deadlift', sets: 2, reps: 8, notes: 'Bez ciężaru lub lekki' },
              { exerciseId: 'hip-abduction', sets: 3, reps: 15 },
              { exerciseId: 'it-band-stretch', sets: 2, reps: 1, holdSeconds: 30 },
              { exerciseId: 'standing-hip-flexor-stretch', sets: 2, reps: 1, holdSeconds: 30 },
            ],
          },
        ],
      },
      {
        weekNumber: 3,
        focus: 'Funkcjonalne wzmacnianie, powrót do biegania',
        days: [
          {
            dayNumber: 1,
            exercises: [
              { exerciseId: 'single-leg-deadlift', sets: 3, reps: 10 },
              { exerciseId: 'side-lying-clam-advanced', sets: 3, reps: 12 },
              { exerciseId: 'single-leg-glute-bridge', sets: 3, reps: 10 },
              { exerciseId: 'fire-hydrants', sets: 3, reps: 12 },
            ],
          },
          {
            dayNumber: 2,
            exercises: [
              { exerciseId: 'hip-abduction', sets: 3, reps: 15 },
              { exerciseId: 'glute-bridge', sets: 3, reps: 15 },
              { exerciseId: '90-90-stretch', sets: 2, reps: 1, holdSeconds: 45 },
              { exerciseId: 'figure-4-stretch', sets: 2, reps: 1, holdSeconds: 30 },
            ],
          },
          {
            dayNumber: 3,
            notes: 'Utrzymanie i profilaktyka',
            exercises: [
              { exerciseId: 'clamshells', sets: 2, reps: 15 },
              { exerciseId: 'hip-abduction', sets: 2, reps: 15 },
              { exerciseId: 'single-leg-glute-bridge', sets: 2, reps: 10 },
              { exerciseId: 'it-band-stretch', sets: 2, reps: 1, holdSeconds: 30 },
            ],
          },
        ],
      },
    ],
  },

  // ==================== PLAN 9: SZPADEL BARKU ====================
  {
    name: 'Rehabilitacja szpadla barku (postura wysunięta)',
    description: 'Program korekcji postawy dla zespołu skrzyżowania górnego. Skupia się na wzmocnieniu dolnego czworobocznego, retrakcji łopatki i rozciąganiu mięśni przykurczonych.',
    status: 'template',
    weeks: [
      {
        weekNumber: 1,
        focus: 'Świadomość posturalna, rozciąganie przykurczonych',
        days: [
          {
            dayNumber: 1,
            notes: 'Ergonomia stanowiska pracy',
            exercises: [
              { exerciseId: 'chin-tucks', sets: 3, reps: 10 },
              { exerciseId: 'shoulder-blade-squeezes', sets: 3, reps: 12 },
              { exerciseId: 'upper-trap-stretch', sets: 2, reps: 1, holdSeconds: 30 },
            ],
          },
          {
            dayNumber: 2,
            exercises: [
              { exerciseId: 'scapular-retraction', sets: 3, reps: 15 },
              { exerciseId: 'levator-scapulae-stretch', sets: 2, reps: 1, holdSeconds: 30 },
              { exerciseId: 'prone-y-raises', sets: 2, reps: 10 },
              { exerciseId: 'chin-tucks', sets: 3, reps: 12 },
            ],
          },
          {
            dayNumber: 3,
            exercises: [
              { exerciseId: 'neck-side-flexion', sets: 2, reps: 1, holdSeconds: 30 },
              { exerciseId: 'shoulder-blade-squeezes', sets: 3, reps: 15 },
              { exerciseId: 'arm-circles', sets: 2, reps: 15, notes: 'Do tyłu' },
              { exerciseId: 'upper-trap-stretch', sets: 2, reps: 1, holdSeconds: 30 },
            ],
          },
        ],
      },
      {
        weekNumber: 2,
        focus: 'Wzmacnianie osłabionych, retrakcja łopatki',
        days: [
          {
            dayNumber: 1,
            exercises: [
              { exerciseId: 'prone-w-y-t', sets: 2, reps: 8 },
              { exerciseId: 'scapular-retraction', sets: 3, reps: 15 },
              { exerciseId: 'prone-horizontal-abduction', sets: 3, reps: 12 },
              { exerciseId: 'chin-tucks', sets: 3, reps: 12 },
            ],
          },
          {
            dayNumber: 2,
            exercises: [
              { exerciseId: 'prone-y-raises', sets: 3, reps: 12 },
              { exerciseId: 'external-rotation', sets: 3, reps: 15 },
              { exerciseId: 'levator-scapulae-stretch', sets: 2, reps: 1, holdSeconds: 30 },
              { exerciseId: 'shoulder-blade-squeezes', sets: 3, reps: 15 },
            ],
          },
          {
            dayNumber: 3,
            exercises: [
              { exerciseId: 'neck-isometric-holds', sets: 3, reps: 5, holdSeconds: 5 },
              { exerciseId: 'prone-w-y-t', sets: 2, reps: 8 },
              { exerciseId: 'upper-trap-stretch', sets: 2, reps: 1, holdSeconds: 30 },
              { exerciseId: 'scapular-retraction', sets: 3, reps: 15 },
            ],
          },
        ],
      },
      {
        weekNumber: 3,
        focus: 'Integracja posturalna, utrzymanie',
        days: [
          {
            dayNumber: 1,
            exercises: [
              { exerciseId: 'prone-w-y-t', sets: 3, reps: 8 },
              { exerciseId: 'prone-y-raises', sets: 3, reps: 12 },
              { exerciseId: 'scapular-retraction', sets: 3, reps: 15 },
              { exerciseId: 'chin-tucks', sets: 3, reps: 15 },
            ],
          },
          {
            dayNumber: 2,
            exercises: [
              { exerciseId: 'external-rotation', sets: 3, reps: 15 },
              { exerciseId: 'prone-horizontal-abduction', sets: 3, reps: 12 },
              { exerciseId: 'neck-rotation', sets: 2, reps: 10 },
              { exerciseId: 'shoulder-blade-squeezes', sets: 3, reps: 15 },
            ],
          },
          {
            dayNumber: 3,
            notes: 'Codzienna rutyna utrzymaniowa',
            exercises: [
              { exerciseId: 'chin-tucks', sets: 2, reps: 10 },
              { exerciseId: 'scapular-retraction', sets: 2, reps: 15 },
              { exerciseId: 'prone-y-raises', sets: 2, reps: 12 },
              { exerciseId: 'upper-trap-stretch', sets: 2, reps: 1, holdSeconds: 30 },
            ],
          },
        ],
      },
    ],
  },

  // ==================== PLAN 10: ZESPÓŁ RZEPKOWO-UDOWY ====================
  {
    name: 'Rehabilitacja zespołu rzepkowo-udowego (PFPS)',
    description: 'Program rehabilitacji dla bólu przedniego odcinka kolana (PFPS). Skupia się na wzmacnianiu pośladkowego średniego, kontroli kolana i rozciąganiu.',
    status: 'template',
    weeks: [
      {
        weekNumber: 1,
        focus: 'Redukcja bólu, wzmacnianie początkowe pośladków',
        days: [
          {
            dayNumber: 1,
            notes: 'Unikanie przysiadów poniżej 60 stopni',
            exercises: [
              { exerciseId: 'clamshells', sets: 3, reps: 15 },
              { exerciseId: 'straight-leg-raises', sets: 3, reps: 12 },
              { exerciseId: 'glute-bridge', sets: 3, reps: 12 },
            ],
          },
          {
            dayNumber: 2,
            exercises: [
              { exerciseId: 'hip-abduction', sets: 3, reps: 15 },
              { exerciseId: 'side-lying-leg-lift', sets: 3, reps: 15 },
              { exerciseId: 'terminal-knee-extension', sets: 3, reps: 15 },
              { exerciseId: 'piriformis-stretch', sets: 2, reps: 1, holdSeconds: 30 },
            ],
          },
          {
            dayNumber: 3,
            exercises: [
              { exerciseId: 'clamshells', sets: 3, reps: 15 },
              { exerciseId: 'wall-sits', sets: 2, reps: 1, holdSeconds: 30, notes: 'Płytkie' },
              { exerciseId: 'foam-rolling-quads', sets: 1, reps: 1, holdSeconds: 60 },
              { exerciseId: 'hip-flexor-stretch', sets: 2, reps: 1, holdSeconds: 30 },
            ],
          },
        ],
      },
      {
        weekNumber: 2,
        focus: 'Kontrola kolana, progresja wzmacniania',
        days: [
          {
            dayNumber: 1,
            exercises: [
              { exerciseId: 'mini-squats', sets: 3, reps: 12, notes: 'Kolano nad stopą!' },
              { exerciseId: 'hip-abduction', sets: 3, reps: 15 },
              { exerciseId: 'single-leg-glute-bridge', sets: 2, reps: 10 },
              { exerciseId: 'clamshells', sets: 3, reps: 15 },
            ],
          },
          {
            dayNumber: 2,
            exercises: [
              { exerciseId: 'step-ups', sets: 2, reps: 10, notes: 'Niski stopień, kontrola kolana' },
              { exerciseId: 'side-lying-clam-advanced', sets: 2, reps: 12 },
              { exerciseId: 'wall-sits', sets: 3, reps: 1, holdSeconds: 40 },
              { exerciseId: 'it-band-stretch', sets: 2, reps: 1, holdSeconds: 30 },
            ],
          },
          {
            dayNumber: 3,
            exercises: [
              { exerciseId: 'mini-squats', sets: 3, reps: 12 },
              { exerciseId: 'fire-hydrants', sets: 3, reps: 12 },
              { exerciseId: 'terminal-knee-extension', sets: 3, reps: 15 },
              { exerciseId: 'figure-4-stretch', sets: 2, reps: 1, holdSeconds: 30 },
            ],
          },
        ],
      },
      {
        weekNumber: 3,
        focus: 'Funkcjonalne wzmacnianie, powrót do aktywności',
        days: [
          {
            dayNumber: 1,
            exercises: [
              { exerciseId: 'step-ups', sets: 3, reps: 12, notes: 'Wyższy stopień' },
              { exerciseId: 'hip-abduction', sets: 3, reps: 15 },
              { exerciseId: 'single-leg-glute-bridge', sets: 3, reps: 10 },
              { exerciseId: 'mini-squats', sets: 3, reps: 12 },
            ],
          },
          {
            dayNumber: 2,
            exercises: [
              { exerciseId: 'lunges', sets: 2, reps: 8, notes: 'Płaskie, kontrola kolana' },
              { exerciseId: 'side-lying-clam-advanced', sets: 3, reps: 12 },
              { exerciseId: 'wall-sits', sets: 3, reps: 1, holdSeconds: 45 },
              { exerciseId: 'foam-rolling-quads', sets: 1, reps: 1, holdSeconds: 60 },
            ],
          },
          {
            dayNumber: 3,
            notes: 'Utrzymanie i profilaktyka',
            exercises: [
              { exerciseId: 'clamshells', sets: 2, reps: 15 },
              { exerciseId: 'hip-abduction', sets: 2, reps: 15 },
              { exerciseId: 'glute-bridge', sets: 2, reps: 12 },
              { exerciseId: 'mini-squats', sets: 2, reps: 12 },
            ],
          },
        ],
      },
    ],
  },
];
