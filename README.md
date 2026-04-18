# 攀岩夥伴應用程式 (Climber App)
<img width="1602" height="625" alt="image" src="https://github.com/user-attachments/assets/cdde20f6-fb0f-458b-a1c4-c22c0c98f5aa" />
<img width="1566" height="905" alt="image" src="https://github.com/user-attachments/assets/4fae9f23-0e10-493d-a3a3-dedbdffa5b31" />
<img width="1860" height="841" alt="image" src="https://github.com/user-attachments/assets/36e5e34f-4e1b-4004-a60a-a7ebee7be93f" />
<img width="1791" height="944" alt="image" src="https://github.com/user-attachments/assets/c432297e-cdfa-434d-b272-276d1f76e70e" />


<img width="1584" height="877" alt="image" src="https://github.com/user-attachments/assets/a5aa9109-1fb1-4f90-b2b8-906804974f23" />


> AI-powered climbing companion — log routes, track progress, and get Gemini-powered suggestions.

**Branch**: `001-climber-app` | **Started**: 2026-04-14 | **Last updated**: 2026-04-18

---

## Overview

A React web app that helps climbers:
- **Log climbs** — route name, grade, date, location, result, notes
- **Track progress** — grade trend charts and success rate dashboard
- **Get AI suggestions** — Gemini 3.0 Flash generates personalized route recommendations
- **Map integration** — Google Maps Places API for gym location tagging

Data is persisted in **Firebase Firestore** (project: `solar-curve-490711-p4`).

---

## Tech Stack

| Category | Technology |
|---|---|
| Language | TypeScript 5.x (strict mode) |
| Framework | React 18 + Vite 5 |
| AI | `@google/generative-ai` — Gemini 3.0 Flash (`gemini-2.5-flash`) |
| AI Orchestration | Semantic Kernel + AgentDevelopKit |
| AI Backend | `@firebase/vertexai` — Vertex AI for Firebase |
| Database | Firebase Firestore |
| Maps | `@vis.gl/react-google-maps` + Places API (New) |
| Charts | Recharts |
| i18n | react-i18next (zh-TW default, en fallback) |
| Animations | framer-motion |
| Testing | Vitest + React Testing Library + fast-check |

---

## Project Structure

```
src/
├── App.tsx
├── main.tsx
├── index.css
├── components/
│   ├── ClimbMap.tsx          # Google Maps visualization
│   ├── Layout.tsx
│   ├── Navigation.tsx        # Tab navigation
│   └── PlaceAutocomplete.tsx # Gym location search
├── climbs/
│   ├── ClimbForm.tsx         # Log a climb form
│   ├── ClimbList.tsx         # Climb history list
│   ├── climbsService.ts      # Business logic + validation
│   ├── climbsRepository.ts   # Firestore CRUD
│   └── types.ts              # Climb / ClimbInput interfaces
├── dashboard/
│   ├── Dashboard.tsx         # LineChart + PieChart (Recharts)
│   └── statsAggregator.ts    # Pure stats computation
├── suggestions/
│   ├── SuggestionsScreen.tsx # AI suggestion UI + streaming
│   ├── suggestionsService.ts # Context builder + error handling
│   ├── geminiClient.ts       # Gemini SDK wrapper
│   ├── orchestrator.ts       # Semantic Kernel orchestrator
│   └── kernel/skills.ts
├── profile/
│   ├── ProfileScreen.tsx
│   └── profileRepository.ts  # user_profile/singleton in Firestore
└── shared/
    ├── firebase.ts            # Firebase app init
    ├── db.ts                  # FirestoreDB abstraction
    ├── gradeUtils.ts          # V-scale / YDS validation
    ├── errorTypes.ts
    └── i18n/                  # zh-TW + en translations
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Firebase project with Firestore enabled
- A Gemini API key from [aistudio.google.com](https://aistudio.google.com)
- A Google Maps API key with Places API (New) enabled

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.local.example .env.local
# Then edit .env.local:
```

```env
VITE_GEMINI_API_KEY=your_gemini_key_here
VITE_GOOGLE_MAPS_API_KEY=your_maps_key_here
```

### Run

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Build

```bash
npm run build
```

### Test

```bash
npm test          # run once
npm run test:watch  # watch mode
```

All 27+ unit tests should pass.

---

## Features

### US1 — Log a Climb (P1)
- Form with route name, grade (V-scale / YDS), date, location, result (sent/attempt), notes
- Required field validation with error messages
- Saves to Firestore, appears in history list sorted by date descending

### US2 — Progress Dashboard (P2)
- Grade trend LineChart over time
- Success rate PieChart per grade
- Empty state when no climbs logged

