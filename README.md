<div align="center">

<img src="https://img.shields.io/badge/Mahakumbh-2028-FF6B00?style=for-the-badge&labelColor=1a1a2e" alt="Mahakumbh 2028"/>

# 🕉️ MahaSahayak AI

### *AI-Powered Volunteer Deployment Platform for Mahakumbh 2028*

<p align="center">
  <a href="https://maha-sahayak-ai.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/🌐%20Live%20Demo-Visit%20Now-brightgreen?style=for-the-badge" alt="Live Demo"/>
  </a>
  &nbsp;
  <a href="https://github.com/KDGIT005/MahaSahayak-AI" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github" alt="GitHub"/>
  </a>
</p>

<br/>

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-3.5_Flash-4285F4?style=flat-square&logo=google&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

<br/>

**Built for Mahakumbh Innovation Hackathon 2028** · Expert Hire × VIT Bhopal

*Crafted with ❤️ by **[Kuldeep Dhangad](https://github.com/KDGIT005)***

---

</div>

## 🧩 The Problem

Mahakumbh 2028 brings together **over 400 million pilgrims** — making it the largest peaceful gathering in human history. Behind the scenes, this event demands the coordinated effort of **50,000+ volunteers** spread across **10+ critical zones** including ghats, medical camps, crowd control corridors, and language assistance desks.

Without intelligent systems, this creates cascading challenges:

- **Skill mismatches** — Wrong volunteers assigned to wrong zones
- **Burnout** — Uneven workloads leading to fatigue and dropouts
- **Slow emergency response** — Manual searches costing precious seconds
- **Language gaps** — Pilgrims from 50+ languages unable to find help
- **No real-time visibility** — Coordinators flying blind with spreadsheets

---

## 💡 The Solution

**MahaSahayak AI** is a full-stack intelligent command platform that uses **Google Gemini 3.5 Flash** to bring real-time AI decision-making to volunteer management — making every second count.

<div align="center">

```
Volunteer Data  ──►  Gemini AI Engine  ──►  Smart Assignments
Zone Status     ──►  Risk Heatmap      ──►  Emergency Response
Workload Feed   ──►  Burnout Detector  ──►  Rotation Suggestions
Natural Query   ──►  NLP Search        ──►  Instant Results
```

</div>

---

## ✨ Feature Showcase

<table>
<tr>
<td width="50%">

### 🤖 AI Assignment Engine
Gemini analyses skill profiles, language coverage, current workload, and zone proximity to make optimal volunteer-to-zone assignments in real time — no human bias, no guesswork.

</td>
<td width="50%">

### 🚨 Emergency Command Center
When a crisis hits, the AI scans all available volunteers and deploys the most qualified responders with a full action plan — in **under 3 seconds**.

</td>
</tr>
<tr>
<td width="50%">

### ⚖️ Burnout Prevention System
Continuous workload monitoring flags volunteers at risk before they hit their limit. AI rotation suggestions ensure fair distribution and sustained performance across shifts.

</td>
<td width="50%">

### 🔍 Natural Language Search
Ask in plain English or Hindi — *"Find Hindi-speaking medical volunteers available now"* — and get instant, filtered results powered by conversational AI.

</td>
</tr>
<tr>
<td width="50%">

### 🏆 Bharat Ready Score™
An original composite metric — combining skills breadth, field experience, language coverage, availability window, and workload penalty — into a single readiness score unique to Indian mass-event deployment.

</td>
<td width="50%">

### 📊 Real-Time Zone Dashboard
A live heatmap with pulse animations for critical zones, an activity feed, workload charts, and zone-by-zone health monitoring — all updating in real time.

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 16 (App Router) | Full-stack React with server components |
| **Language** | TypeScript 5 | End-to-end type safety |
| **Styling** | Tailwind CSS v4 | Utility-first responsive design |
| **AI Engine** | Google Gemini 3.5 Flash | Assignment, emergency, search & analysis |
| **Charts** | Recharts | Workload and analytics visualizations |
| **Icons** | Lucide React | Consistent icon system |
| **Deployment** | Vercel | Edge-optimized global deployment |

---

## 🤖 AI Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/ai/assign` | `POST` | Smart volunteer-to-zone assignment by skill & proximity |
| `/api/ai/emergency` | `POST` | Crisis responder deployment with action plan |
| `/api/ai/balance` | `POST` | Workforce health analysis & burnout detection |
| `/api/ai/query` | `POST` | Natural language volunteer search (EN + HI) |

---

## 📁 Project Structure

```
MahaSahayak-AI/
├── app/
│   ├── admin/              # Admin dashboard & all sub-pages
│   ├── zone/               # Zone Manager portal
│   ├── volunteer/          # Volunteer self-service portal
│   ├── login/              # Auth page with role-based access
│   ├── api/ai/             # 4 Gemini-powered AI endpoints
│   └── page.tsx            # Animated landing page
│
├── components/
│   ├── dashboard/          # MetricCard, ActivityFeed, ZoneGrid
│   ├── volunteers/         # BharatScoreGauge, WorkloadBar
│   ├── zones/              # ZoneCard with pulse animations
│   └── ai/                 # AIThinking loader component
│
├── lib/
│   ├── demo-data.ts        # 30 volunteers + 10 zones seed data
│   └── gemini.ts           # Gemini API abstraction layer
│
└── types/
    └── index.ts            # Full TypeScript type definitions
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- A Google Gemini API Key — [Get one free](https://aistudio.google.com/app/apikey)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/KDGIT005/MahaSahayak-AI.git

# 2. Navigate into the project
cd MahaSahayak-AI

# 3. Install dependencies
npm install

# 4. Configure environment variables
cp .env.example .env.local
# Add your GEMINI_API_KEY to .env.local

# 5. Start the development server
npm run dev

# 6. Open in your browser
# → http://localhost:3000
```

---

## 🎭 Demo Access

| Role | Email | Password |
|------|-------|----------|
| 👑 Admin | `admin@volunteerai.com` | `demo1234` |
| 🗺️ Zone Manager | `manager@volunteerai.com` | `demo1234` |
| 🙋 Volunteer | `priya.verma@volunteerai.com` | `demo1234` |

**Try the [Live Demo →](https://maha-sahayak-ai.vercel.app/)**

---

## 🏆 Innovation Highlights

- **Bharat Ready Score™** — An original, purpose-built composite readiness metric for Indian mass-event volunteer management, combining 5 weighted dimensions into a single actionable number.
- **Emergency Simulation Mode** — 3 pre-built realistic disaster scenarios for compelling live demonstrations without real incidents.
- **Zone Risk Heatmap** — CSS pulse animations give instant visual priority to critical zones — no numbers needed, risk is visible at a glance.
- **Bilingual Interface** — Hindi/English toggle across all UI labels, making the platform accessible to coordinators across India.
- **Workload Burnout Tracker** — Proactive, not reactive — the system flags at-risk volunteers *before* burnout occurs, not after.

---

## 🌐 Live Deployment

The platform is live and fully functional at:

**[https://maha-sahayak-ai.vercel.app/](https://maha-sahayak-ai.vercel.app/)**

Deployed on Vercel's edge network for low-latency access across India.

---

## 👨‍💻 Author

<table>
<tr>
<td align="center">
<a href="https://github.com/KDGIT005">
<b>Kuldeep Dhangad</b><br/>
<sub>Full Stack & AI Developer</sub><br/>
<a href="https://github.com/KDGIT005">
<img src="https://img.shields.io/badge/GitHub-KDGIT005-181717?style=flat-square&logo=github"/>
</a>
</a>
</td>
</tr>
</table>

---

<div align="center">

**Built with ❤️ for Mahakumbh 2028**

*Mahakumbh Innovation Hackathon · Expert Hire × VIT Bhopal*

*Powered by Google Gemini AI · Deployed on Vercel*

</div>
