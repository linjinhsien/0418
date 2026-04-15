# Climber 憲章

## Core Principles

### I. 先解決攀岩者真實任務
每個功能 MUST 直接提升以下至少一項：攀登紀錄、進度理解、下一步決策。

### II. 資料完整性優先
在任何分析或 AI 建議前，資料 MUST 完成格式驗證、可追溯儲存與一致排序。

### III. AI 是增強層，不是阻斷點
Gemini 功能 SHOULD 提升體驗，但 MUST 不阻斷核心流程（記錄與檢視）。

### IV. 行動優先與可及性
核心流程 MUST 以 mobile-first 設計，並滿足 WCAG 2.1 AA 基本要求。

### V. 可分片交付、可獨立驗證
每個 User Story MUST 能單獨實作、測試、展示與驗收（Speckit slicing 原則）。

## Product and Technical Standards

- v1 支援難度系統：V-scale、YDS。
- v1 採 local-first 單使用者，不含帳號與雲端同步。
- 非 AI 功能 MUST 在離線情境可使用（初次載入後）。
- 效能目標：500 筆資料下儀表板渲染時間 < 2 秒。

## Delivery Workflow

- 規格文件 MUST 包含：優先級故事、驗收情境、邊界條件、需求、實體、成功指標。
- 計畫文件 MUST 包含：Technical Context、Constitution Check、Project Structure、Implementation Phases。
- 任務與實作 MUST 可追溯回 spec/plan 條目。
- PR 描述 MUST 說明憲章符合性與執行過的檢查。

## Governance

- 本憲章高於一般開發習慣；若需例外，必須記錄在 plan 的 Complexity Tracking。
- 憲章採 **SemVer** 版本規則（對齊 Speckit 常規）：
  - **MAJOR**：核心原則/治理模型不相容變更
  - **MINOR**：新增原則或章節且相容
  - **PATCH**：措辭澄清、錯字修正、非語義變更

**Version**: 1.1.0 | **Ratified**: 2026-04-15 | **Last Amended**: 2026-04-15