### US3 — AI Route Suggestions (P3)
- Input: max grade + preferred style (bouldering / sport / trad)
- Gemini 3.0 Flash returns 3+ route recommendations with reasoning
- Streaming UX — suggestions appear word by word
- Retry button on API failure
- Graceful offline error handling

### Maps
- Google Maps visualization of logged climb locations
- PlaceAutocomplete for gym search with fallback
- `locationId` persisted to Firestore

---

## Architecture Rules

- UI layer must NOT import from data layer directly — all data flows through services
- `shared/` must NOT import from any feature module
- Grade validation lives exclusively in `src/shared/gradeUtils.ts`
- All Firestore access via `src/shared/firebase.ts`
- All user-facing strings via `t()` from react-i18next — no hardcoded strings
- No inline styles

---

## Speckit Workflow

This project uses [speckit](https://github.com/speckit) for AI-assisted spec and implementation.

| Command | Description |
|---|---|
| `speckit.specify` | Create or update the feature spec |
| `speckit.plan` | Generate implementation plan |
| `speckit.tasks` | Generate dependency-ordered task list |
| `speckit.implement` | Execute tasks |
| `speckit.analyze` | Cross-artifact consistency check |
| `speckit.checklist` | Requirements quality checklist |
| `speckit.daily-report` | Generate daily progress report |

Spec source of truth: `specs/001-climber-app/`

---

## Development History

| Date | Milestone |
|---|---|
| 2026-04-14 | Project init, speckit setup, Climber spec created; explored folder structure; fixed git push issues |
| 2026-04-15 | Spec refined with #zhtw rules, PRs #1/#3/#4/#5 merged; Vertex AI / Gemini auth configured; API key replaced |
| 2026-04-16 | tasks.md and plan.md established; kiro prompts added; merged to main; listed all agents; shared login data setup |
| 2026-04-17 | Full migration Expo → React Web + Vite; Phase 1–6 all complete; Firebase, Gemini, Maps integrated; 27 tests passing; fixed `npm run dev`; killed stale servers; renamed codex → `.coder`; speckit.implement ran; Issues #2/#3/#4 fixed |
| 2026-04-18 | Places API (New) upgrade, Semantic Kernel orchestrator, streaming UX, locationId persistence; Playwright installed; new branch created; daily reports generated |

### Unified Activity Log (Git + Gemini CLI + Kiro CLI — UTC+8)

| Time (UTC+8) | Source | Activity |
|---|---|---|
| 04-14 00:41 | git | Initial commit |
| 04-14 01:05 | git | Add specify init and tool folders |
| 04-14 01:07 | git | specify init for geminicli, codex, cursor, kiro-cli |
| 04-14 01:25 | git | Add Climber spec with speckit (kiro-cli) |
| 04-14 01:34 | git | Regenerate Climber spec.md using speckit template |
| 04-14 01:37 | git | Add visible docs folder with spec and constitution |
| 04-14 01:55 | git | speckit: init climber-app spec, plan, and frontend prototype |
| 04-14 02:31 | git | Address Codex review feedback on contrast and inline styles |
| 04-14 02:37 | git | chore: record repo cleanup and init tasks.md [M-001] |
| 04-14 02:43 | git | chore: remove redundant nested 0418 repo |
| 04-14 02:50 | git | security: move API key to global env, clear project .env |
| 04-14 03:06 | git | plan: expand tech stack — Vite, Zustand, React Router, Chart.js |
| 04-14 03:09 | git | docs: add #zhtw Taiwan terminology rules to constitution |
| 04-14 03:16 | git | speckit(specify): 精簡 spec/plan，套用 #zhtw 規範 |
| 04-14 03:29 | git | fix(spec): 移除重複驗收情境標題，清除行銷式 AI 字樣 |
| 04-14 | kiro | What is folder 0418 function |
| 04-14 | kiro | Why I cannot push git to remote |
| 04-14 | gemini | `update` — initial project setup |
| 04-15 10:06 | git | Merge PR #1, #3, #4, #5 — spec completeness, API key removal |
| 04-15 22:00 | git | docs: restore Chinese spec docs and align speckit versioning |
| 04-15 | kiro | Gemini already has Vertex AI setup |
| 04-15 | kiro | Release storage / change auth Gemini |
| 04-15 | kiro | Replace API key (nanobanana) |
| 04-16 05:30 | git | Merge remote-tracking branch origin/001-climber-app |
| 04-16 07:34 | git | add kiro prompts from speckit (×2) |
| 04-16 07:49 | git | add specskit .plan |
| 04-16 07:55 | git | add task |
| 04-16 | kiro | Git merge to main |
| 04-16 | kiro | List all agents |
| 04-16 | kiro | Use same login data across agents |
| 04-16 | gemini | `specify agent gemini` — Gemini agent specification |
| 04-17 08:12 | git | landingpage ok; add data; add 說明; update layout |
| 04-17 09:32 | git | add daily-report skill |
| 04-17 09:34 | git | docs: add daily report for 2026-04-17 |
| 04-17 10:33 | git | feat: integrate Firebase Firestore for cross-project data sharing |
| 04-17 10:36 | git | docs: add specification analysis report |
| 04-17 10:42 | git | chore: update tasks and plan to vite/firestore architecture |
| 04-17 10:43 | git | feat: complete foundational utils, types, and i18n (Phase 2) |
| 04-17 10:45 | git | feat: implement web-based climb logging with Firestore (Phase 3) |
| 04-17 11:19 | git | docs: update AGENTS.md, data-model.md, research.md, spec.md |
| 04-17 11:38 | git | fix: gradeUtils export + climbsService — all 27 tests pass |
| 04-17 11:40 | git | merge: resolve spec issues, fix tests (005) |
| 04-17 11:49 | git | feat: rewrite RN screens to React Web + tab navigation (006) |
| 04-17 | kiro | npm run dev fix |
| 04-17 | kiro | rename codex folder to `.coder` |
| 04-17 | kiro | speckit.implement — Phase 1–6 |
| 04-17 | gemini | Git status; delete untracked branch; git pull/push; run daily-report |
| 04-17 20:31 | git | Merge PR #40 — 001-climber-app |
| 04-17 20:32 | git | Delete codex and cursor directories |
| 04-17 23:20 | git | task(T002–T003): install core + dev dependencies |
| 04-17 23:21 | git | docs: mark Phase 1 tasks as completed |
| 04-17 23:22 | git | task(Phase2–6): all phases verified and completed |
| 04-17 23:31 | git | task(T007): configure Firebase apiKey via env variable |
| 04-17 23:40 | git | task(T007): deploy Firestore security rules via CLI |
| 04-17 23:45 | git | feat: update AGENTS.md with Semantic Kernel and AgentDevelopKit |
| 04-17 23:47 | git | feat: migrate AI engine to Vertex AI for Firebase |
| 04-17 23:48 | git | feat: integrate Felo Search RAG and AgentDevelopKit Persona |
| 04-17 23:50 | git | feat: enable Google Maps API (@vis.gl/react-google-maps) |
| 04-17 23:53 | git | feat: implement Google Maps Autocomplete for gym location |
| 04-18 00:05 | git | task(T031): fix React redeclaration + Vertex AI import paths |
| 04-18 00:18 | git | feat: enhance AI buttons + improve Google Maps location storage |
| 04-18 00:47 | git | feat(T032): locationId persistence, SK orchestrator, streaming UX |
| 04-18 01:16 | git | feat: complete Issues #2, #3, #4 — Map, SK orchestration, Streaming |
| 04-17 | kiro | Keep processing to fix issues #2/#3/#4 |
| 04-17 | kiro | Kill all running servers |
| 04-17 | gemini | Felo Search config; Firebase apiKey; Maps API; React/Vertex AI fixes; issues #2–#4 |
| 04-17 | gemini | Attempted `gemini-3.1-flash` model change |
| 04-18 10:03 | git | fix(maps): upgrade to Places API (New) and improve resilience |
| 04-18 14:10 | git | docs: sync AGENTS.md project structure with actual src files |
| 04-18 14:32 | git | 📚 docs(speckit/merge): cloudshell → main, sync AGENTS.md |
| 04-18 21:00 | git | feat: enhance Google Maps with search fallback + Semantic Kernel refactor |
| 04-18 21:38 | git | add firebase; 補spec文件 |
| 04-18 | kiro | Install Playwright CLI |
| 04-18 | kiro | New branch — waiting to fix |
| 04-18 | kiro | Daily reports (0414–0418) + README generation |
| 04-18 | gemini | Places API (New) upgrade; Maps debugging; server stopped |
| 04-18 | gemini | Browser MCP test; Playwright agentic UI testing reference |
| 04-18 | gemini | Daily reports 0414–now (UTC+8) generated |

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_GEMINI_API_KEY` | Yes | Gemini API key (from AI Studio) |
| `VITE_GOOGLE_MAPS_API_KEY` | Yes | Google Maps API key |

> Never commit `.env.local` — it is git-ignored.
