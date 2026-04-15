# 實作計畫：Climber 攀岩夥伴 App

**Branch**: `001-climber-app` | **Date**: 2026-04-15 | **Spec**: `/specs/001-climber-app/spec.md`
**Input**: 來自 `/specs/001-climber-app/spec.md` 的功能規格

## Summary

建立一個以行動裝置優先的攀岩紀錄 Web App：先完成可靠資料紀錄與還原，再完成進度視覺化，最後疊加 Gemini AI 建議，以確保每一階段皆可獨立驗證與交付（符合 Speckit 分階段原則）。

## Technical Context

**Language/Version**: TypeScript 5.x
**Primary Dependencies**: React 18、Vite 5、React Router v6、Zustand、Chart.js 4、`@google/generative-ai`
**Storage**: localStorage（JSON，v1 單使用者）
**Testing**: Vitest + Testing Library
**Target Platform**: Mobile-first 現代瀏覽器（Chromium/Safari/Firefox）
**Project Type**: 前端 SPA 應用
**Performance Goals**: 500 筆資料下儀表板 < 2 秒；成功 AI 請求目標 < 5 秒
**Constraints**: 無後端（v1）；非 AI 功能需可離線使用；核心流程需符合 WCAG 2.1 AA
**Scale/Scope**: 3 條主要 user stories（紀錄 / 儀表板 / AI 建議）

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **價值優先**：功能直接對應攀岩者核心任務（記錄、分析、建議）。
- [x] **資料完整性**：先定義驗證/持久化，再開發圖表與 AI。
- [x] **AI 增強而非阻斷**：AI 不可成為主流程單點失效。
- [x] **可測試切片**：每個 User Story 具獨立驗收條件。
- [x] **品質門檻**：納入可衡量效能與可及性目標。

## Project Structure

### Documentation (this feature)

```text
specs/001-climber-app/
├── spec.md
├── plan.md
├── tasks.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── LogForm/
│   ├── ClimbHistory/
│   ├── Dashboard/
│   └── AISuggestions/
├── services/
│   ├── storage.ts
│   └── gemini.ts
├── stores/
│   └── climbs.ts
├── models/
│   └── climb.ts
├── routes/
│   └── index.tsx
└── styles/
    └── theme.css

tests/
├── unit/
├── integration/
└── contract/
```

**Structure Decision**: 採單一 SPA 專案結構，降低 v1 複雜度並保留後續擴充彈性。

## Implementation Phases

### Phase 0 — 研究與風險收斂

- 確認 V-scale/YDS 格式規則與錯誤訊息策略。
- 設計 Gemini prompt 與輸出結構，避免 UI 解析不穩定。
- 驗證 localStorage 容量/錯誤行為與回復策略。

### Phase 1 — 資料模型與契約

- 定義 `ClimbEntry`、`UserProfile`、`ProgressSnapshot`、`AISuggestion` 型別。
- 建立資料驗證與序列化邊界，避免髒資料流入下游。
- 定義 AI 服務錯誤分類（可重試/不可重試）。

### Phase 2 — 核心流程（P1）

- 實作 `LogForm`（驗證、可及性、錯誤回饋）。
- 實作 `ClimbHistory`（穩定排序、顯示一致性）。
- 串接 store + storage 完成資料持久化與還原。

### Phase 3 — 進度儀表板（P2）

- 實作趨勢與成功率資料轉換。
- 實作圖表與 empty/loading/error 狀態。
- 補齊統計計算與渲染測試。

### Phase 4 — AI 建議（P3）

- 實作 Gemini service 與建議顯示 UI。
- 加入 API 失敗重試、提示文案與 fallback 流程。
- 強化無歷史資料時的引導與預設策略。

## Complexity Tracking

目前無違反憲章原則之必要例外。
