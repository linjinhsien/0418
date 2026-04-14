# Tasks: Climber App

**Input**: Design documents from `/specs/001-climber-app/`
**Prerequisites**: plan.md ✓, spec.md ✓
**Branch**: `001-climber-app`

## Format: `[ID] [P?] [Story] Description`

---

## Maintenance

### [M-001] [DONE] Repo Cleanup — Remove redundant nested repo

**Date**: 2026-04-14T18:38:22Z  
**Action**: Deleted `/home/iven840320/0418/0418/` — a nested, redundant git repository containing only a placeholder `README.md` (6 bytes). It had no source code, no spec files, and no relation to the Climber app feature.  
**Why**: Violated project structure defined in `plan.md`. Nested `.git` repos cause confusion and are not part of the `001-climber-app` feature scope.  
**Files removed**: `0418/0418/README.md`, `0418/0418/.git/`  
**Verified**: Branch `001-climber-app` active. `specs/001-climber-app/` intact with `spec.md` and `plan.md`.

---

## User Story 1 — Log a Climb (P1)

- [ ] T-001 [US1] Create `ClimbEntry` TypeScript interface in `src/models/climb.ts`
- [ ] T-002 [US1] Implement `StorageService` (localStorage) in `src/services/storage.ts`
- [ ] T-003 [US1] Build `LogForm` component in `src/components/LogForm.js` with validation (FR-001, FR-005)
- [ ] T-004 [US1] Build `ClimbHistory` list component in `src/components/ClimbHistory.js` sorted by date desc (FR-002)

## User Story 2 — Progress Dashboard (P2)

- [ ] T-005 [P] [US2] Integrate Chart.js for grade trend chart in `src/components/Dashboard.js` (FR-003)
- [ ] T-006 [P] [US2] Add success rate calculation and display per grade
- [ ] T-007 [P] [US2] Add empty state UI when no climbs logged

## User Story 3 — AI Route Suggestions (P3)

- [ ] T-008 [US3] Implement `GeminiService` in `src/services/gemini.js` with prompt template (FR-004)
- [ ] T-009 [US3] Build `AIBox` component in `src/components/AIBox.js` with error handling + retry (FR-006)
- [ ] T-010 [US3] Add offline/no-history guard before calling Gemini API
