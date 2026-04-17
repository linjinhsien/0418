# Implementation Plan: Climber App

## Overview

Incremental implementation following the layered architecture: shared utilities first, then data layer, domain layer, and finally UI screens. Each step builds on the previous and is wired together before moving on.

**Stack**: React 18 + Vite + TypeScript + Firebase Firestore + Gemini API (`gemini-2.0-flash`) + react-i18next + Recharts + Vitest

---

## Tasks

- [ ] 1. Project setup and shared foundations
  - Confirm Vite + React + TypeScript project is initialized
  - Verify dependencies: `firebase`, `@google/generative-ai`, `react-i18next`, `recharts`, `uuid`, `fast-check` (dev), `vitest`, `@testing-library/react`
  - Confirm directory structure: `src/climbs/`, `src/dashboard/`, `src/suggestions/`, `src/profile/`, `src/shared/`, `src/services/`, `src/navigation/`
  - Confirm `VITE_GEMINI_API_KEY` is set in `.env.local`
  - _Requirements: 8.1–8.6, 10.1–10.2_

- [ ] 2. Shared utilities — GradeUtils and error types
  - [ ] 2.1 Implement `src/shared/utils/gradeUtils.ts`
    - Implement `classifyGrade(grade: string): GradeResult` using V-scale regex `/^[Vv](1[0-7]|[0-9])$/` and YDS regex `/^5\.(1[0-5][a-d]?|[0-9])$/`
    - Return `{ gradeSystem, gradeWarning }` — never throw
    - _Requirements: 6.1–6.4_
  - [ ] 2.2 Write property tests for GradeUtils (Vitest + fast-check)
    - Property 1: total/exhaustive — any string returns one of three values, never throws
    - Property 2: unknown grades always carry a warning
    - Property 3: valid grades never carry a warning
    - _Requirements: 6.2–6.4_
  - [ ] 2.3 Implement `src/shared/types/errorTypes.ts`
    - Define `SuggestionError = 'api_error' | 'offline' | 'no_history'`
    - _Requirements: 4.4–4.6_

- [ ] 3. Firebase / Firestore setup
  - [ ] 3.1 Implement `src/services/firebase.ts`
    - Initialize Firebase app with project config
    - Export Firestore `db` instance
    - _Requirements: 8.6_
  - [ ] 3.2 Implement `src/services/firestoreCollections.ts`
    - Define typed collection references: `climbsCollection`, `userProfileDoc`
    - _Requirements: 1.1, 5.1_

- [ ] 4. Data layer — ClimbsRepository and ProfileRepository
  - [ ] 4.1 Implement `src/climbs/climbsRepository.ts`
    - `insert(climb: Climb): Promise<void>` — write to Firestore `climbs` collection
    - `findAll(): Promise<Climb[]>` — read all, sorted by date descending
    - _Requirements: 1.1, 2.1_
  - [ ] 4.2 Implement `src/profile/profileRepository.ts`
    - `get(): Promise<UserProfile | null>` and `save(profile: UserProfile): Promise<void>` using singleton document id
    - _Requirements: 5.1, 5.2_
  - [ ] 4.3 Write unit tests for repositories (mock Firestore)
    - _Requirements: 1.1, 5.1_

- [ ] 5. Checkpoint — Ensure all tests pass
  - Run `npm test` — all tests pass
  - Run `tsc --noEmit` — no TypeScript errors

- [ ] 6. Domain layer — ClimbsService
  - [ ] 6.1 Implement `src/climbs/climbsService.ts`
    - `addClimb(input: ClimbInput): Promise<Climb>`: validate required fields, call `GradeUtils.classifyGrade`, assign UUID + `createdAt`, persist via `ClimbsRepository`
    - `getClimbs(): Promise<Climb[]>`: delegate to `ClimbsRepository.findAll`
    - _Requirements: 1.1–1.7_
  - [ ] 6.2 Write unit tests for ClimbsService
    - Missing required fields rejected
    - UUID and createdAt assigned on every new climb
    - Grade classification delegated to GradeUtils
    - _Requirements: 1.5–1.7_

- [ ] 7. Domain layer — StatsAggregator
  - [ ] 7.1 Implement `src/dashboard/statsAggregator.ts`
    - Pure `compute(climbs: Climb[]): ClimbStats` returning `totalClimbs`, `totalSends`, `totalAttempts`, `byGrade`
    - No writes, no side effects
    - _Requirements: 3.1–3.4_
  - [ ] 7.2 Write property tests for StatsAggregator
    - Property 5: stats consistent with climb list
    - Property 6: byGrade sum equals totalClimbs
    - _Requirements: 3.1–3.3_
  - [ ] 7.3 Write unit tests: empty list → all zeros
    - _Requirements: 3.5_

