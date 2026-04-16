# 實作計畫：攀岩夥伴應用程式

**分支**：`001-climber-app` | **日期**：2026-04-16T23:42:22+08:00 | **規格**：[specs/001-climber-app/spec.md]
**權威需求**：[.kiro/specs/climber-app/requirements.md]

## 摘要

行動裝置優先的 React Native 攀岩記錄應用程式，核心功能為攀岩記錄、進度儀表板、Gemini AI 路線建議。資料以 SQLite 本地持久化，AI 功能需網路連線，離線時本地功能完整可用。

## 技術棧

| 類別 | 選型 | 說明 |
|---|---|---|
| 語言 | TypeScript 5.x | 資料模型型別安全 |
| 框架 | **React Native** (Expo) | 行動裝置原生體驗 |
| 路由 | **Expo Router** | 檔案式路由，適合 Expo 生態 |
| 狀態管理 | **Context API** | v1 單使用者，無需全域狀態管理函式庫 |
| 圖表 | **Victory Native** | React Native 原生圖表，支援難度趨勢與成功率 |
| AI | **@google/generative-ai** (Gemini SDK) | 官方 SDK |
| 儲存 | **expo-sqlite** | 本地 SQLite，支援版本化遷移 |
| 網路偵測 | **@react-native-community/netinfo** | 離線狀態偵測 |
| 國際化 | **i18n-js** + Expo Localization | zh-TW / en 雙語支援 |
| 測試 | **Jest** + React Native Testing Library | 單元測試與元件測試 |
| 目標平台 | iOS 15+ / Android 10+ | 行動裝置優先 |
| 環境變數 | `GEMINI_API_KEY` via `app.config.ts` extra | 不存於版本控制 |

## 憲章檢核

- [x] **AI 優先**：Gemini 整合為核心功能（Requirement 4），離線時降級顯示 banner
- [x] **簡潔 UX**：React Native 原生元件，行動裝置觸控優先，60 秒內完成記錄（SC-001）
- [x] **資料完整性**：ClimbEntry 必填欄位驗證，grade 驗證集中於 `shared/gradeUtils`，SQLite 版本化遷移
- [x] **可測試性**：Jest 單元測試，Gemini 以 mock/stub 支援離線測試，各 US 可獨立驗證
- [x] **語言標準**：zh-TW 為預設語系，i18n-js 管理所有使用者介面文字

## 架構分層

```
UI 層（screens + components）
    ↓
Domain 層（use cases + entities）
    ↓
Data 層（repositories + SQLite + API client）
```

**規則**：UI 層不得直接呼叫 Data 層，所有資料存取必須經由 Domain 層。

## 模組邊界

| 模組 | 職責 | 禁止 |
|---|---|---|
| `climbs` | 記錄、清單、驗證攀岩資料 | 匯入 suggestions 或 dashboard |
| `dashboard` | 統計聚合、圖表渲染 | 寫入或修改攀岩資料 |
| `suggestions` | Gemini API 呼叫、建議顯示 | 持久化任何資料 |
| `profile` | 使用者資料 CRUD | 觸發 AI 呼叫 |
| `shared` | gradeUtils、db、errorTypes、i18n | 匯入任何功能模組 |

## 專案結構

```text
specs/001-climber-app/
├── spec.md           # 功能規格
├── plan.md           # 本文件
├── research.md       # Phase 0 研究產出
├── data-model.md     # Phase 1 資料模型
└── tasks.md          # Phase 2 任務清單（由 speckit.tasks 產生）

src/
├── climbs/
│   ├── ClimbForm.tsx
│   ├── ClimbList.tsx
│   ├── climbsRepository.ts
│   └── climbsService.ts
├── dashboard/
│   ├── Dashboard.tsx
│   └── statsAggregator.ts
├── suggestions/
│   ├── SuggestionsScreen.tsx
│   ├── suggestionsService.ts
│   └── geminiClient.ts
├── profile/
│   ├── ProfileScreen.tsx
│   └── profileRepository.ts
├── shared/
│   ├── gradeUtils.ts
│   ├── db.ts
│   ├── errorTypes.ts
│   └── i18n/
│       ├── en.ts
│       └── zh-TW.ts
└── navigation/
    └── AppNavigator.tsx
```

## 實作階段

### Phase 0 — 研究
- Gemini API 提示詞工程（攀岩路線建議）
- expo-sqlite 版本化遷移模式
- Victory Native 圖表整合
- i18n-js + Expo Localization zh-TW 設定

### Phase 1 — 資料模型與合約
- 定義 `Climb`、`UserProfile` TypeScript 介面（`data-model.md`）
- 定義 SQLite schema 與遷移版本
- 定義 Gemini 提示詞樣板與回應格式
- 定義 i18n 翻譯鍵值合約

### Phase 2 — 基礎建設
- `db.ts`：SQLite 初始化與遷移執行器
- `gradeUtils.ts`：V-scale / YDS 驗證，`unknown` 警告旗標
- `errorTypes.ts`：`api_error | offline | no_history` 型別定義
- i18n 設定與翻譯鍵值（zh-TW / en）

### Phase 3 — 核心功能（US1）
- `climbsRepository.ts`、`climbsService.ts`
- `ClimbForm.tsx`（含驗證）、`ClimbList.tsx`

### Phase 4 — 儀表板（US2）
- `statsAggregator.ts`、`Dashboard.tsx`、Victory Native 圖表、空狀態 UI

### Phase 5 — AI 建議（US3）
- `geminiClient.ts`、`suggestionsService.ts`、`SuggestionsScreen.tsx`
- 離線 banner、錯誤狀態處理與重試

### Phase 6 — 使用者資料（Requirement 5）
- `profileRepository.ts`、`ProfileScreen.tsx`

## 非目標（v1）

- 帳號系統或多使用者支援
- 雲端同步或備份
- 桌面版面最佳化
- Gemini 回應離線快取
