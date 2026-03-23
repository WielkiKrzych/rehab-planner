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

### Uwierzytelnianie i Autoryzacja
- ✅ **NextAuth.js v5** - Pełna implementacja z Credentials Provider
- ✅ **Role-based access** - Administrator i Fizjoterapeuta z kontrolą uprawnień
- ✅ **Middleware Protection** - Wszystkie trasy chronione, wymuszane logowanie
- ✅ **JWT Sessions** - Bezpieczne sesje z konfigurowalnym wygasaniem (24h)

### Ochrona API
- ✅ **Zod Validation** - Wszystkie endpointy walidowane schematami
- ✅ **Rate Limiting** - Ochrona przed atakami (100 req/min) z cleanup
- ✅ **CORS** - Konfigurowalne zasady CORS
- ✅ **Pagination Limits** - Maksymalnie 100 rekordów na stronę (ochrona pamięci)

### Bezpieczeństwo Danych
- ✅ **Password Security** - bcrypt z 12 salt rounds, minimum 8 znaków
- ✅ **CSV Injection Protection** - Sanityzacja eksportu danych
- ✅ **XSS Protection** - Escape HTML w emailach i treści
- ✅ **Prompt Injection Protection** - Filtrowanie wiadomości chat AI

### Headers i HTTPS
- ✅ **Security Headers** - CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- ✅ **HTTPS Enforcement** - Automatyczne przekierowanie w produkcji
- ✅ **Permissions Policy** - Blokowanie dostępu do kamery, mikrofonu, geolokacji

### Audit i Monitoring
- ✅ **Error Boundaries** - Obsługa błędów React
- ✅ **API Docs Protection** - Swagger dostępny tylko dla zalogowanych

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
| 📚 Swagger/OpenAPI | Dokumentacja API dostępna pod /docs (wymaga logowania) |
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

1. Skopiuj `.env.example` do `.env` i uzupełnij zmienne:

```bash
cp .env.example .env
# Edytuj .env i ustaw AUTH_SECRET, ZAI_API_KEY itp.
```

2. Wygeneruj sekret AUTH_SECRET:

```bash
openssl rand -base64 32
```

3. Uruchom seed bazy danych:

```bash
curl -X POST http://localhost:3000/api/seed
```

**Ważne:** Ustaw `DEFAULT_ADMIN_PASSWORD` w `.env` przed uruchomieniem seed!

Domyślne dane po seed:
- **Email:** admin@rehab.pl
- **Hasło:** (z DEFAULT_ADMIN_PASSWORD w .env)

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
# Database
DATABASE_URL="file:./dev.db"

# Authentication (REQUIRED)
AUTH_SECRET="wygeneruj-openssl-rand-base64-32"

# AI Integration
ZAI_API_KEY="your-api-key"

# Email (optional)
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER=""
SMTP_PASS=""

# Push Notifications
VAPID_PUBLIC_KEY=""
VAPID_PRIVATE_KEY=""
VAPID_SUBJECT=""

# Default Admin Password for seed
DEFAULT_ADMIN_PASSWORD="your-secure-password"
```

Zobacz `.env.example` dla pełnej listy zmiennych.

---

## 🏗️ Architektura

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── patients/      # Patients endpoints (paginated, validated)
│   │   ├── plans/         # Plans endpoints
│   │   ├── exercises/     # Exercises endpoints
│   │   ├── diagnoses/     # Diagnoses endpoints
│   │   ├── users/         # Users endpoints (admin only)
│   │   ├── chat/          # AI chat (prompt injection protected)
│   │   ├── reports/       # Progress reports
│   │   └── docs/          # Swagger docs (auth protected)
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
│   ├── authMiddleware.ts  # Auth helpers (requireAuth, requireAdmin)
│   ├── rateLimit.ts       # Rate limiting
│   ├── email.ts           # Email sending (XSS protected)
│   ├── validations.ts     # Zod schemas (8+ char passwords)
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
| Auth | NextAuth.js v5 (JWT) |
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
| GET/POST | `/api/patients` | Lista i tworzenie pacjentów (max 100/page) |
| GET/PUT/DELETE | `/api/patients/[id]` | Operacje na pojedynczym pacjencie |
| GET | `/api/patients/export` | Export pacjentów (csv/json) - CSV injection protected |
| GET/POST | `/api/plans` | Lista i tworzenie planów |
| GET/PUT/DELETE | `/api/plans/[id]` | Operacje na pojedynczym planie |
| GET | `/api/exercises` | Lista ćwiczeń |
| POST | `/api/diagnoses` | Tworzenie diagnozy |
| POST | `/api/users` | Tworzenie użytkownika (admin only) |
| GET | `/api/docs` | Specyfikacja OpenAPI (auth required) |
| POST | `/api/chat` | AI Chat (max 2000 chars, prompt injection protected) |

### Przykłady

```bash
# Pobierz pacjentów z paginacją (max limit=100)
curl -H "Authorization: Bearer TOKEN" "http://localhost:3000/api/patients?page=1&limit=20"

