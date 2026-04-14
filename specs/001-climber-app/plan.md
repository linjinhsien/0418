# 實作計畫：攀岩夥伴應用程式

**分支**：`001-climber-app` | **日期**：2026-04-15T02:38:22+08:00 | **規格**：[specs/001-climber-app/spec.md]

## 摘要

行動裝置優先的攀岩記錄 Web 應用程式，核心功能為攀岩記錄、進度儀表板、Gemini AI 路線建議。

---

## 技術棧

| 類別 | 選型 | 說明 |
|---|---|---|
| 語言 | TypeScript 5.x | 資料模型型別安全 |
| 建構工具 | **Vite 5** | 快速 HMR、原生 ESM |
| UI 框架 | **React 18** | 元件化（LogForm / Dashboard / AIBox） |
| 狀態管理 | **Zustand** | 輕量、無樣板程式碼，適合 v1 單使用者 |
| 路由 | **React Router v6** | 三頁路由（首頁 / 儀表板 / AI） |
| 圖表 | **Chart.js 4** + react-chartjs-2 | 難度趨勢與成功率圖表 |
| AI | **@google/generative-ai** | Gemini 官方 SDK |
| 儲存 | **localStorage**（v1） | 簡易 JSON 持久化 |
| 樣式 | CSS Modules + `src/styles/theme.css` | 無執行期 CSS-in-JS |
| 測試 | **Vitest** + Testing Library | 與 Vite 整合，快速單元測試 |
| 環境變數 | `~/.gemini/.env`（全域） | API 金鑰不存於專案 `.env` |

---

## 憲章檢核

- [x] **AI 優先**：Gemini 整合為核心功能（US3）
- [x] **簡潔 UX**：行動裝置優先響應式設計
- [x] **資料完整性**：ClimbEntry 結構定義，必填欄位驗證
- [x] **可測試性**：Vitest 單元測試，各 US 可獨立測試

---

## 專案結構

```text
specs/001-climber-app/
├── spec.md         # 功能規格
├── plan.md         # 本文件
├── tasks.md        # 實作任務清單
├── data-model.md   # ClimbEntry / UserProfile 型別定義
└── research.md     # Gemini API 整合研究

src/
├── components/     # LogForm、ClimbHistory、Dashboard、AIBox
├── services/       # gemini.ts、storage.ts
├── models/         # TypeScript 介面
├── styles/         # theme.css、元件樣式
└── main.tsx        # 應用程式進入點
```

---

## 實作階段

### Phase 0 — 研究
- Gemini API 提示詞工程（攀岩路線建議）
- localStorage 資料結構設計

### Phase 1 — 資料模型與合約
- 定義 `ClimbEntry`、`UserProfile` TypeScript 介面
- 定義 Gemini 提示詞樣板與回應格式

### Phase 2 — 核心功能（US1）
- `StorageService`、`LogForm` 元件、`ClimbHistory` 元件

### Phase 3 — 儀表板（US2）
- `Dashboard` 元件、Chart.js 整合、空狀態 UI

### Phase 4 — AI 建議（US3）
- `GeminiService`、`AIBox` 元件、錯誤處理與重試
