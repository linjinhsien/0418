# 實作計畫：攀岩夥伴應用程式

**分支**：`001-climber-app` | **日期**：2026-04-17T10:00:00+08:00 | **規格**：[specs/001-climber-app/spec.md]
**權威需求**：[.kiro/specs/climber-app/requirements.md]

## 摘要

現代化 React (Vite) 攀岩記錄 Web 應用程式，整合 Gemini 3.0 Flash 與 GCP Firestore。

## 技術棧

| 類別 | 選型 | 說明 |
|---|---|---|
| 語言 | TypeScript 5.x | 資料模型型別安全 |
| 框架 | **React** (Vite) | 現代化 Web 應用程式 |
| AI | **Gemini 3.0 (Flash)** | 官方 SDK (@google/generative-ai) |
| 協作 | **Agent DevelopKit / Semantic Kernel JS** | AI 邏輯協調與編排 |
| 後端 | **GCP Firestore** | Firebase 託管 NoSQL 資料庫 |
| 狀態管理 | **Context API / Zustand** | v1 狀態管理 |
| 圖表 | **Recharts** | Web 原生圖表，支援難度趨勢與成功率 |
| 樣式 | **Vanilla CSS / Tailwind** | 支援 Rich Aesthetics 與動態設計 |
| 測試 | **Vitest** | 單元測試與元件測試 |

## 憲章檢核

- [x] **AI 優先**：Gemini 3.0 整合為核心功能
- [x] **現代 Web UX**：React 元件，提供 Premium 視覺體驗
- [x] **資料完整性**：GCP Firestore 持久化，ClimbEntry 驗證
- [x] **可測試性**：Vitest 測試，Gemini mock 支援
- [x] **語言標準**：zh-TW 為預設語系

## 目錄結構 (Web-optimized)

```
src/
├── climbs/
│   ├── ClimbForm.tsx
│   ├── ClimbList.tsx
│   └── climbsService.ts
├── dashboard/
│   ├── Dashboard.tsx
│   └── statsAggregator.ts
├── suggestions/
│   ├── SuggestionsScreen.tsx
│   └── suggestionsService.ts
├── profile/
│   ├── ProfileScreen.tsx
│   └── profileRepository.ts
├── shared/
│   ├── firebase.ts (GCP Firestore Config)
│   ├── db.ts (Firestore Repository implementation)
│   └── i18n/
└── components/
    ├── Navigation.tsx
    └── Layout.tsx
```

## 實作階段

### Phase 0 — 研究與設定
- Firebase Project 設定與 Firestore 安全規則
- Gemini API 提示詞優化
- Recharts 整合研究

### Phase 1 — 資料模型與合約
- 定義 `Climb`、`UserProfile` TypeScript 介面
- 設計 Firestore 集合結構（`climbs`, `user_profile`）

### Phase 2 — 基礎建設
- `firebase.ts` 與 `db.ts` 實作 (已初步整合)
- `gradeUtils.ts`：V-scale / YDS 驗證邏輯
- i18n 設定 (zh-TW)

### Phase 3 — 核心功能 (US1)
- `ClimbForm.tsx` 與 `ClimbList.tsx`
- 串接 Firestore 進行資料讀取與儲存

### Phase 4 — 儀表板 (US2)
- 使用 Recharts 實作視覺化圖表

### Phase 5 — AI 建議 (US3)
- 整合 Gemini 3.0 Flash 推薦引擎

### Phase 6 — 最終修飾
- 樣式優化、無障礙稽核與生產環境部署

## 非目標 (v1)
- 多使用者帳號系統
- 離線資料同步
- 複雜的社群功能
