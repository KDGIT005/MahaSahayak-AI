# MahaSahayak AI 🕉️
**AI-Powered Volunteer Deployment Platform for Mahakumbh 2028**

> Built for Mahakumbh Innovation Hackathon 2028 · Expert Hire × VIT Bhopal

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Gemini AI](https://img.shields.io/badge/Gemini-3.5_Flash-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://typescriptlang.org)

---

## 🏆 Problem

Managing 50,000+ volunteers across 10+ critical zones during one of the world's largest religious gatherings is impossible without AI assistance. Skill mismatches, workload burnout, slow emergency response — MahaSahayak AI solves all of it.

## 💡 Solution

Real-time AI-powered platform with Google Gemini 3.5 Flash for:
- **Smart volunteer assignment** by skill, language, workload, and proximity
- **Emergency response** — AI finds nearest qualified responders in <3 seconds
- **Burnout prevention** — continuous workload monitoring and smart rotation
- **Natural language search** — "Find Hindi-speaking medical volunteers available now"

---

## 🚀 Key Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Assignment Engine** | Gemini matches volunteers to zones by skill, language, workload |
| 🚨 **Emergency Command Center** | AI deploys responders in <3 seconds with action plan |
| ⚖️ **Burnout Prevention** | Workload tracking with AI rotation suggestions |
| 🔍 **Natural Language Search** | Conversational volunteer search in English or Hindi |
| 🏆 **Bharat Ready Score™** | Composite readiness metric (skills + experience + availability) |
| 📊 **Real-time Dashboard** | Live zone heatmap, activity feed, workload charts |
| 🌐 **Bilingual UI** | Hindi/English toggle for all labels |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 |
| AI | Google Gemini 3.5 Flash |
| Charts | Recharts |
| Icons | Lucide React |
| State | React useState (+ optional Zustand) |

---

## 🎭 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@volunteerai.com | demo1234 |
| Zone Manager | manager@volunteerai.com | demo1234 |
| Volunteer | priya.verma@volunteerai.com | demo1234 |

---

## 🏃 Quick Start

```bash
# 1. Navigate to project
cd volunteerai

# 2. Install dependencies
npm install

# 3. Configure environment (edit .env.local)
# GEMINI_API_KEY is pre-configured

# 4. Start development server
npm run dev

# 5. Open in browser
# http://localhost:3000
```

---

## 📁 Project Structure

```
volunteerai/
├── app/
│   ├── admin/           # Admin dashboard + all sub-pages
│   ├── zone/            # Zone Manager portal
│   ├── volunteer/       # Volunteer self-service portal
│   ├── login/           # Auth page with role selection
│   ├── api/ai/          # 4 Gemini AI endpoints
│   └── page.tsx         # Landing page
├── components/
│   ├── dashboard/       # MetricCard, ActivityFeed, ZoneGrid
│   ├── volunteers/      # BharatScoreGauge, WorkloadBar
│   ├── zones/           # ZoneCard with pulse animations
│   └── ai/              # AIThinking loader
├── lib/
│   ├── demo-data.ts     # 30 volunteers + 10 zones seed data
│   └── gemini.ts        # Gemini API helper
└── types/index.ts       # Full TypeScript definitions
```

---

## 🤖 AI Endpoints

| Endpoint | Purpose |
|----------|---------|
| `POST /api/ai/assign` | Smart volunteer assignment by zone |
| `POST /api/ai/emergency` | Emergency responder deployment |
| `POST /api/ai/balance` | Workforce health analysis + burnout detection |
| `POST /api/ai/query` | Natural language volunteer search |

---

## 🎬 5-Minute Demo Script

1. **Landing page** — Animated hero, Hindi subtitle, live counters
2. **Admin Dashboard** — Zone heatmap, Sangam Ghat pulsing red, burnout alerts
3. **AI Optimize** — Click "AI Optimize All" → Gemini analyzes 30 volunteers
4. **Emergency Center** — Simulate medical emergency → AI deploys responders in 3s
5. **AI Engine** — Natural language search: "Find Hindi-speaking medical volunteers"
6. **Volunteer Portal** — Bharat Ready Score gauge animated

---

## 🏆 Innovation Highlights

- **Bharat Ready Score™** — Original composite metric combining skills breadth, experience, availability, language coverage, and workload penalty
- **Emergency Simulation Mode** — 3 pre-built realistic scenarios for live demos
- **Zone Risk Heatmap** — Pulsing CSS animations for critical zones
- **Workload Burnout Tracker** — Real-time burnout risk detection with AI rotation suggestions

---

*Built with ❤️ for Mahakumbh 2028 · Powered by Google Gemini AI*
