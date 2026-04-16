# Climber App Development Guidelines

Auto-generated from feature plans. Last updated: 2026-04-17T00:15:00+08:00

## Active Technologies

| Category | Technology | Version |
|---|---|---|
| Language | TypeScript | 5.x |
| Frontend | React (Vite) | 18.x |
| AI | @google/generative-ai | Gemini 3.0 (Flash) |
| Orchestration | Agent DevelopKit / Semantic Kernel JS | — |
| Backend | Google Cloud Platform (GCP) | Cloud Run / Firestore |
| Styles | Vanilla CSS (Modern) | — |
| Charts | Recharts / Chart.js | — |
| i18n | react-i18next + i18next | — |
| Testing | Vitest + React Testing Library | — |

## Project Structure

```text
src/
├── components/       # Reusable UI components
├── features/         # Feature-based architecture
│   ├── climbs/       # Climb logging and history
│   ├── dashboard/    # Progress stats and charts
│   ├── suggestions/  # Gemini-powered AI suggestions
│   └── profile/      # User profile management
├── services/         # API clients (GCP/Gemini)
├── store/            # State management (Context/Zustand)
├── shared/           # Utils, i18n, types
│   ├── utils/
│   ├── i18n/
│   └── types/
└── App.tsx           # Main application entry
```

## Architecture Rules

- UI layer MUST NOT import from Data layer directly — all data flows through Services/Domain layer
- `shared/` MUST NOT import from any feature module
- `features/dashboard/` MUST NOT write or mutate Climb data directly
- `features/suggestions/` MUST NOT persist data — use dedicated services
- Grade validation MUST live exclusively in `shared/utils/gradeUtils.ts`
- Backend interactions MUST be abstracted via `services/`

## Code Style

- TypeScript strict mode enabled
- All user-facing strings via `t()` from `i18n` — no hardcoded strings
- Error states as typed values, never raw exceptions
- Traditional Chinese (zh-TW) Taiwan conventions for documentation and UI

## Recent Changes

- **Stack Update** (2026-04-17): Migrated from React Native (Expo) to React (Web) + GCP Backend.
- **AI Upgrade**: Switched to Gemini 3.0 (Flash) with support for Agent DevelopKit / Semantic Kernel JS.
- **Backend**: Integrated GCP (Firestore/Cloud Run) for data persistence.

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->

