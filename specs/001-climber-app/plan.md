# 實作計畫：攀岩夥伴應用程式

**分支**：`001-climber-app` | **日期**：2026-04-18T10:00:00+08:00 | **規格**：[specs/001-climber-app/spec.md]
**權威需求**：[specs/001-climber-app/spec.md]

## 摘要

現代化 React (Vite) 攀岩記錄 Web 應用程式，整合 Gemini 3.0 Flash 與 GCP Firestore。

## 技術棧

| 類別 | 選型 | 說明 |
|---|---|---|
| 語言 | TypeScript 5.x | 資料模型型別安全 |
| 框架 | **React** (Vite) | 現代化 Web 應用程式 |
| AI | **Gemini 3.0 (Flash)** | 官方 SDK (@google/generative-ai) |
| 協作 | **Semantic Kernel / AgentDevelopKit** | AI 邏輯協調與編排 |
| 後端 | **GCP Firestore** | Firebase 託管 NoSQL 資料庫 |
| 地圖 | **@vis.gl/react-google-maps** | Google Maps + Places API (New) |
| 狀態管理 | **React useState / Context API** | v1 狀態管理 |
| 圖表 | **Recharts** | Web 原生圖表，支援難度趨勢與成功率 |
| 樣式 | **Vanilla CSS** | 無 inline styles（SC-006） |
| 測試 | **Vitest + React Testing Library + fast-check** | 單元測試與元件測試 |

## 憲章檢核

- [x] **AI 優先**：Gemini 3.0 整合為核心功能
- [x] **現代 Web UX**：React 元件，提供 Premium 視覺體驗
- [x] **資料完整性**：GCP Firestore 持久化，ClimbEntry 驗證
- [x] **可測試性**：Vitest 測試，Gemini mock 支援
- [x] **語言標準**：zh-TW 為預設語系

## 目錄結構

```
src/
├── App.tsx
├── main.tsx
├── index.css
├── vite-env.d.ts
├── climbs/
│   ├── ClimbForm.tsx
│   ├── ClimbList.tsx
│   ├── climbsService.ts
│   ├── climbsRepository.ts
│   └── types.ts
├── dashboard/
│   ├── Dashboard.tsx
│   └── statsAggregator.ts
├── suggestions/
│   ├── SuggestionsScreen.tsx
│   ├── suggestionsService.ts
│   ├── geminiClient.ts
│   ├── orchestrator.ts
│   └── kernel/skills.ts
├── profile/
│   ├── ProfileScreen.tsx
│   └── profileRepository.ts
├── shared/
│   ├── firebase.ts
│   ├── db.ts
│   ├── gradeUtils.ts
│   ├── errorTypes.ts
│   └── i18n/
└── components/
    ├── ClimbMap.tsx
    ├── PlaceAutocomplete.tsx
    ├── Navigation.tsx
    └── Layout.tsx
```

## 實作階段

### Phase 1 — 資料模型與基礎建設
- 定義 `Climb`、`UserProfile` TypeScript 介面
- `firebase.ts` 與 `db.ts` 實作
- `gradeUtils.ts`：V-scale / YDS 驗證邏輯
- i18n 設定 (zh-TW)

### Phase 2 — 核心功能 (US1)
- `ClimbForm.tsx` 與 `ClimbList.tsx`
- 串接 Firestore 進行資料讀取與儲存

### Phase 3 — 儀表板 (US2)
- 使用 Recharts 實作視覺化圖表

### Phase 4 — AI 建議 (US3)
- 整合 Gemini 3.0 Flash 推薦引擎
- Semantic Kernel 編排器
- Streaming UX

### Phase 5 — 地圖與位置
- Google Maps 整合（@vis.gl/react-google-maps）
- PlaceAutocomplete（Places API New）
- locationId 持久化至 Firestore

### Phase 6 — 最終修飾
- 樣式優化、無障礙稽核（WCAG 2.1 AA）
- 使用者資料管理（ProfileScreen）

## 非目標 (v1)
- 多使用者帳號系統
- 攀岩記錄的編輯或刪除
- 複雜的社群功能