- [ ] 8. Domain layer — SuggestionsService and GeminiClient
  - [ ] 8.1 Implement `src/suggestions/geminiClient.ts`
    - `complete(systemInstruction: string, userPrompt: string): Promise<string>` using `@google/generative-ai` with `gemini-2.0-flash`
    - Read API key from `import.meta.env.VITE_GEMINI_API_KEY`
    - _Requirements: 4.1, 10.1, 10.3_
  - [ ] 8.2 Implement `src/suggestions/suggestionsService.ts`
    - Check network state; return `{ status: 'error', error: 'offline' }` if offline
    - Check climb history; return `{ status: 'error', error: 'no_history' }` if empty
    - Construct prompt with system instruction; return `{ status: 'error', error: 'api_error' }` on failure
    - Never persist responses
    - _Requirements: 4.1–4.6, 4.9_
  - [ ] 8.3 Write property tests (Property 7: offline→no API call, Property 8: suggestions never persisted)
  - [ ] 8.4 Write unit tests: api_error, no_history, system instruction always included

- [ ] 9. Checkpoint — Ensure all tests pass
  - Run `npm test` — all tests pass

- [ ] 10. Localisation — react-i18next zh-TW
  - [ ] 10.1 Implement `src/shared/i18n/index.ts`
    - Init react-i18next, detect browser locale, default to zh-TW, fallback to en
    - _Requirements: 9.1–9.3_
  - [ ] 10.2 Create `src/shared/i18n/zh-TW.json` and `src/shared/i18n/en.json`
    - All user-facing strings for ClimbForm, ClimbList, Dashboard, SuggestionsScreen, ProfileScreen
    - _Requirements: 9.4_
  - [ ] 10.3 Write property test: `t(key)` never returns null/empty for any key + locale (Property 9)
  - [ ] 10.4 Write unit test: zh-TW routing and English fallback
    - _Requirements: 9.5_

- [ ] 11. UI layer — ClimbForm and ClimbList
  - [ ] 11.1 Implement `src/climbs/ClimbForm.tsx`
    - Fields: routeName, grade, date, result (sent/attempt), optional location + notes
    - Inline validation errors; gradeWarning indicator (non-blocking)
    - On submit: call `ClimbsService.addClimb`; all labels via `t()`
    - _Requirements: 1.1, 1.5, 6.5, 9.2_
  - [ ] 11.2 Implement `src/climbs/ClimbList.tsx`
    - Fetch on mount via `ClimbsService.getClimbs`; render name/grade/date/result; empty-state via `t()`
    - _Requirements: 2.1–2.3, 9.2_
  - [ ] 11.3 Write unit tests for ClimbForm validation
    - _Requirements: 1.5_

- [ ] 12. UI layer — Dashboard
  - [ ] 12.1 Implement `src/dashboard/Dashboard.tsx`
    - Fetch climbs, pass to StatsAggregator, render stats + Recharts grade breakdown
    - Zero-state when no climbs; all labels via `t()`
    - _Requirements: 3.1–3.5, 9.2_

- [ ] 13. UI layer — SuggestionsScreen
  - [ ] 13.1 Implement `src/suggestions/SuggestionsScreen.tsx`
    - Inputs: maxGrade, style (pre-filled from UserProfile, not auto-submitted)
    - Error banners for `api_error`, `offline`, `no_history`; offline banner while offline
    - All text via `t()`
    - _Requirements: 4.3, 4.7–4.8, 4.10, 9.2_
  - [ ] 13.2 Write unit tests: correct banner per error type, pre-fill without auto-submit

- [ ] 14. UI layer — ProfileScreen
  - [ ] 14.1 Implement `src/profile/ProfileScreen.tsx`
    - Load/save via ProfileRepository; editable fields; placeholder text when empty
    - No AI calls; all labels via `t()`
    - _Requirements: 5.1–5.4, 9.2_

- [ ] 15. Navigation
  - [ ] 15.1 Implement `src/navigation/AppNavigator.tsx`
    - Tab/route structure: Climbs, Dashboard, Suggestions, Profile
    - Tab labels via `t()`
    - _Requirements: 8.1_

- [ ] 16. Final checkpoint — All tests pass, TypeScript clean
  - `npm test --coverage` — all pass
  - `tsc --noEmit` — no errors
  - `npm run dev` — app starts, all screens functional
  - WCAG 2.1 AA colour contrast verified (SC-005)
  - No inline styles (SC-006)

---

## Notes

- All tasks are required — comprehensive testing from the start
- Property tests use `fast-check` with minimum 100 iterations each
- Firestore calls in tests must be mocked (no real network calls in unit tests)
- `import.meta.env.VITE_GEMINI_API_KEY` is the canonical API key access pattern
