# 🌿 NeuraSoil – AI-Powered Soil Prediction System

**By Abdulrahman Adisa Amuda**

An offline-first, AI-powered agritech platform developed for the **Africa Deep Tech Challenge 2025**. NeuraSoil empowers rural African farmers through predictive soil intelligence — even with no internet. It simulates underground water behavior, soil health, and crop suitability using edge computing and lightweight AI logic.

---

## 📌 Overview

NeuraSoil is built with modularity, low-resource performance, and offline capability in mind. It combines a React dashboard, TypeScript backend, in-memory database, and rule-based prediction logic — simulating an end-to-end edge-AI solution for underserved farming communities.

---

## 🧱 System Architecture

### 🖼 Frontend
- **React + Vite** – Fast dev experience
- **Tailwind CSS** – Utility-first styling with agri-based theme
- **Radix UI + shadcn/ui** – Accessible components
- **Wouter** – Lightweight routing
- **TanStack Query** – Data fetching and caching
- **Multi-language Support** – English, Yoruba, Hausa, Swahili, French

### 🔧 Backend
- **Express (ESM + TS)** – Modular REST API
- **Drizzle ORM + PostgreSQL** – Schema-safe data storage
- **Zod** – Runtime validation of inputs and DB operations
- **TSX + esbuild** – Hot reload dev, fast build for prod

### 🧠 Machine Learning Engine
- Rule-based mock prediction logic (resource-light)
- Provides:
  - Soil health evaluation
  - Water movement prediction
  - Crop suitability detection

---

## 🧠 Key Features

| Feature                    | Description |
|---------------------------|-------------|
| 🌡️ Sensor Simulation       | Generates realistic readings every 30s (moisture, pH, pressure, temp) |
| 🧠 AI Predictions         | Local prediction engine using rules/thresholds |
| 📈 Trend Insights         | View historic readings and predicted patterns |
| ⚠️ Alert System           | Triggered warnings and critical alerts |
| 🌐 Multi-language         | Yoruba, Hausa, Swahili, French, English |
| 📥 CSV Export             | Download sensor logs in `.csv` or `.json` |
| 🧰 Farmer Dashboard       | Designed for offline access, large fonts |

---

## 🌍 Intended Impact

NeuraSoil supports:
- **Rural farmers in low-connectivity zones**
- **Offline-first agricultural intelligence**
- **No reliance on external APIs**
- **Simulated mobile/edge computing behavior**

---

## 🗂 Folder Structure

<pre>
NeuraSoil/
├── backend/         → Express API routes and sensor prediction logic
├── client/          → React frontend (dashboard UI)
│   ├── src/
│   │   ├── components/      → Header, sensor cards, modals, etc.
│   │   ├── pages/           → Home and dashboard views
│   │   ├── hooks/           → Custom hooks like useSensorData
│   │   ├── lib/             → Query client, utils
├── ml/              → Rule-based prediction logic
├── simulator/       → Fake sensor data generator (30s loop)
├── server/          → Entry point that registers all routes
├── shared/          → Zod schemas shared across backend & frontend
├── .env             → Environment variables (local)
├── drizzle.config.ts → Drizzle ORM config for PostgreSQL
├── tailwind.config.ts → Theme + custom classes (farmer-friendly)
├── vite.config.ts   → Vite config for frontend
├── package.json     → Project dependencies
├── README.md        → Project documentation (this file)
</pre>

---

## 🔃 Data Flow

SensorService  
→ Drizzle + PostgreSQL  
→ Prediction Engine  
→ Alert System  
→ React Dashboard

---

## 🚀 Local Development Setup

1. Clone the repo  

git clone https://github.com/YOUR_USERNAME/neurasoil.git
cd neurasoil



2. Install dependencies  
npm install



3. Start backend API  
npm run dev:server

text

4. Start frontend  
cd client
npm run dev



Sensor readings and predictions auto-refresh every 30 seconds.

---

### 🧱 Production Deployment

Build frontend  
cd client && npm run build
cd ..

text

Bundle backend  
npm run build:server

text

Start backend + serve frontend  
node dist/index.js

text

Backend serves API and static assets in a single Node.js process.

---

## 🔌 External Dependencies

**Frontend**  
react, vite, tailwindcss, radix-ui, shadcn/ui  
lucide-react, wouter, clsx, class-variance-authority  
tanstack/react-query  

**Backend**  
express, zod, drizzle-orm, @neondatabase/serverless  
tsx, esbuild, json2csv, dotenv

---

## 🌐 Language Support

Supports localized insights and dashboard interface in:  
🇬🇧 English (default)  
🇳🇬 Yoruba  
🇳🇬 Hausa  
🇰🇪 Swahili  
🇫🇷 French  

Language preference is globally applied using React context + local state.

---

## 🙏 Acknowledgements

🌍 Africa Deep Tech Challenge 2025  
👨🏾‍🌾 Inspired by farmers living in offline conditions  
💚 Proprietary stack built exclusively to empower real-world agriculture as a solo project  
🧠 Edge AI for rural resilience and food security  

> "Technology is most powerful when it’s accessible offline, localized, and empowering those on the ground." — NeuraSoil

---

## 📄 License

© 2025 Abdulrahman Adisa Amuda

All rights reserved. This software and associated documentation files (the “Software”) are the exclusive property of Abdulrahman Adisa Amuda. No part of the Software may be copied, modified, distributed, sublicensed, or used for any purpose without explicit written permission from the copyright holder.

Unauthorized use, reproduction, or distribution of this Software is strictly prohibited.

---
