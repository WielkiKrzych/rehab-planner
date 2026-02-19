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
- ✅ **Rate limiting** - Ochrona przed atakami (100 req/min)
- ✅ **CORS** - Konfigurowalne zasady CORS
- ✅ **Zod validation** - Walidacja danych na serwerze
- ✅ **Middleware** - Ochrona wszystkich tras

---

## ✨ Funkcje

| Funkcja | Opis |
|---------|------|
| 📊 Dashboard | Statystyki na żywo, ostatnia aktywność |
| 👥 Pacjenci | Pełne CRUD, historia diagnoz, plany rehabilitacji |
| 📑 Kreator Planów | Builder z tygodniami, dniami i ćwiczeniami |
| 🏋️ Baza Ćwiczeń | 30+ ćwiczeń z kategoryzacją i filtrami |
| 🔍 Wyszukiwanie | Szukaj pacjentów i ćwiczeń w czasie rzeczywistym |
| 🐳 Docker | Uruchom w kontenerze jednym poleceniem |

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
│   ├── patients/          # Patients pages
│   ├── plans/             # Plans pages
│   ├── exercises/         # Exercises page
│   └── login/             # Login page
├── components/            # React Components
├── context/               # React Context
├── lib/                   # Utilities
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
| Testing | Vitest + React Testing Library |
| Docker | Dockerfile + docker-compose |
| CI/CD | GitHub Actions |

---

## 🧪 Testowanie

```bash
npm run test
npm run test:ui
npm run test:coverage
```

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