# Pobierz plany z filtrowaniem
curl -H "Authorization: Bearer TOKEN" "http://localhost:3000/api/plans?status=active&patientId=xxx"

# Export pacjentów do CSV (sanitized)
curl -H "Authorization: Bearer TOKEN" "http://localhost:3000/api/patients/export?format=csv" -o patients.csv
```

### Dokumentacja Swagger

Otwórz `http://localhost:3000/docs` w przeglądarce (wymaga zalogowania).

---

## 🔄 Changelog

### v0.3.0 (2026-03-23) - Security Hardening & Code Quality

**CRITICAL Fixes:**
- ✅ **Secrets Rotation** - Removed all exposed API keys from .env, created secure .env.example
- ✅ **Rate Limit Fail-Safe** - Rate limiter now denies on error (fail-safe) instead of allowing
- ✅ **IDOR Mitigation** - Added userId tracking preparation for Patient ownership (schema ready)

**HIGH Fixes:**
- ✅ **Rate Limiting Coverage** - Added rate limiting to all API routes (chat, reports, checkins, goals, calendar)
- ✅ **Pagination Cap** - Plans route now caps limit at 100 to prevent memory exhaustion
- ✅ **Error Handling** - Added try-catch to users route and AppContext async functions
- ✅ **TypeScript Strict Mode** - Fixed all `any` types in goals page, checkin page, calendar route
- ✅ **API Type Safety** - Fixed type mismatches in reports, chat, and calendar routes
- ✅ **Dependency Updates** - Installed @types/nodemailer, ran npm audit fix

**MEDIUM Fixes:**
- ✅ **Error Propagation** - email.ts and openai.ts now properly propagate errors instead of silent failures
- ✅ **Immutable Updates** - Fixed direct state mutation in PlanBuilder.tsx (using map instead of forEach)

**Code Quality:**
- ✅ All TypeScript errors resolved (`npx tsc --noEmit` passes)
- ✅ Consistent error handling patterns across API routes
- ✅ Proper typing for React state and Prisma queries

### v0.2.0 (2026-02-26) - Security Update

**CRITICAL Fixes:**
- ✅ Pełna implementacja uwierzytelniania (Credentials Provider + requireAuth/requireAdmin)
- ✅ Middleware z wymuszaniem autoryzacji na wszystkich trasach
- ✅ Seed endpoint zabezpieczony (dev-only + admin auth)
- ✅ Utworzono `.env.example` z dokumentacją zmiennych

**HIGH Fixes:**
- ✅ Walidacja limitu paginacji (max 100)
- ✅ Ochrona CSV Injection w eksporcie danych
- ✅ XSS Protection w emailach (HTML escape)
- ✅ Zod walidacja przy tworzeniu użytkowników
- ✅ Blokada ustawiania roli przez klienta (tylko admin może tworzyć adminów)
- ✅ Limit długości wiadomości chat (2000 znaków)
- ✅ Security headers w next.config.ts (CSP, X-Frame-Options, etc.)
- ✅ Swagger docs wymaga autoryzacji
- ✅ Usunięcie nieużywany Postgres z docker-compose

**MEDIUM Fixes:**
- ✅ Naprawa mutacji Date w getWeekBounds()
- ✅ Usunięcie typów `any` w export/reports
- ✅ Zwiększenie min. długości hasła do 8 znaków
- ✅ HTTPS enforcement w middleware

**LOW Fixes:**
- ✅ Dynamiczny rok w copyright
- ✅ Emoji jako HTML entity w login page
- ✅ Obsługa JSON parse error w API

---

## 🤝 Contributing

Pull requesty są mile widziane! Przed wysłaniem PR upewnij się, że:
- Wszystkie testy przechodzą
- Kod jest sformatowany
- Nowe funkcje mają testy

---

## 📄 License

[MIT](LICENSE) © 2025-2026

---

<div align="center">

**Stworzone z ❤️ dla fizjoterapeutów**

</div>
