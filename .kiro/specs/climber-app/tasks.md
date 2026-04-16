# Implementation Plan: Climber App

## Overview

Incremental implementation following the layered architecture: shared utilities first, then data layer, domain layer, and finally UI screens. Each step builds on the previous and is wired together before moving on.

## Tasks

- [ ] 1. Project setup and shared foundations
  - Initialize Expo + React Native project with TypeScript
  - Install dependencies: `expo-sqlite`, `expo-localization`, `expo-network`, `react-navigation`, `uuid`, `fast-check` (dev)
  - Create directory structure: `src/climbs`, `src/dashboard`, `src/suggestions`, `src/profile`, `src/shared`, `src/navigation`
  - _Requirements: 8.1–8.6_

- [ ] 2. Shared utilities — GradeUtils and error types
  - [ ] 2.1 Implement `src/shared/gradeUtils.ts`
    - Implement `classifyGrade(grade: string): GradeResult` using V-scale regex `/^[Vv](1[0-7]|[0-9])$/` and YDS regex `/^5\.(1[0-5][a-d]?|[0-9])$/`
    - Return `{ gradeSystem, hasWarning }` — never throw
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  - [ ]* 2.2 Write property tests for GradeUtils
    - **Property 1: Grade classification is total and exhaustive** — for any string, classifyGrade returns one of three values and never throws
    - **Property 2: Unknown grades always carry a warning** — for any non-V-scale, non-YDS string, hasWarning is true
    - **Property 3: Valid grades never carry a warning** — for any valid V-scale or YDS string, hasWarning is false
    - _Requirements: 6.2, 6.3, 1.4_
  - [ ] 2.3 Implement `src/shared/errorTypes.ts`
    - Define `SuggestionError`, `MigrationError` types
    - _Requirements: 4.4, 4.5, 10.3_

- [ ] 3. Database setup and migrations
  - [ ] 3.1 Implement `src/shared/db.ts`
    - Open SQLite database via `expo-sqlite`
    - Define migration runner: reads `schema_migrations`, applies pending migrations in ascending version order, surfaces `MigrationError` and halts on failure
    - Register v1 migration: create `climbs`, `user_profile`, `schema_migrations` tables
    - _Requirements: 10.1, 10.2, 10.3_
  - [ ]* 3.2 Write property test for migration idempotence
    - **Property 10: Migration idempotence** — running the migration runner twice does not re-apply already-applied migrations
    - _Requirements: 10.2_
  - [ ]* 3.3 Write unit test for migration halt-on-failure
    - Verify that when a migration throws, subsequent migrations do not run
    - _Requirements: 10.3_

- [ ] 4. Data layer — ClimbsRepository and ProfileRepository
  - [ ] 4.1 Implement `src/climbs/climbsRepository.ts`
    - Implement `insert(climb: Climb): Promise<void>` and `findAll(): Promise<Climb[]>`
    - _Requirements: 1.1, 2.1_
  - [ ] 4.2 Implement `src/profile/profileRepository.ts`
    - Implement `get(): Promise<UserProfile | null>` and `save(profile: UserProfile): Promise<void>` using singleton id
    - _Requirements: 5.1, 5.2_
  - [ ]* 4.3 Write property test for climb persistence round-trip
    - **Property 4: Climb persistence round-trip** — for any valid ClimbInput, addClimb then getClimbs returns a list containing the climb
    - _Requirements: 1.1, 2.1_
  - [ ]* 4.4 Write property test for profile round-trip
    - **Property (profile): save then get returns the same UserProfile**
    - _Requirements: 5.1_

- [ ] 5. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Domain layer — ClimbsService
  - [ ] 6.1 Implement `src/climbs/climbsService.ts`
    - Implement `addClimb(input: ClimbInput): Promise<Climb>`: validate required fields, call `GradeUtils.classifyGrade`, assign UUID and `createdAt`, persist via `ClimbsRepository`
    - Implement `getClimbs(): Promise<Climb[]>`: delegate to `ClimbsRepository.findAll`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_
  - [ ]* 6.2 Write unit tests for ClimbsService validation
    - Test rejection of missing required fields (routeName, grade, date, result)
    - Test that UUID and createdAt are assigned on every new climb
    - _Requirements: 1.5, 1.6, 1.7_

- [ ] 7. Domain layer — StatsAggregator
  - [ ] 7.1 Implement `src/dashboard/statsAggregator.ts`
    - Implement `compute(climbs: Climb[]): ClimbStats`
    - Return `totalClimbs`, `totalSends`, `totalAttempts`, `byGrade`
    - Must be pure — no writes, no side effects
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  - [ ]* 7.2 Write property tests for StatsAggregator
    - **Property 5: Stats are consistent with climb list** — totalClimbs, totalSends, totalAttempts match list counts
    - **Property 6: Grade breakdown covers all climbs** — sum of byGrade values equals totalClimbs
    - _Requirements: 3.1, 3.2, 3.3_
  - [ ]* 7.3 Write unit tests for StatsAggregator edge cases
    - Empty list returns all zeros
    - Single climb of each result type
    - _Requirements: 3.5_

