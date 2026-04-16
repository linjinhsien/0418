# Tasks: 攀岩夥伴應用程式

**Input**: Design documents from `/specs/001-climber-app/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓
**Branch**: `001-climber-app`

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup（專案初始化）

**Purpose**: Expo + React Native 專案建立與基礎設定

- [ ] T001 Initialize Expo project with TypeScript template: `npx create-expo-app climber-app --template expo-template-blank-typescript`
- [ ] T002 Install dependencies: `expo-sqlite`, `expo-localization`, `@react-native-community/netinfo`, `i18n-js`, `victory-native`, `@shopify/react-native-skia`, `react-native-reanimated`, `@google/generative-ai`, `uuid`
- [ ] T003 Install dev dependencies: `fast-check`, `@testing-library/react-native`, `jest-expo`
- [ ] T004 Create directory structure: `src/climbs/`, `src/dashboard/`, `src/suggestions/`, `src/profile/`, `src/shared/i18n/`, `src/navigation/`
- [ ] T005 [P] Configure TypeScript strict mode in `tsconfig.json`
- [ ] T006 [P] Configure Jest in `jest.config.js` with `jest-expo` preset

**Checkpoint**: `npx expo start` 啟動無錯誤，`npx jest` 可執行

---

## Phase 2: Foundational（基礎建設，阻塞所有 US）

**Purpose**: 所有 User Story 依賴的共用基礎設施，必須在任何 US 開始前完成

⚠️ **CRITICAL**: 此階段完成前，任何 User Story 均不可開始

- [ ] T007 Implement `src/shared/errorTypes.ts` — define `SuggestionError = 'api_error' | 'offline' | 'no_history'` and `MigrationError` interface
- [ ] T008 Implement `src/shared/gradeUtils.ts` — `classifyGrade(grade: string): GradeClassification` using V-scale regex `/^V([0-9]|1[0-7]|B)$/i` and YDS regex `/^5\.(([0-9])|1[0-5][abcd]?)$/i`; return `{ gradeSystem, gradeWarning }`, never throw
- [ ] T009 [P] Write property tests for `gradeUtils.ts` in `src/shared/__tests__/gradeUtils.test.ts` — Property 1 (total/exhaustive), Property 2 (unknown → warning), Property 3 (valid → no warning); min 100 iterations each with `fast-check`
- [ ] T010 Implement `src/shared/db.ts` — open SQLite via `expo-sqlite`, define migration runner: read `schema_migrations`, apply pending migrations in ascending version order, surface `MigrationError` and halt on failure; register v1 migration (climbs, user_profile, schema_migrations tables)
- [ ] T011 [P] Write unit tests for `db.ts` in `src/shared/__tests__/db.test.ts` — migration idempotence (Property 10), halt-on-failure behaviour
- [ ] T012 Implement `src/shared/i18n/en.ts` — all translation keys for ClimbForm, ClimbList, Dashboard, SuggestionsScreen, ProfileScreen (labels, buttons, errors, empty states)
- [ ] T013 [P] Implement `src/shared/i18n/zh-TW.ts` — Traditional Chinese translations for all keys in `en.ts`; use Taiwan vocabulary (see constitution)
- [ ] T014 Implement `src/shared/i18n/index.ts` — init `i18n-js` with `expo-localization`, set locale from device, enable fallback to `en`; export `t(key: string): string`
- [ ] T015 [P] Write property tests for `i18n/index.ts` in `src/shared/__tests__/i18n.test.ts` — Property 9 (key lookup never returns null/empty for any key + locale)

**Checkpoint**: `npx jest src/shared` 全部通過；`gradeUtils`、`db`、`i18n` 可獨立匯入

---

## Phase 3: US1 — 記錄攀岩（Priority: P1）🎯 MVP

**Goal**: 使用者可填寫表單記錄攀岩，資料儲存至 SQLite 並顯示於歷史清單

**Independent Test**: 開啟 app → 點擊「記錄攀岩」→ 填寫必填欄位 → 送出 → 確認資料出現在歷史清單，依日期降冪排列；送出空白表單確認驗證錯誤顯示

- [ ] T016 Implement `src/climbs/climbsRepository.ts` — `insert(climb: Climb): Promise<void>` and `findAll(): Promise<Climb[]>` using `db.ts`
- [ ] T017 Implement `src/climbs/climbsService.ts` — `addClimb(input: ClimbInput): Promise<Climb>`: validate required fields, call `GradeUtils.classifyGrade`, assign UUID + `createdAt`, persist via `ClimbsRepository`; `getClimbs(): Promise<Climb[]>`: delegate to repository, sort by date descending
- [ ] T018 [P] Write unit tests for `climbsService.ts` in `src/climbs/__tests__/climbsService.test.ts` — missing required fields rejected, UUID + createdAt assigned, grade classification delegated to GradeUtils
- [ ] T019 [P] Write property test for climb persistence round-trip in `src/climbs/__tests__/climbsService.test.ts` — Property 4: addClimb then getClimbs returns list containing the climb
- [ ] T020 Implement `src/climbs/ClimbForm.tsx` — fields: routeName, grade, date, result (sent/attempt), optional location + notes; inline validation errors per field; on submit call `ClimbsService.addClimb`; all labels via `t()`
- [ ] T021 Implement `src/climbs/ClimbList.tsx` — fetch via `ClimbsService.getClimbs` on mount; render routeName, grade, date, result per item; empty-state message via `t()`
- [ ] T022 [P] Write unit tests for `ClimbForm.tsx` in `src/climbs/__tests__/ClimbForm.test.tsx` — whitespace-only routeName rejected, each missing required field shows error, valid submit calls ClimbsService

**Checkpoint**: US1 완전히 독립적으로 테스트 가능 — ClimbForm 제출 → ClimbList 에 표시

---

## Phase 4: US2 — 進度儀表板（Priority: P2）

**Goal**: 使用者可查看難度趨勢圖表與各難度成功率；無資料時顯示空狀態

**Independent Test**: 匯入 3 筆以上樣本資料 → 開啟 Dashboard → 確認圖表渲染、totalClimbs/totalSends/byGrade 數值正確；清空資料確認空狀態顯示

- [ ] T023 Implement `src/dashboard/statsAggregator.ts` — pure `compute(climbs: Climb[]): ClimbStats` returning `totalClimbs`, `totalSends`, `totalAttempts`, `byGrade`; no writes, no side effects
- [ ] T024 [P] Write property tests for `statsAggregator.ts` in `src/dashboard/__tests__/statsAggregator.test.ts` — Property 5 (stats consistent with list), Property 6 (byGrade sum equals totalClimbs); unit tests for empty list and zero-state
- [ ] T025 Implement `src/dashboard/Dashboard.tsx` — fetch climbs via `ClimbsService.getClimbs`, pass to `StatsAggregator.compute`; render totalClimbs, totalSends, totalAttempts, byGrade breakdown using Victory Native charts; zero-state when no climbs; all labels via `t()`

**Checkpoint**: Dashboard 可獨立測試 — 匯入樣本資料後圖表正確渲染，空狀態正確顯示

---

## Phase 5: US3 — AI 路線建議（Priority: P3）

**Goal**: 使用者輸入最高難度與風格後取得 Gemini 路線建議；離線或 API 錯誤時顯示友善 banner

**Independent Test**: 輸入 maxGrade + style → 確認 Gemini 回傳 3 條以上建議；模擬離線 → 確認 offline banner；模擬 API 錯誤 → 確認 api_error banner；無攀岩歷史 → 確認 no_history banner

- [ ] T026 Implement `src/suggestions/geminiClient.ts` — `complete(systemInstruction: string, userPrompt: string): Promise<string>` using `@google/generative-ai` with `gemini-1.5-flash`; throw on non-success
- [ ] T027 Implement `src/suggestions/suggestionsService.ts` — check network via `@react-native-community/netinfo` before calling GeminiClient (return `{ status: 'error', error: 'offline' }` if offline); check climb count (return `no_history` if zero); construct prompt with system instruction; return `{ status: 'success', suggestions }` or `{ status: 'error', error: 'api_error' }`; never persist responses
- [ ] T028 [P] Write unit + property tests for `suggestionsService.ts` in `src/suggestions/__tests__/suggestionsService.test.ts` — Property 7 (offline → no GeminiClient call), Property 8 (suggestions never persisted), api_error on throw, no_history when empty, system instruction always included
- [ ] T029 Implement `src/suggestions/SuggestionsScreen.tsx` — input fields: maxGrade, style (pre-fill from UserProfile if available, no auto-submit); on submit call `SuggestionsService.getSuggestions`; display suggestions on success; non-blocking error banner for each error type; offline banner while device offline; all text via `t()`
- [ ] T030 [P] Write unit tests for `SuggestionsScreen.tsx` in `src/suggestions/__tests__/SuggestionsScreen.test.tsx` — correct banner per error type, pre-fill without auto-submit

**Checkpoint**: SuggestionsScreen 可獨立測試 — mock GeminiClient 驗證所有錯誤狀態與成功路徑

---

## Phase 6: Requirement 5 — 使用者資料

**Goal**: 使用者可管理個人資料（姓名、主場地、目標）；資料可預填 AI 建議輸入欄位

**Independent Test**: 開啟 ProfileScreen → 填寫資料 → 儲存 → 重新開啟確認資料持久化；開啟 SuggestionsScreen 確認欄位預填

- [ ] T031 Implement `src/profile/profileRepository.ts` — `get(): Promise<UserProfile | null>` and `save(profile: UserProfile): Promise<void>` using singleton id `'singleton'`
- [ ] T032 [P] Write unit tests for `profileRepository.ts` in `src/profile/__tests__/profileRepository.test.ts` — save then get returns same profile, overwrite singleton
- [ ] T033 Implement `src/profile/ProfileScreen.tsx` — load profile via `ProfileRepository.get` on mount; editable fields: name, homeGym, climbingSince, goals; save via `ProfileRepository.save`; empty fields with placeholder text when no profile; no AI calls; all labels via `t()`

**Checkpoint**: ProfileScreen 可獨立測試；SuggestionsScreen 預填欄位正確

---

## Phase 7: Navigation & Polish（導覽與收尾）

**Purpose**: 整合所有畫面，跨切面品質提升

- [ ] T034 Implement `src/navigation/AppNavigator.tsx` — tab navigator: Climbs (ClimbList + ClimbForm), Dashboard, Suggestions, Profile; tab labels via `t()`
- [ ] T035 [P] Implement `app/_layout.tsx` (Expo Router entry) — init DB migrations on app start; surface `MigrationError` via error boundary
- [ ] T036 [P] Add `gradeWarning` visual indicator in `ClimbForm.tsx` — show inline warning when gradeSystem is `unknown` (does not block submit)
- [ ] T037 [P] Accessibility audit — verify WCAG 2.1 AA colour contrast (min 4.5:1 for body text) across all screens per SC-005
- [ ] T038 [P] Add ESLint rule to prohibit inline styles per SC-006 — configure `react-native/no-inline-styles` in `.eslintrc.js`
- [ ] T039 [P] Type check: `npx tsc --noEmit` — resolve all TypeScript errors
- [ ] T040 Run full test suite: `npx jest --coverage` — confirm all tests pass

**Checkpoint**: `npx expo start` 完整 app 可用；所有測試通過；無 TypeScript 錯誤

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: 無依賴，立即開始
- **Phase 2 (Foundational)**: 依賴 Phase 1 完成 — 阻塞所有 US
- **Phase 3 (US1)**: 依賴 Phase 2
- **Phase 4 (US2)**: 依賴 Phase 2；可與 Phase 3 並行
- **Phase 5 (US3)**: 依賴 Phase 2；可與 Phase 3/4 並行
- **Phase 6 (Profile)**: 依賴 Phase 2；可與 Phase 3/4/5 並行
- **Phase 7 (Polish)**: 依賴所有 US 完成

### Parallel Opportunities

```bash
# Phase 2 可並行：
T008 gradeUtils.ts  |  T010 db.ts  |  T012 i18n/en.ts

