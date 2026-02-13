<div align="center">

# 🏥 Rehab Planner

**Profesjonalna aplikacja dla fizjoterapeutów do zarządzania planami rehabilitacji**

[![Next.js](https://img.shields.io/badge/Next.js%2016-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React%2019-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS%204-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

[Demo](#-demo) • [Funkcje](#-funkcje) • [Instalacja](#-instalacja) • [Użycie](#-użycie)

</div>

---

## ✨ Funkcje

<table>
<tr>
<td width="50%">

### 📊 Dashboard
Statystyki na żywo, ostatnia aktywność, szybki dostęp do pacjentów i planów

</td>
<td width="50%">

### 👥 Pacjenci
Pełne CRUD, historia diagnoz, przypisane plany rehabilitacji

</td>
</tr>
<tr>
<td width="50%">

### 📑 Kreator Planów
Intuicyjny builder z tygodniami, dniami i ćwiczeniami

</td>
<td width="50%">

### 🏋️ Baza Ćwiczeń
30+ predefiniowanych ćwiczeń z kategoryzacją i filtrami

</td>
</tr>
</table>

---

## 🖼️ Zrzuty Ekranu

<div align="center">

| Dashboard | Baza Ćwiczeń |
|:---------:|:------------:|
| ![Dashboard](https://via.placeholder.com/400x250/0F172A/FFFFFF?text=📊+Dashboard) | ![Exercises](https://via.placeholder.com/400x250/0F172A/FFFFFF?text=🏋️+Ćwiczenia) |

| Kreator Planów | Pacjenci |
|:--------------:|:--------:|
| ![Plans](https://via.placeholder.com/400x250/0F172A/FFFFFF?text=📑+Kreator+Planów) | ![Patients](https://via.placeholder.com/400x250/0F172A/FFFFFF?text=👥+Pacjenci) |

</div>

---

## 🚀 Instalacja

```bash
# Sklonuj repozytorium
git clone https://github.com/WielkiKrzych/rehab-planner.git
cd rehab-planner

# Zainstaluj zależności
npm install

# Uruchom serwer deweloperski
npm run dev
```

Otwórz **[http://localhost:3000](http://localhost:3000)** w przeglądarce.

---

## 📖 Użycie

| Krok | Akcja | Opis |
|:----:|-------|------|
| 1️⃣ | **Dodaj pacjenta** | `Pacjenci` → `Dodaj pacjenta` → Wypełnij formularz |
| 2️⃣ | **Utwórz plan** | `Plany` → `Utwórz plan` → Dodaj tygodnie i ćwiczenia |
| 3️⃣ | **Przypisz pacjentowi** | Zapisz jako aktywny plan → Wybierz pacjenta |
| 4️⃣ | **Śledź postępy** | Dashboard → Statystyki |

---

## 🏗️ Architektura

```
src/
├── 📂 app/                    # Next.js App Router
│   ├── 📂 patients/           # Zarządzanie pacjentami
│   ├── 📂 plans/              # Kreator planów
│   ├── 📂 exercises/          # Baza ćwiczeń
│   └── 📂 stats/              # Statystyki
│
├── 🧩 components/             # React Components
│   ├── 📂 layout/             # Layout & Sidebar
│   ├── 📂 patients/           # Komponenty pacjentów
│   ├── 📂 plans/              # Komponenty planów
│   └── 📂 exercises/          # Komponenty ćwiczeń
│
├── 🔄 context/                # React Context (State)
├── 📊 data/                   # Seed data (30 ćwiczeń)
├── 🛠️ lib/                    # Utilities & Storage
└── 📝 types/                  # TypeScript Types
```

---

## 🛠️ Tech Stack

| Warstwa | Technologia |
|---------|-------------|
| **Framework** | Next.js 16 (App Router) |
| **UI** | React 19 + Tailwind CSS 4 |
| **Język** | TypeScript |
| **Storage** | localStorage (bez backendu) |
| **State** | React Context + Hooks |

---

## 📱 Responsywność

Aplikacja w pełni responsywna:

- 🖥️ **Desktop** - Pełny sidebar, szerokie karty
- 📱 **Mobile** - Hamburger menu, zoptymalizowane widoki

---

## 🤝 Contributing

Pull requesty są mile widziane! Dla większych zmian otwórz najpierw issue.

---

## 📄 License

[MIT](LICENSE) © 2025

---

<div align="center">

**Stworzone z ❤️ dla fizjoterapeutów**

[⬆ Powrót na górę](#-rehab-planner)

</div>
