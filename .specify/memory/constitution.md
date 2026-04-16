<!--
SYNC IMPACT REPORT
==================
Version change: 1.0.0 → 1.1.0 (MINOR — governance section expanded, quality standards
  formalized, language spec section promoted to first-class section, stray template
  fragment removed, LAST_AMENDED_DATE field added)

Modified principles:
  - I. AI-First          → unchanged
  - II. Simple UX (Mobile-First) → unchanged
  - III. Data Integrity  → unchanged
  - IV. Testability & Documentation → unchanged

Added sections:
  - Language Standards (#zhtw) promoted from appended block to formal section

Removed sections:
  - Stray constitution-template.md fragment that was incorrectly appended

Templates reviewed:
  ✅ .specify/templates/plan-template.md   — Constitution Check gate present; no
       outdated agent-specific names found; no changes required
  ✅ .specify/templates/spec-template.md   — Mandatory sections align with principles;
       no changes required
  ✅ .specify/templates/tasks-template.md  — Task categories (observability, testing,
       validation) align with principles; no changes required

Follow-up TODOs:
  - None; all fields resolved from repo context and spec.
-->

# Climber — Project Constitution

## Vision

A climbing companion app built with AI Studio (Gemini), helping climbers track routes,
progress, and goals. The app is mobile-first, single-user for v1, and relies on local
data persistence with Gemini-powered AI features requiring network access.

## Core Principles

### I. AI-First

Gemini MUST be the primary intelligence layer for route suggestions and progress
analysis. AI features MUST feel integrated into the core workflow, not optional
add-ons. Gemini API failures MUST be handled gracefully with user-friendly messages
and retry options — the app MUST remain usable offline for non-AI features.

### II. Simple UX (Mobile-First)

The interface MUST be optimised for mobile (touch targets, minimal taps). A climber
MUST be able to log a climb in under 60 seconds (SC-001). Desktop is a secondary
concern for v1. Complexity MUST NOT be introduced unless it directly reduces user
friction.

### III. Data Integrity

All climb entries MUST be validated before persistence (FR-005). Required fields —
route name, grade, date, result — MUST be enforced at the UI layer. Grade formats
supported in v1 are V-scale (bouldering) and YDS (sport/trad); unrecognised formats
MUST surface a clear validation error. Data MUST be persisted locally for v1
(FR-007); cloud sync is out of scope.

### IV. Testability & Documentation

Every user story MUST be independently testable as a standalone slice of
functionality (per spec user stories US1–US3). Core logic MUST be documented in
code and specs. AI-dependent features MUST support mock/stub inputs for offline
testing.

## Quality Standards

- Code MUST be readable and well-commented; no unexplained magic values.
- UI MUST meet WCAG 2.1 AA accessibility standards.
- Performance: initial load MUST complete in under 3 seconds; dashboard MUST render
  with up to 500 climb entries in under 2 seconds (SC-002); Gemini suggestions MUST
  return in under 5 seconds under normal network conditions (SC-003).
- Error handling: all external API failures (Gemini) MUST produce graceful,
  user-visible error states with recovery options.
- Authentication and multi-user accounts are out of scope for v1.

## Language Standards

Responses, documentation, and in-app copy default to **正體中文 (Traditional Chinese)**
using Taiwan conventions. The following vocabulary MUST be applied consistently:

| ❌ 避免（中國大陸用語） | ✅ 使用（台灣正體） |
|---|---|
| 創建 | 建立 |
| 質量 | 品質 |
| 數據 | 資料 |
| 組件 | 元件 |
| 對象 | 物件 |
| 函數 | 函式 |
| 代碼 | 程式碼 |
| 庫 | 函式庫 |
| 構建 | 建構 |
| 套件 / 依賴包 | 套件 / 相依套件 |
| 模塊 | 模組 |
| 模板 | 樣板 |
| 插件 | 外掛 |
| 接口 | 介面 |
| 類型 | 型別 |
| 類 | 類別 |
| 變量 | 變數 |
| 字符串 | 字串 |
| 字節 | 位元組 |
| 異步 | 非同步 |
| 調用 | 呼叫 |
| 調試 | 偵錯 |
| 默認 | 預設 |
| 設置 | 設定 |
| 存儲 | 儲存 |
| 緩存 | 快取 |
| 線程 | 執行緒 |
| 進程 | 處理序 |
| 服務器 | 伺服器 |
| 視圖 | 檢視 |
| 導入 / 導出 | 匯入 / 匯出 |
| 項目 | 專案 |
| 搜索 | 搜尋 |
| 訪問 | 存取 |
| 添加 | 新增 |
| 支持 | 支援 |
| 集成 | 整合 |
| 響應 | 回應 |
| 移動 | 行動 |
| 屏幕 | 螢幕 |
| 鼠標 | 滑鼠 |
| 菜單 | 選單 |
| 編程 | 程式設計 |
| 高級 | 進階 |
| 示例 / 樣例 | 範例 |
| 社區 | 社群 |
| 軟件 | 軟體 |
| 應用程序 | 應用程式 |

Reference: https://gist.github.com/doggy8088/579e8f89ccbaeccf0868fee886dd6ac1

## Governance

- This constitution supersedes all other development practices for this project.
- All PRs MUST include a Constitution Check verifying compliance with the four core
  principles before merge.
- Amendments require: (1) a documented rationale, (2) a version bump per the policy
  below, and (3) propagation to all dependent templates via `speckit.constitution`.
- Versioning policy:
  - MAJOR: backward-incompatible governance changes, principle removals or
    redefinitions that invalidate existing implementations.
  - MINOR: new principle or section added, or materially expanded guidance.
  - PATCH: clarifications, wording fixes, typo corrections, non-semantic refinements.
- Compliance review: each feature spec MUST reference the active constitution version
  at time of authoring.

**Version**: 1.1.0 | **Ratified**: 2026-04-14 | **Last Amended**: 2026-04-16
