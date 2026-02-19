<div align="center">

# 🏥 Rehab Planner

**Profesjonalna aplikacja dla fizjoterapeutów do zarządzania planami rehabilitacji**

*Z futurystycznym interfejsem w stylu Cyberpunk*

[![Next.js](https://img.shields.io/badge/Next.js%2016-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React%2019-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS%204-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://prisma.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)
[![CI](https://github.com/WielkiKrzych/rehab-planner/actions/workflows/ci.yml/badge.svg)](https://github.com/WielkiKrzych/rehab-planner/actions)

[Demo](#-demo) • [Funkcje](#-funkcje) • [Instalacja](#-instalacja) • [Użycie](#-użycie)

</div>

---

## 🎨 Design

Aplikacja wykorzystuje nowoczesny **Cyberpunk + Liquid Glass** design z:

- 🌙 **Ciemne tło** (#0a0a0f) z neonowymi akcentami
- ✨ **Neonowe kolory** - cyan (#00f0ff), pink (#ff00ff), purple (#b829dd), green (#00ff88)
- 🔮 **Glass morphism** - efekt szkła z rozmyciem i przezroczystością
- 🌈 **Gradient text** - neonowe gradienty na nagłówkach
- ⚡ **Animacje** - płynne przejścia i efekty hover

---

## 🔐 Bezpieczeństwo

- ✅ **NextAuth.js** - Logowanie użytkowników z JWT
- ✅ **Role-based access** - Administrator i Fizjoterapeuta
- ✅ **API Authentication** - Wszystkie endpointy chronione sesją
- ✅ **Rate limiting** - Ochrona przed atakami (100 req/min) z cleanup
- ✅ **CORS** - Konfigurowalne zasady CORS
- ✅ **Zod validation** - Walidacja danych na serwerze (wszystkie endpointy)
- ✅ **Middleware** - Ochrona wszystkich tras
- ✅ **Error Boundaries** - Obsługa błędów React

---

## ✨ Funkcje

| Funkcja | Opis |
|---------|------|
| 📊 Dashboard | Statystyki na żywo, ostatnia aktywność |
| 👥 Pacjenci | Pełne CRUD, historia diagnoz, plany rehabilitacji, export CSV/JSON |
| 📑 Kreator Planów | Builder z tygodniami, dniami i ćwiczeniami |
| 🏋️ Baza Ćwiczeń | 30+ ćwiczeń z kategoryzacją i filtrami |
| 🔍 Wyszukiwanie | Szukaj pacjentów z debounce (300ms) |
| 🤖 AI Check-in | Codzienna ocena gotowości z algorytmem adaptive intensity |
| 🎯 AI Cele | Definiowanie celów z automatycznym generowaniem planów |
| 💬 AI Chat | Rozmowa z AI asystentem o postępach i ćwiczeniach |
| 📈 Raporty Postępów | Cotygodniowa analiza z trendami AI |
| 📆 Calendar Export | Export do Google/Apple Calendar (.ics) |
| 📖 API REST | Pełne REST API z paginacją i filtrami |
| 📚 Swagger/OpenAPI | Dokumentacja API dostępna pod /docs |
| 🐳 Docker | Uruchom w kontenerze jednym poleceniem |
| 🧪 E2E Tests | Playwright testy dla krytycznych ścieżek użytkownika |

---

## 🚀 Instalacja

### Opcja 1: Lokalnie

```bash
git clone https://github.com/WielkiKrzych/rehab-planner.git
cd rehab-planner
npm install
npx prisma generate
npx prisma db push
npm run dev
```

### Opcja 2: Docker

```bash
docker-compose up -d
```

---

## 📖 Pierwsze uruchomienie

```bash
curl -X POST http://localhost:3000/api/seed
```

Po uruchomieniu seed, zaloguj się używając danych admina utworzonych podczas seed.

Domyślne dane:
- **Email:** admin@example.com
- **Hasło:** admin123

---

## 📖 Użycie

| Krok | Akcja |
|:----:|-------|
| 1️⃣ | Zaloguj się |
| 2️⃣ | Dodaj pacjenta |
| 3️⃣ | Utwórz plan rehabilitacji |
| 4️⃣ | Przypisz plan pacjentowi |
| 5️⃣ | Śledź postępy na dashboard |

---

## ⚙️ Zmienne środowiskowe

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="wygeneruj wlasny-klucz-openssl-rand-base64-32"
```

---

## 🏗️ Architektura

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── patients/      # Patients endpoints
│   │   ├── plans/         # Plans endpoints
│   │   ├── exercises/     # Exercises endpoints
│   │   ├── diagnoses/     # Diagnoses endpoints
│   │   ├── users/         # Users endpoints
│   │   └── docs/          # Swagger docs
│   ├── patients/          # Patients pages
│   ├── plans/             # Plans pages
│   ├── exercises/         # Exercises page
│   ├── stats/             # Statistics page
│   ├── login/             # Login page
│   └── docs/              # Swagger UI page
├── components/            # React Components
│   ├── layout/            # Layout components
│   ├── patients/          # Patient components
│   ├── plans/             # Plan components
│   └── exercises/         # Exercise components
├── context/               # React Context
├── lib/                   # Utilities
│   ├── authMiddleware.ts  # Auth helpers
│   ├── rateLimit.ts       # Rate limiting
│   ├── useDebounce.ts     # Debounce hook
│   ├── validations.ts     # Zod schemas
│   └── prisma.ts          # Database client
├── test/                  # Test setup
└── types/                 # TypeScript types
```

---

## 🛠️ Tech Stack

| Warstwa | Technologia |
|---------|-------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS 4 |
| Język | TypeScript |
| Database | SQLite + Prisma ORM |
| Auth | NextAuth.js (JWT) |
| Validation | Zod |
| Testing | Vitest + React Testing Library + Playwright |
| API Docs | Swagger UI + OpenAPI 3.0 |
| Docker | Dockerfile + docker-compose |
| CI/CD | GitHub Actions |

---

## 🧪 Testowanie

```bash
# Testy jednostkowe
npm run test

# Testy z UI
npm run test:ui

# Testy z pokryciem kodu
npm run test:coverage

# Testy E2E (Playwright)
npm run e2e
npm run e2e:ui
npm run e2e:headed
```

---

## 📡 API

### Endpoints

| Metoda | Endpoint | Opis |
|--------|----------|------|
| GET/POST | `/api/patients` | Lista i tworzenie pacjentów |
| GET/PUT/DELETE | `/api/patients/[id]` | Operacje na pojedynczym pacjencie |
| GET | `/api/patients/export` | Export pacjentów (csv/json) |
| GET/POST | `/api/plans` | Lista i tworzenie planów |
| GET/PUT/DELETE | `/api/plans/[id]` | Operacje na pojedynczym planie |
| GET | `/api/exercises` | Lista ćwiczeń |
| POST | `/api/diagnoses` | Tworzenie diagnozy |
| POST | `/api/users` | Tworzenie użytkownika (admin only) |
| GET | `/api/docs` | Specyfikacja OpenAPI |

### Przykłady

```bash
# Pobierz pacjentów z paginacją
curl -H "Authorization: Bearer TOKEN" "http://localhost:3000/api/patients?page=1&limit=20"

# Pobierz plany z filtrowaniem
curl -H "Authorization: Bearer TOKEN" "http://localhost:3000/api/plans?status=active&patientId=xxx"

# Export pacjentów do CSV
curl -H "Authorization: Bearer TOKEN" "http://localhost:3000/api/patients/export?format=csv" -o patients.csv
```

### Dokumentacja Swagger

Otwórz `http://localhost:3000/docs` w przeglądarce aby zobaczyć interaktywną dokumentację API.

---

## 🤝 Contributing

Pull requesty są mile widziane!

---

## 📄 License

[MIT](LICENSE) © 2025

---

<div align="center">

**Stworzone z ❤️ dla fizjoterapeutów**

</div>