# Phase 3 可並行（不同檔案）：
T016 climbsRepository.ts  |  T018 climbsService tests  |  T019 property tests

# Phase 4/5/6 可並行（不同模組）：
Phase 4 (dashboard)  |  Phase 5 (suggestions)  |  Phase 6 (profile)
```

---

## Implementation Strategy

### MVP（僅 US1）

1. Phase 1: Setup
2. Phase 2: Foundational（必須完成）
3. Phase 3: US1 — 記錄攀岩
4. **STOP & VALIDATE**: ClimbForm → ClimbList 完整流程可用
5. 可展示 / 部署

### Incremental Delivery

1. Setup + Foundational → 基礎就緒
2. US1 → MVP 可展示
3. US2 → 儀表板加入
4. US3 → AI 建議加入
5. Profile → 個人化加入
6. Polish → 品質收尾

---

## Notes

- `[P]` 任務 = 不同檔案、無未完成依賴，可並行執行
- `[US?]` 標籤對應 spec.md 使用者故事，確保可追溯性
- 每個 US 階段可獨立完成與測試
- 屬性測試使用 `fast-check`，每個屬性最少 100 次迭代
- 所有使用者介面文字必須透過 `t()` 存取，禁止硬編碼字串
- 難度驗證邏輯集中於 `shared/gradeUtils.ts`，禁止在其他模組內聯驗證
