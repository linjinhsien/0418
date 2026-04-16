# 研究報告：攀岩夥伴應用程式

**分支**：`001-climber-app` | **日期**：2026-04-16T23:42:22+08:00
**產出自**：`speckit.plan` Phase 0

---

## 1. Gemini API — 攀岩路線建議提示詞工程

### 決策
使用 `@google/generative-ai` 官方 SDK，模型 `gemini-1.5-flash`。提示詞採用 system instruction + user turn 雙層結構。

### 提示詞樣板

**System instruction**（每次請求固定注入）：
```
你是一位專業攀岩教練助理。你的唯一職責是根據攀岩者的程度與風格偏好，推薦適合的攀岩路線。
請勿回答與攀岩路線建議無關的任何問題。
回應格式必須為 JSON 陣列，每筆包含：name（路線名稱）、grade（難度）、style（風格）、reason（推薦理由，繁體中文）。
```

**User turn 樣板**：
```
攀岩者資訊：
- 最高難度：{maxGrade}
- 偏好風格：{style}（抱石 / 運動攀岩 / 傳統攀岩）

請推薦 3 條適合的路線。
```

### 回應格式
```json
[
  {
    "name": "路線名稱",
    "grade": "V5",
    "style": "bouldering",
    "reason": "適合正在突破 V4 的攀岩者，動作以靜態為主。"
  }
]
```

### 錯誤處理
- 網路離線 → 回傳 `offline` 錯誤狀態，不發出 API 請求
- API 呼叫失敗（非 2xx / SDK 例外）→ 回傳 `api_error`
- 無攀岩歷史 → 回傳 `no_history`，引導使用者先記錄攀岩

### 替代方案評估
| 方案 | 評估 | 結論 |
|---|---|---|
| `gemini-1.5-pro` | 品質更高但延遲較長，超過 SC-003 5 秒目標風險較高 | 捨棄 |
| `gemini-1.5-flash` | 低延遲，適合行動裝置即時回應 | **採用** |
| 自建後端代理 | 可隱藏 API 金鑰，但 v1 無後端 | 延後至 v2 |

---

## 2. expo-sqlite — 版本化遷移模式

### 決策
使用 `expo-sqlite` v14+（Expo SDK 51+）的 `SQLiteDatabase.execAsync` 搭配手動版本表管理遷移。

### 遷移執行器設計
```typescript
// shared/db.ts
const MIGRATIONS: Migration[] = [
  {
    version: 1,
    up: `
      CREATE TABLE IF NOT EXISTS climbs (
        id TEXT PRIMARY KEY,
        routeName TEXT NOT NULL,
        grade TEXT NOT NULL,
        gradeSystem TEXT NOT NULL DEFAULT 'unknown',
        gradeWarning INTEGER NOT NULL DEFAULT 0,
        date TEXT NOT NULL,
        location TEXT,
        result TEXT NOT NULL,
        notes TEXT,
        createdAt TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS user_profile (
        id TEXT PRIMARY KEY DEFAULT 'singleton',
        name TEXT,
        homeGym TEXT,
        climbingSince TEXT,
        goals TEXT
      );
    `
  }
];
```

啟動時執行：
1. 建立 `schema_migrations` 表（若不存在）
2. 查詢已套用版本
3. 依序套用未套用的遷移
4. 遷移失敗時拋出型別化錯誤，停止後續步驟

### 替代方案評估
| 方案 | 評估 | 結論 |
|---|---|---|
| `drizzle-orm` + expo-sqlite | ORM 抽象層，型別安全 | 過度設計，v1 schema 簡單 |
| `@op-engineering/op-sqlite` | 效能更佳，但需原生建構 | Expo Go 不相容，捨棄 |
| AsyncStorage (JSON) | 無 schema，查詢能力弱 | 不符合 FR-007 需求 |
| **expo-sqlite 手動遷移** | 輕量、Expo Go 相容、可版本化 | **採用** |

---

## 3. Victory Native — 圖表整合

### 決策
使用 `victory-native` v41+（基於 Skia 的新版本），搭配 `react-native-reanimated` 與 `@shopify/react-native-skia`。

### 使用圖表
- **難度趨勢**：`VictoryLine` — x 軸為日期，y 軸為難度數值（V-scale 轉數字）
- **成功率**：`VictoryBar` — x 軸為難度，y 軸為完攀率百分比

### 效能考量（SC-002：500 筆資料 2 秒內）
- `statsAggregator.ts` 在 Domain 層預先聚合，圖表只接收聚合後資料點（最多 20 個）
- 避免在渲染週期內執行聚合運算

### 替代方案評估
| 方案 | 評估 | 結論 |
|---|---|---|
| `react-native-chart-kit` | API 簡單但客製化能力弱 | 捨棄 |
| `echarts-for-react-native` | 功能豐富但套件體積大 | 捨棄 |
| **victory-native (Skia)** | React Native 原生、效能佳、Expo 相容 | **採用** |

---

## 4. i18n-js + Expo Localization — zh-TW 設定

### 決策
使用 `i18n-js` v4 搭配 `expo-localization` 偵測裝置語系，預設 zh-TW，fallback 為 en。

### 設定模式
```typescript
// shared/i18n/index.ts
import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';
import en from './en';
import zhTW from './zh-TW';

const i18n = new I18n({ en, 'zh-TW': zhTW });
i18n.locale = getLocales()[0]?.languageTag ?? 'zh-TW';
i18n.enableFallback = true;
i18n.defaultLocale = 'en';
export default i18n;
```

### 翻譯鍵值範疇
涵蓋所有畫面：ClimbForm、ClimbList、Dashboard、SuggestionsScreen、ProfileScreen 的標籤、按鈕、錯誤訊息、空狀態文字。

### 替代方案評估
| 方案 | 評估 | 結論 |
|---|---|---|
| `react-i18next` | 功能完整但設定較複雜 | 過度設計 |
| 硬編碼中文字串 | 無法支援 en fallback | 不符合 Requirement 9 |
| **i18n-js + expo-localization** | 輕量、Expo 原生整合 | **採用** |

---

## 5. 離線狀態偵測

### 決策
使用 `@react-native-community/netinfo` 的 `useNetInfo` hook，在每次 Gemini API 呼叫前同步檢查網路狀態。

### 模式
```typescript
// suggestions/suggestionsService.ts
const state = await NetInfo.fetch();
if (!state.isConnected) {
  return { error: 'offline' };
}
```

UI 層以非阻斷式 banner 顯示離線狀態，本地功能（記錄、歷史、儀表板、資料）完整可用。

---

## 6. 難度格式驗證

### 決策
V-scale 接受 `V0`–`V17`（含 `VB`），YDS 接受 `5.0`–`5.15d`（含 a/b/c/d 子級）。其他格式儲存為 freetext，附加 `gradeWarning: true` 旗標，不拒絕儲存。

### 正規表達式
```typescript
const V_SCALE = /^V([0-9]|1[0-7]|B)$/i;
const YDS = /^5\.(([0-9])|1[0-5][abcd]?)$/i;
```

所有驗證邏輯集中於 `shared/gradeUtils.ts`，禁止在其他模組內聯驗證。
