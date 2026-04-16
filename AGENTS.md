# Climber App Development Guidelines

Auto-generated from feature plans. Last updated: 2026-04-16T23:42:22+08:00

## Active Technologies

| Category | Technology | Version |
|---|---|---|
| Language | TypeScript | 5.x |
| Framework | React Native (Expo) | SDK 51+ |
| Router | Expo Router | file-based |
| State | Context API | — |
| Storage | expo-sqlite | v14+ |
| Charts | Victory Native (Skia) | v41+ |
| AI | @google/generative-ai | Gemini 1.5 Flash |
| Network | @react-native-community/netinfo | — |
| i18n | i18n-js + expo-localization | — |
| Testing | Jest + React Native Testing Library | — |
| Property tests | fast-check | — |

## Project Structure

```text
src/
├── climbs/
│   ├── ClimbForm.tsx
│   ├── ClimbList.tsx
│   ├── climbsRepository.ts
│   └── climbsService.ts
├── dashboard/
│   ├── Dashboard.tsx
│   └── statsAggregator.ts
├── suggestions/
│   ├── SuggestionsScreen.tsx
│   ├── suggestionsService.ts
│   └── geminiClient.ts
├── profile/
│   ├── ProfileScreen.tsx
│   └── profileRepository.ts
├── shared/
│   ├── gradeUtils.ts
│   ├── db.ts
│   ├── errorTypes.ts
│   └── i18n/
│       ├── index.ts
│       ├── en.ts
│       └── zh-TW.ts
└── navigation/
    └── AppNavigator.tsx

specs/001-climber-app/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── tasks.md
└── analysis.md
```

## Commands

```bash
# Install dependencies
npx expo install

# Start dev server
npx expo start

# Run tests
npx jest

# Run tests with coverage
npx jest --coverage

# Type check
npx tsc --noEmit

# Lint
npx eslint src/
```

## Architecture Rules

- UI layer MUST NOT import from Data layer directly — all data flows through Domain layer
- `shared/` MUST NOT import from any feature module (`climbs`, `dashboard`, `suggestions`, `profile`)
- `dashboard/` MUST NOT write or mutate Climb data
- `suggestions/` MUST NOT persist any data to SQLite
- `profile/` MUST NOT trigger Gemini API calls
- Grade validation MUST live exclusively in `shared/gradeUtils.ts`

## Code Style

- TypeScript strict mode enabled
- All user-facing strings via `t()` from `shared/i18n` — no hardcoded strings
- Error states as typed values (`SuggestionError`, `MigrationError`), never raw exceptions
- All components use `t()` for labels, buttons, error messages, and empty-state text
- Traditional Chinese (zh-TW) Taiwan conventions — see constitution vocabulary table

## Recent Changes

- **001-climber-app** (2026-04-16): Stack migrated from React Web + localStorage to React Native (Expo) + SQLite. Added: expo-sqlite versioned migrations, Victory Native charts, i18n-js zh-TW/en localization, offline resilience via netinfo, grade validation utility, UserProfile CRUD, Gemini suggestions with typed error states.

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
