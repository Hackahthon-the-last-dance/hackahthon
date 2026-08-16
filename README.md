# HealthFlow — Preventive Health, Habit Momentum & Care Management

> **An intelligent preventive healthcare OS built with deterministic momentum tracking, recovery micro-wins, medication adherence, and interactive emergency care discovery.**

---

## 🌟 Overview

**HealthFlow** bridges the gap between daily lifestyle habits and clinical healthcare. Rather than punishing users with broken streaks and arbitrary scores, HealthFlow implements a **resilient deterministic momentum engine** with **Minimum Wins**, an interactive **Leaflet OpenStreetMap** care locator, explicit location permission workflows, and an instant **1-Tap Emergency SOS protocol**.

---

## 🚀 Key Features

### 1. Deterministic Health Momentum Engine
- Real-time composite score ($0–100\%$) dynamically reacting to habit completions, daily vitals, weekly adherence, and recovery wins.
- Transparent formula breakdown:
  $$\text{Score} = (\text{Habits } 40\%) + (\text{7-Day Consistency } 25\%) + (\text{Vitals } 20\%) + (\text{Recovery Wins } 15\%)$$

### 2. Zero Dead Buttons & Minimum Win Philosophy
- Every button, dropdown, toggle, modal, and action has a working real-time state update.
- **Recovery Mode**: Claim 1-click micro-actions (e.g. 5-minute stretch or 2 glasses of water) to preserve habit streaks when life gets busy.

### 3. Interactive Healthcare & Emergency Map
- Built with **Leaflet & OpenStreetMap** (zero paid API key dependency required).
- Interactive pins for **Trauma Hospitals**, **Primary Care Clinics**, **Urgent Care**, and **24/7 Pharmacies**.
- Live search, category filtering, click-to-center, and turn-by-turn **Directions Modal** (Driving, Transit, Walking).

### 4. Emergency Hub & Medical ID
- **1-Tap Emergency SOS** with 5-second cancelable countdown, automatic GPS coordinate transmission, and 911 hotline dial.
- Explicit Location Permission prompt (`[ Allow Location ]` or `[ Search Manually ]`) with graceful offline/denial fallbacks.
- Comprehensive **Medical ID** (Blood type, allergies, conditions, emergency contact).

### 5. Medication Adherence Tracker
- Daily schedules with **Mark Taken** (auto-decrements pill inventory), **Mark Skipped**, and **Refill (+30)** actions.
- Automatic low-stock warnings when below refill thresholds.

### 6. Appointments & Telehealth
- Auto-categorization of **Upcoming** vs **Past** appointments based on dates.
- Booking modal, rescheduling, cancellation, and encrypted telehealth room launchers.

### 7. 7-Day Visual Story & Analytics
- Narrative weekly comparison ($+24\%$ hydration, $+42\text{ min}$ sleep).
- Interactive day cards (Mon–Sun) with detailed modal drilldowns.
- PDF / JSON comprehensive medical report exporter.

### 8. Accessible Design System & Dark Mode
- Clinical luxury palette (Teal, Emerald, Slate) with zero cliché dark purple tropes.
- Full theme persistence, micro-animations, skeleton loaders, and celebratory confetti.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite
- **Icons**: Lucide React
- **Maps**: Leaflet & OpenStreetMap
- **Visuals & Micro-interactions**: Canvas Confetti, SVG Gauges & Charts
- **Design System**: Vanilla CSS Variables & Design Tokens (Light / Dark)

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 📄 License
MIT © 2026 HealthFlow Inc.