- [ ] 8. Domain layer — SuggestionsService and GeminiClient
  - [ ] 8.1 Implement `src/suggestions/geminiClient.ts`
    - Implement `complete(systemInstruction: string, userPrompt: string): Promise<string>` using Gemini API
    - _Requirements: 4.1, 4.2_
  - [ ] 8.2 Implement `src/suggestions/suggestionsService.ts`
    - Check network state via `expo-network` before calling GeminiClient; return `{ error: 'offline' }` if offline
    - Check climb history; return `{ error: 'no_history' }` if empty
    - Construct prompt with system instruction capping response to route suggestions
    - Return `{ error: 'api_error' }` on GeminiClient failure
    - Never persist responses
    - _Requirements: 4.1, 4.2, 4.4, 4.5, 4.6, 4.9_
  - [ ]* 8.3 Write property tests for SuggestionsService error states
    - **Property 7: Offline state prevents Gemini calls** — when offline, returns `{ error: 'offline' }` and GeminiClient is not invoked
    - **Property 8: Suggestions are never persisted** — after any getSuggestions call, SQLite contains no suggestion data
    - _Requirements: 4.4, 4.9_
  - [ ]* 8.4 Write unit tests for SuggestionsService
    - api_error on GeminiClient throw
    - no_history when climb list is empty
    - System instruction is always included in prompt
    - _Requirements: 4.2, 4.5, 4.6_

- [ ] 9. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Localization
  - [ ] 10.1 Implement `src/shared/localization.ts`
    - Implement `getLocale(): Locale` using `expo-localization`; return `'zh-TW'` if device locale matches, else `'en'`
    - Implement `t(key: string): string`; look up key in active locale JSON, fall back to `en.json` if missing
    - _Requirements: 9.1, 9.2, 9.3, 9.5_
  - [ ] 10.2 Create `src/shared/locales/en.json` and `src/shared/locales/zh-TW.json`
    - Add all user-facing strings for ClimbForm, ClimbList, Dashboard, SuggestionsScreen, ProfileScreen
    - _Requirements: 9.4_
  - [ ]* 10.3 Write property tests for localization
    - **Property 9: Localization key lookup never returns null** — for any key and any supported locale, `t(key)` returns a non-empty string
    - _Requirements: 9.5_
  - [ ]* 10.4 Write unit test for zh-TW locale routing
    - Verify `t(key)` returns zh-TW string when locale is zh-TW
    - Verify `t(key)` returns English fallback for a key missing from zh-TW.json
    - _Requirements: 9.2, 9.3, 9.5_

- [ ] 11. UI layer — ClimbForm and ClimbList
  - [ ] 11.1 Implement `src/climbs/ClimbForm.tsx`
    - Form fields: routeName, grade, date, result (sent/attempt), optional location and notes
    - Inline validation errors for missing required fields
    - On submit: call `ClimbsService.addClimb`; clear form on success
    - Use `t()` for all labels and error messages
    - _Requirements: 1.1, 1.5, 9.2, 9.3_
  - [ ] 11.2 Implement `src/climbs/ClimbList.tsx`
    - Fetch climbs via `ClimbsService.getClimbs` on mount
    - Render route name, grade, date, result for each climb
    - Display empty-state message when list is empty (use `t()`)
    - _Requirements: 2.1, 2.2, 2.3_
  - [ ]* 11.3 Write unit tests for ClimbForm validation
    - Whitespace-only routeName is rejected
    - Missing grade, date, result each show field-level errors
    - _Requirements: 1.5_

- [ ] 12. UI layer — Dashboard
  - [ ] 12.1 Implement `src/dashboard/Dashboard.tsx`
    - Fetch climbs via `ClimbsService.getClimbs`, pass to `StatsAggregator.compute`
    - Display totalClimbs, totalSends, totalAttempts, byGrade breakdown
    - Display zero-state when no climbs logged
    - Use `t()` for all labels
    - _Requirements: 3.1, 3.2, 3.3, 3.5, 9.2, 9.3_

- [ ] 13. UI layer — SuggestionsScreen
  - [ ] 13.1 Implement `src/suggestions/SuggestionsScreen.tsx`
    - Input fields: maxGrade, style (pre-filled from UserProfile if available, not auto-submitted)
    - On submit: call `SuggestionsService.getSuggestions`
    - Display suggestions on success
    - Display non-blocking error banner for `api_error`, `offline`, `no_history`
    - Show offline banner while device is offline
    - Use `t()` for all labels and banners
    - _Requirements: 4.3, 4.7, 4.8, 4.10, 9.2, 9.3_
  - [ ]* 13.2 Write unit tests for SuggestionsScreen
    - Renders correct banner for each error type
    - Pre-fills inputs from profile without auto-submitting
    - _Requirements: 4.7, 4.10_

- [ ] 14. UI layer — ProfileScreen
  - [ ] 14.1 Implement `src/profile/ProfileScreen.tsx`
    - Load profile via `ProfileRepository.get` on mount
    - Editable fields: name, homeGym, climbingSince, goals
    - Save via `ProfileRepository.save`
    - Display empty fields with placeholder text when no profile saved
    - Use `t()` for all labels
    - Does not call SuggestionsService or GeminiClient
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 9.2, 9.3_

- [ ] 15. Navigation
  - [ ] 15.1 Implement `src/navigation/AppNavigator.tsx`
    - Tab navigator with four tabs: Climbs (ClimbList + ClimbForm), Dashboard, Suggestions, Profile
    - Use `t()` for tab labels
    - _Requirements: 8.1_

- [ ] 16. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests use `fast-check` with minimum 100 iterations each
- Unit tests cover specific examples, edge cases, and error conditions
