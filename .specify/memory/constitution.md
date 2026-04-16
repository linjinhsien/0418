<!--
SYNC IMPACT REPORT
==================
Version change: 1.1.0 → 1.2.0 (MINOR — Migrated from React Native to React (Web), updated AI to Gemini 3.0, integrated GCP backend, and added Agent DevelopKit/Semantic Kernel JS as orchestration options)

Modified principles:
  - I. AI-First          → Updated AI model to Gemini 3.0
  - II. Modern Web UX    → Changed from Mobile-First Native to Modern Web (React)
  - III. Data Integrity  → Updated from local storage to GCP (Firestore)
  - IV. Testability & Documentation → unchanged

Added sections:
  - Integration with GCP and AI Orchestration layers

Templates reviewed:
  ✅ .specify/templates/* updated to reflect React-based structure

Follow-up TODOs:
  - Initialize Vite React project
  - Configure GCP project access
-->

# Climber — Project Constitution

## Vision

A climbing companion app built with Google Gemini 3.0 and React, helping climbers track routes, progress, and goals. The app is a modern web application leveraging Google Cloud Platform (GCP) for backend services, providing robust data persistence and intelligent features.

## Core Principles

### I. AI-First

Gemini 3.0 (Flash) MUST be the primary intelligence layer. We leverage orchestration tools like Agent DevelopKit or Semantic Kernel JS to manage complex AI workflows. AI features MUST be seamlessly integrated into the React frontend.

### II. Modern Web UX

The interface MUST be built with React and modern CSS, ensuring a premium, responsive experience across all devices. We prioritize "rich aesthetics" and "visual excellence" to provide a top-tier user experience.

### III. Data Integrity & GCP Integration

All climb entries MUST be validated and stored securely in a GCP-managed backend (e.g., Firestore). We move away from pure local storage to a cloud-synced model to ensure data persistence across devices.

### IV. Testability & Documentation

The codebase MUST maintain high test coverage using Vitest. Comprehensive documentation in both English and Traditional Chinese (zh-TW) is mandatory for all major features and services.

## Quality Standards

- Code MUST be readable, typed (TypeScript), and well-commented.
- UI MUST meet WCAG 2.1 AA accessibility standards.
- Performance: Initial load < 2s; AI responses < 5s.
- Infrastructure: All backend services MUST reside within GCP.

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
- Amendments require a version bump and propagation to all `speckit` templates.
- Versioning policy:
  at time of authoring.

**Version**: 1.2.0 | **Ratified**: 2026-04-14 | **Last Amended**: 2026-04-17
