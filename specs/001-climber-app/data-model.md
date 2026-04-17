# 資料模型：攀岩夥伴應用程式

**分支**：`001-climber-app` | **日期**：2026-04-17T03:20:00+08:00
**產出自**：`speckit.plan` Phase 1 | **更新**：遷移至 Firebase Firestore

---

## 實體定義

### Climb

攀岩記錄的核心實體，儲存於 Firestore `climbs` 集合，每筆文件以 UUID 為 document ID。

```typescript
// src/climbs/types.ts
export type GradeSystem = 'v-scale' | 'yds' | 'unknown';
export type ClimbResult = 'sent' | 'attempt';

export interface Climb {
  id: string;           // UUID，由 ClimbsService 於建立時指派
  routeName: string;    // 必填，路線名稱
  grade: string;        // 必填，原始輸入字串（保留使用者輸入）
  gradeSystem: GradeSystem; // 由 GradeUtils 分類
  gradeWarning: boolean;    // true 表示 gradeSystem === 'unknown'
  date: string;         // 必填，ISO 8601 日期（YYYY-MM-DD）
  location?: string;    // 選填，地點
  result: ClimbResult;  // 必填，'sent' | 'attempt'
  notes?: string;       // 選填，備註
  createdAt: string;    // ISO 8601 時間戳，由 ClimbsService 自動設定
}
```

**驗證規則**（由 ClimbForm 執行，邏輯定義於 ClimbsService）：
- `routeName`：非空字串
- `grade`：非空字串；gradeSystem 由 `GradeUtils.classify()` 決定
- `date`：有效 ISO 8601 日期，不得為未來日期
- `result`：必須為 `'sent'` 或 `'attempt'`

---

### UserProfile

單例使用者資料，儲存於 Firestore `userProfile/singleton` 文件，document ID 固定為 `'singleton'`。

```typescript
// src/profile/types.ts
export interface UserProfile {
  id: 'singleton';      // 固定值，確保單例
  name?: string;        // 選填
  homeGym?: string;     // 選填，主場地
  climbingSince?: string; // 選填，ISO 8601 日期
  goals?: string;       // 選填，目標描述
}
```

---

### AISuggestion

Gemini API 回應的單筆建議，不持久化至 Firestore（session-only，僅存於記憶體）。

```typescript
// src/suggestions/types.ts
export type ClimbingStyle = 'bouldering' | 'sport' | 'trad';
export type SuggestionErrorType = 'api_error' | 'offline' | 'no_history';

export interface AISuggestion {
  name: string;         // 路線名稱
  grade: string;        // 建議難度
  style: ClimbingStyle; // 攀岩風格
  reason: string;       // 推薦理由（繁體中文）
}

export interface SuggestionRequest {
  maxGrade: string;
  style: ClimbingStyle;
}

export type SuggestionResult =
  | { status: 'success'; suggestions: AISuggestion[] }
  | { status: 'error'; error: SuggestionErrorType };
```

---

## Firestore Schema

### 集合：`climbs`

每筆文件對應一筆攀岩記錄，document ID 為 UUID。

```
climbs/{climbId}
  id:           string   // UUID
  routeName:    string   // 必填
  grade:        string   // 必填，原始輸入
  gradeSystem:  string   // 'v-scale' | 'yds' | 'unknown'
  gradeWarning: boolean
  date:         string   // ISO 8601 YYYY-MM-DD
  location:     string?  // 選填
  result:       string   // 'sent' | 'attempt'
  notes:        string?  // 選填
  createdAt:    string   // ISO 8601 timestamp
```

### 文件：`userProfile/singleton`

單例文件，document ID 固定為 `singleton`。

```
userProfile/singleton
  id:            'singleton'
  name:          string?
  homeGym:       string?
  climbingSince: string?  // ISO 8601 date
  goals:         string?
```

### AISuggestion（不持久化）

AI 建議僅存於記憶體，不寫入任何 Firestore 集合。

---

## GradeUtils 合約

```typescript
// src/shared/gradeUtils.ts
export interface GradeClassification {
  gradeSystem: GradeSystem;
  gradeWarning: boolean;
}

export const GradeUtils = {
  classify(grade: string): GradeClassification,
  isVScale(grade: string): boolean,   // V0–V17, VB
  isYDS(grade: string): boolean,      // 5.0–5.15d
};
```

正規表達式（來自 research.md）：
- V-scale：`/^V([0-9]|1[0-7]|B)$/i`
- YDS：`/^5\.(([0-9])|1[0-5][abcd]?)$/i`

---

## Gemini 提示詞合約

### 輸入
```typescript
interface GeminiSuggestionInput {
  maxGrade: string;
  style: ClimbingStyle;
}
```

### 輸出（期望 JSON 陣列）
```typescript
AISuggestion[]  // 最少 3 筆
```

### System Instruction（固定）
```
你是一位專業攀岩教練助理。你的唯一職責是根據攀岩者的程度與風格偏好，推薦適合的攀岩路線。
請勿回答與攀岩路線建議無關的任何問題。
回應格式必須為 JSON 陣列，每筆包含：name、grade、style、reason（繁體中文）。
```

---

## i18n 翻譯鍵值合約

所有使用者介面文字必須透過 i18n 鍵值存取，禁止硬編碼字串。

```typescript
// src/shared/i18n/keys.ts（型別定義）
interface TranslationKeys {
  common: {
    save: string;
    cancel: string;
    retry: string;
    loading: string;
    error: string;
  };
  climbForm: {
    title: string;
    routeName: string;
    grade: string;
    date: string;
    location: string;
    result: string;
    notes: string;
    submit: string;
    validation: {
      required: string;
      invalidDate: string;
      gradeWarning: string;
    };
  };
  climbList: {
    title: string;
    empty: string;
    sent: string;
    attempt: string;
  };
  dashboard: {
    title: string;
    totalClimbs: string;
    totalSends: string;
    gradeBreakdown: string;
    empty: string;
  };
  suggestions: {
    title: string;
    maxGrade: string;
    style: string;
    submit: string;
    offline: string;
    apiError: string;
    noHistory: string;
    styles: {
      bouldering: string;
      sport: string;
      trad: string;
    };
  };
  profile: {
    title: string;
    name: string;
    homeGym: string;
    climbingSince: string;
    goals: string;
    save: string;
    empty: string;
  };
}
```

---

## 實體關係

```
UserProfile (singleton)
    │
    └── pre-fills ──→ SuggestionRequest (transient, not persisted)

Climb (many)
    │
    ├── read by ──→ StatsAggregator ──→ Dashboard
    └── count checked by ──→ SuggestionsService (no_history guard)
```

**重要約束**：
- `AISuggestion` 不持久化，僅存於記憶體
- `StatsAggregator` 只讀，不寫入 `climbs` 集合
- `SuggestionsService` 不寫入任何 Firestore 集合
