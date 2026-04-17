# Tasks: 攀岩夥伴應用程式
**Input**: Design documents from `/specs/001-climber-app/`
**Prerequisites**: plan.md (v1.2.0), spec.md, research.md, data-model.md
**Branch**: `001-climber-app`

## 任務清單格式：`[ID] [P?] [Story] 描述`

---

## Phase 1: Setup（專案初始化）
**目的**: 初始化 Vite + React 環境並安裝核心相依套件
- [x] T001 Initialize Vite React project with TypeScript (已完成)
- [x] T002 Install core dependencies: `firebase`, `@google/generative-ai`, `recharts`, `lucide-react`, `framer-motion`, `clsx`, `tailwind-merge`, `react-i18next`, `i18next`, `uuid`
- [x] T003 Install dev dependencies: `vitest`, `@testing-library/react`, `@vitejs/plugin-react`, `jsdom`
- [x] T004 Organize directory structure: `src/climbs/`, `src/dashboard/`, `src/suggestions/`, `src/profile/`, `src/shared/`, `src/components/`
- [x] T005 [P] Configure Vitest in `vite.config.ts`
- [x] T006 [P] Configure TypeScript strict mode and paths in `tsconfig.json`

**檢查點**: `npm run dev` 可正常啟動且 `npm run test` 可執行。
---

## Phase 2: Foundational（基礎建設與 US 共通任務）
**目的**: 建立資料庫連線、國際化與共通工具
- [x] T007 Implement `src/shared/firebase.ts`: Initialize Firebase App and Firestore with `solar-curve-490711-p4` config
- [x] T008 Implement `src/shared/db.ts`: Create `FirestoreDB` implementation to handle `climbs` and `user_profile` collections
- [x] T009 Implement `src/shared/gradeUtils.ts`: Port `classifyGrade` logic for V-scale and YDS verification
- [x] T010 [P] Configure i18n in `src/shared/i18n/`: Set up `zh-TW` as default with Taiwan terminology (憲章合致)
- [x] T011 [P] Define core types in `src/climbs/types.ts`: `Climb` and `ClimbInput` interfaces

**檢查點**: `npm run test src/shared` 全部通過。
---

## Phase 3: US1 — 記錄攀岩（P1）
**目標**: 使用者可透過表單記錄攀岩資料並存入 Firestore，同時顯示於歷史清單。

- [x] T012 Implement `src/climbs/climbsRepository.ts`: Firestore-backed `insert` and `findAll`
- [x] T013 Implement `src/climbs/climbsService.ts`: Business logic for climb validation and persistence
- [x] T014 [P] Write Vitest unit tests for `climbsService.ts`
- [x] T015 Implement `src/climbs/ClimbForm.tsx`: React form with validation and loading states
- [x] T016 Implement `src/climbs/ClimbList.tsx`: Responsive list with Firestore real-time or fetch updates
- [x] T017 [P] Integration test: Add a climb and verify it appears in the list

**檢查點**: 完成 US1 的獨立測試（Given 首頁 -> 填寫表單 -> 顯示於清單）。
---

## Phase 4: US2 — 進度儀表板（P2）
**目標**: 將 Firestore 資料聚合並透過 Recharts 渲染難度趨勢與成功率。

- [x] T018 Implement `src/dashboard/statsAggregator.ts`: Pure function to compute stats from climb list
- [x] T019 [P] Write unit tests for stats calculation logic
- [x] T020 Implement `src/dashboard/Dashboard.tsx`: Render LineChart and PieChart using Recharts
- [x] T021 Handle empty states and loading indicators for charts

**檢查點**: 匯入樣本資料後，儀表板可正確顯示圖表。
---

## Phase 5: US3 — AI 路線建議（P3）
**目標**: 整合 Gemini 3.0 Flash 產生建議，並優雅處理錯誤與離線狀態。

- [x] T022 Implement `src/suggestions/geminiClient.ts`: SDK wrapper for Gemini 3.0 Flash
- [x] T023 Implement `src/suggestions/suggestionsService.ts`: Context construction and error handling
- [x] T024 Implement `src/suggestions/SuggestionsScreen.tsx`: AI Input form and suggestion display cards
- [x] T025 [P] Implement error banners for API failures and offline mode

**檢查點**: 模擬 API 呼叫可正確顯示建議內容與錯誤處理。
---

## Phase 6: 使用者資料與最終修飾
**目標**: 管理個人化設定並進行最後的技術棧清理與優化。

- [ ] T026 Implement `src/profile/profileRepository.ts`: Manage `user_profile/singleton` in Firestore
- [ ] T027 Implement `src/profile/ProfileScreen.tsx`: Profile editing UI
- [ ] T028 [P] Final navigation setup using `src/components/Navigation.tsx`
- [ ] T029 [P] Accessibility audit: Verify WCAG 2.1 AA contrast
- [ ] T030 Final cleanup: Remove all unused Expo/Native dependencies and files

**檢查點**: 完整 App 可運行；所有測試通過；TypeScript 無錯誤。

---

## 依賴關係與執行順序

1. **Phase 1 & 2** 是所有功能的基礎，必須優先完成。
2. **Phase 3 (US1)** 是 MVP 核心，完成後可進行初步部署。
3. **Phase 4 & 5** 可根據優先序並行開發。
