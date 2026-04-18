# Climber App Development Guidelines

Auto-generated from feature plans. Last updated: 2026-04-17T03:18:00+08:00

## Spec Source of Truth

**All agents MUST read from `specs/001-climber-app/` — do NOT read `.kiro/specs/climber-app/`.**

| Document | Path |
|----------|------|
| Feature spec | `specs/001-climber-app/spec.md` |
| Implementation plan | `specs/001-climber-app/plan.md` |
| Data model | `specs/001-climber-app/data-model.md` |
| Task list | `specs/001-climber-app/tasks.md` |
| Research | `specs/001-climber-app/research.md` |
| Analysis | `specs/001-climber-app/analysis-2026-04-17.md` |
| Checklists | `specs/001-climber-app/checklists/` |

## Active Technologies

| Category | Technology | Version |
|---|---|---|
| Language | TypeScript | 5.x (strict mode) |
| Frontend | React + Vite | 18.x |
| AI | @google/generative-ai | gemini-2.0-flash (Gemini 3.0 Flash) |
| Backend / DB | Firebase Firestore | — |
| Styles | Vanilla CSS | No inline styles |
| Charts | Recharts | — |
| i18n | react-i18next | zh-TW default, en fallback |
| Testing | Vitest + React Testing Library + fast-check | — |

## Environment Variables

| Variable | Required | Notes |
|----------|----------|-------|
| `VITE_GEMINI_API_KEY` | Yes | Set in `.env.local` (git-ignored) |
| `FELO_API_KEY` | Yes | Required for Felo Search skill (git-ignored) |

## Felo Search Configuration

- **Script Path**: `.gemini/skills/felo-search/scripts/felo_search.cjs`
- **Key Note**: 2026-04-17 Fixed JSON parsing to handle `data.data` nested structure and `res.link` mapping.
| AI | @google/generative-ai | Gemini 3.0 Flash (2.0-flash experimental) |
| Search | Felo Search API | V2 (Optimized) |
| Maps | @vis.gl/react-google-maps | 2026 Recommended |
| Orchestration | Semantic Kernel / AgentDevelopKit | 2026 Core |

## AI Agent Implementation Guidelines (2026)

- **Geo-Awareness**: Use **Google Maps API** for precise gym location tagging and distance-based route suggestions.
- **Orchestration**: Prefer **Semantic Kernel** for managing complex goal-oriented tasks.
- **Development Kit**: Use **AgentDevelopKit** standard patterns for agent personality and memory management.
- **Backend Integration**: Prefer **Vertex AI for Firebase** over client-side direct calls to protect API keys.
- **Search Augmented**: Integrate **Felo Search** for real-time climbing route status and local gym news.
- **Structured Output**: Always set `responseMimeType: "application/json"` in `generationConfig`.
## Actual Project Structure

```text
src/
├── App.tsx
├── main.tsx
├── index.css
├── vite-env.d.ts
├── components/
│   ├── ClimbMap.tsx
│   ├── Layout.tsx
│   ├── Navigation.tsx
│   ├── PlaceAutocomplete.tsx
│   └── __tests__/PlaceAutocomplete.test.tsx
├── climbs/
│   ├── ClimbForm.tsx
│   ├── ClimbList.tsx
│   ├── climbsService.ts
│   ├── climbsRepository.ts
│   ├── types.ts
│   └── __tests__/climbsService.test.ts
├── dashboard/
│   ├── Dashboard.tsx
│   ├── statsAggregator.ts
│   └── __tests__/statsAggregator.test.ts
├── suggestions/
│   ├── SuggestionsScreen.tsx
│   ├── suggestionsService.ts
│   ├── geminiClient.ts
│   ├── orchestrator.ts
│   ├── kernel/
│   │   └── skills.ts
│   └── __tests__/suggestionsService.test.ts
├── profile/
│   ├── ProfileScreen.tsx
│   └── profileRepository.ts
├── shared/
│   ├── firebase.ts
│   ├── gradeUtils.ts
│   ├── errorTypes.ts
│   ├── db.ts
│   ├── i18n/
│   │   ├── index.ts
│   │   ├── zh-TW.ts
│   │   └── en.ts
│   └── __tests__/
│       ├── gradeUtils.test.ts
│       └── i18n.test.ts
└── test/
    └── setup.ts
```

## Architecture Rules

- UI layer MUST NOT import from Data layer directly — all data flows through Services/Domain layer
- `shared/` MUST NOT import from any feature module
- `dashboard/` MUST NOT write or mutate Climb data directly
- `suggestions/` MUST NOT persist data — use dedicated services
- Grade validation MUST live exclusively in `src/shared/gradeUtils.ts`
- Backend interactions MUST be abstracted via `services/` or repository modules
- All Firestore access via `src/shared/firebase.ts`

## Code Style

- TypeScript strict mode enabled
- All user-facing strings via `t()` from react-i18next — no hardcoded strings
- Error states as typed values, never raw exceptions
- Traditional Chinese (zh-TW) Taiwan conventions for documentation and UI
- No inline styles (SC-006)

## Recent Changes

- **2026-04-17**: Migrated from React Native (Expo) to React Web + Vite + Firebase Firestore.
- **2026-04-17**: AI model unified to `gemini-2.0-flash` (Gemini 3.0 Flash).
- **2026-04-17**: Spec source of truth clarified — use `specs/001-climber-app/` only.
- **2026-04-17**: `VITE_GEMINI_API_KEY` set in `.env.local`.

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
