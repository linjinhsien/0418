# Requirements Quality Checklist — Climber App

**Focus**: Requirements completeness & clarity  
**Depth**: Standard (~30 items)  
**Scope**: `specs/001-climber-app/` artifacts only  
**Generated**: 2026-04-17  
**Status**: Pre-implementation gate

Legend: ✅ Pass · ⚠️ Warning · ❌ Fail · 🔲 Not checked

---

## 1. Functional Requirements Coverage

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 1.1 | Every user story (US1–US3) maps to at least one FR | ✅ | US1→FR-001/005, US2→FR-003, US3→FR-004/006 |
| 1.2 | Every FR has a corresponding acceptance scenario | ⚠️ | FR-007 (persistence) has no acceptance scenario |
| 1.3 | No FR is duplicated or contradictory | ✅ | All 7 FRs are distinct |
| 1.4 | All edge cases listed have a corresponding FR or explicit out-of-scope note | ⚠️ | "離線降級行為" edge case not covered by any FR |
| 1.5 | FR-007 persistence target is unambiguous | ✅ | Updated to Firestore (was unclear in English spec) |

---

## 2. Acceptance Scenario Quality

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 2.1 | All scenarios follow Given/When/Then format | ✅ | All 8 scenarios are properly structured |
| 2.2 | Each scenario is independently testable | ✅ | US1 & US2 explicitly state independent test method |
| 2.3 | US3 independent test method is defined | ✅ | Mock skill level + style preference described |
| 2.4 | Negative / error scenarios exist for each user story | ⚠️ | US2 has no error scenario (e.g. chart render failure) |
| 2.5 | Scenarios avoid implementation details (no code/API references) | ✅ | Scenarios are behaviour-focused |

---

## 3. Success Criteria Quality

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 3.1 | All SCs are measurable with concrete numbers | ✅ | SC-001~006 all have quantified targets |
| 3.2 | Every SC maps to at least one FR or US | ⚠️ | SC-006 (no inline style) maps to architecture rule, not a FR |
| 3.3 | SC-004 (90% usability) has a defined measurement method | ❌ | No measurement method or test protocol specified |
| 3.4 | Performance SCs (SC-002, SC-003) specify test conditions | ⚠️ | SC-002 specifies 500 entries; SC-003 says "正常網路" — not quantified |
| 3.5 | SC-005 (WCAG 2.1 AA) specifies which components are in scope | ⚠️ | "正文" only — buttons, icons, placeholders not mentioned |

---

## 4. Data Model Alignment

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 4.1 | All FR-001 fields exist in `Climb` entity | ✅ | routeName, grade, date, location, result, notes all present |
| 4.2 | `gradeWarning` field has a corresponding FR or SC | ⚠️ | Defined in data model but no FR explicitly requires warning display |
| 4.3 | `AISuggestion` non-persistence is explicitly stated in spec.md | ❌ | spec.md does not mention this constraint; only data-model.md does |
| 4.4 | `UserProfile` singleton constraint is reflected in requirements | ❌ | No FR or assumption covers single-user profile limitation |
| 4.5 | Grade validation regex is consistent between spec and data model | ✅ | V-scale and YDS formats match across both documents |

---

## 5. Ambiguity & Clarity

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 5.1 | "完攀／嘗試" (sent/attempt) result values are unambiguous | ✅ | Mapped to `'sent' \| 'attempt'` in data model |
| 5.2 | "友善錯誤訊息" (FR-006) has defined content or format | ❌ | No spec on what the message should contain |
| 5.3 | Offline behaviour is defined (FR-004 / edge case) | ❌ | Listed as edge case but no FR or fallback behaviour specified |
| 5.4 | "無歷史資料時請求 AI 建議" has a defined response | ⚠️ | `no_history` error type exists in data model but no FR covers it |
| 5.5 | Authentication scope is clearly stated | ✅ | "v1 為單一使用者，無帳號系統（或使用 Google Auth）" — "或" is ambiguous |

---

## 6. Completeness

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 6.1 | i18n requirement is traceable to a FR or SC | ⚠️ | Mentioned in constitution/data-model but no FR mandates zh-TW |
| 6.2 | All architecture rules have a corresponding requirement | ⚠️ | SC-006 covers inline style; other rules (layer isolation) have no SC/FR |
| 6.3 | Gemini prompt contract is referenced in spec.md | ❌ | System instruction and output format only in data-model.md |
| 6.4 | Error types (`api_error`, `offline`, `no_history`) are all covered by FRs | ⚠️ | FR-006 covers `api_error`; `offline` and `no_history` have no FR |
| 6.5 | Deletion / editing of climb entries is explicitly in or out of scope | ❌ | Not mentioned anywhere in spec.md |

---

## Summary

| Category | ✅ Pass | ⚠️ Warning | ❌ Fail |
|----------|---------|-----------|--------|
| FR Coverage | 3 | 2 | 0 |
| Acceptance Scenarios | 4 | 1 | 0 |
| Success Criteria | 1 | 3 | 1 |
| Data Model Alignment | 2 | 1 | 2 |
| Ambiguity & Clarity | 2 | 1 | 2 (+ 1 partial) |
| Completeness | 0 | 3 | 2 |
| **Total** | **12** | **11** | **7** |

---

## Recommended Actions (Priority Order)

1. **❌ SC-004**: Define a usability measurement method (e.g. unmoderated user test with 5 participants).
2. **❌ Offline FR**: Add FR-008 to define offline degradation behaviour for Gemini features.
3. **❌ AISuggestion non-persistence**: Add a note to spec.md that AI suggestions are session-only.
4. **❌ Climb edit/delete**: Explicitly state whether editing or deleting climb entries is in or out of scope for v1.
5. **❌ FR-006 error message content**: Define minimum content for user-facing error messages (e.g. error type + retry CTA).
6. **⚠️ FR-007 acceptance scenario**: Add a scenario verifying data survives a page reload.
7. **⚠️ SC-003 network condition**: Replace "正常網路" with a quantified condition (e.g. ≥10 Mbps / latency ≤100ms).
8. **⚠️ gradeWarning display**: Add FR or SC requiring the UI to surface grade warnings to the user.
9. **⚠️ Authentication assumption**: Resolve "無帳號系統（或使用 Google Auth）" — pick one for v1.
10. **⚠️ i18n FR**: Add FR-009 mandating zh-TW as the default locale.

---

# Requirements Quality Checklist — Climber App (Run 2)

**Focus**: 全面需求品質（完整性、清晰度、一致性、可量測性、覆蓋率）
**Depth**: Standard
**Scope**: `specs/001-climber-app/` artifacts
**Generated**: 2026-04-18
**Status**: Post-implementation gate（對照已實作狀態重新驗證）

---

## Requirement Completeness

- [x] CHK001 - spec.md 中是否明確列出所有 FR（FR-001～FR-008）且無遺漏？ [Completeness, Spec §FR] ✅ FR-008（離線 banner）已補入
- [x] CHK002 - AISuggestion session-only 不持久化的限制是否已寫入 spec.md？ [Completeness] ✅ 已補入核心資料實體章節
- [x] CHK003 - 攀岩記錄的編輯／刪除是否明確標示為 v1 out of scope？ [Completeness] ✅ 假設章節已明確說明
- [ ] CHK004 - i18n（zh-TW 預設語系）是否有對應的 FR 或 SC？ [Completeness, Gap] ⚠️ 仍無 FR-009
- [x] CHK005 - UserProfile singleton 限制是否在 spec.md 假設章節中說明？ [Completeness] ✅ 已補入

## Requirement Clarity

- [x] CHK006 - SC-003 網路條件是否已量化（≥10Mbps / latency ≤100ms）？ [Clarity, Spec §SC-003] ✅ 已修正
- [x] CHK007 - SC-004 可用性量測方式是否已定義（5 位參與者非引導式測試）？ [Clarity, Spec §SC-004] ✅ 已補入
- [ ] CHK008 - FR-006「友善錯誤訊息」是否定義了最低內容規格（錯誤類型 + 重試 CTA）？ [Clarity, Gap] ❌ 仍未定義
- [x] CHK009 - SC-005 WCAG 2.1 AA 是否明確列出適用元件（正文、按鈕、輸入框標籤）？ [Clarity, Spec §SC-005] ✅ 已補入
- [ ] CHK010 - 「gradeWarning: true」的 UI 呈現方式是否在 spec 中定義？ [Clarity, Gap] ⚠️ 僅在 data-model.md 定義，spec.md 無對應 FR

## Requirement Consistency

- [x] CHK011 - FR-004 Gemini 模型名稱（gemini-2.0-flash）是否與 AGENTS.md、geminiClient.ts 一致？ [Consistency] ✅
- [x] CHK012 - spec.md 與 data-model.md 的難度格式（V-scale / YDS）定義是否一致？ [Consistency] ✅
- [ ] CHK013 - spec.md 假設章節「無帳號系統」是否已移除「或使用 Google Auth」的歧義？ [Consistency, Ambiguity] ⚠️ 仍有歧義

## Acceptance Criteria Quality

- [x] CHK014 - US1 驗收情境是否涵蓋正向、負向（驗證失敗）兩種路徑？ [Acceptance Criteria] ✅
- [ ] CHK015 - US2 是否有圖表渲染失敗的錯誤情境？ [Acceptance Criteria, Gap] ❌ 無
- [x] CHK016 - US3 是否有 API 失敗的錯誤情境（含重試）？ [Acceptance Criteria] ✅
- [ ] CHK017 - FR-007 是否有「資料在頁面重載後仍存在」的驗收情境？ [Acceptance Criteria, Gap] ⚠️ 無

## Scenario Coverage

- [x] CHK018 - 離線狀態（FR-008）是否有對應的驗收情境？ [Coverage] ✅ FR-008 已定義 offline banner 行為
- [ ] CHK019 - 無歷史資料時請求 AI 建議的引導流程是否有對應 FR 或情境？ [Coverage, Gap] ⚠️ data-model.md 有 no_history 錯誤類型，但 spec.md 無 FR
- [x] CHK020 - 空狀態（無記錄）的儀表板顯示是否有驗收情境？ [Coverage, Spec §US2] ✅

## Non-Functional Requirements

- [x] CHK021 - 效能需求（SC-002、SC-003）是否已量化且可客觀量測？ [NFR, Measurability] ✅
- [x] CHK022 - 無障礙需求（SC-005）是否符合 WCAG 2.1 AA 且列出適用元件？ [NFR] ✅
- [ ] CHK023 - 是否有安全性需求說明（API key 保護、Firestore rules）？ [NFR, Gap] ⚠️ 僅在 AGENTS.md 提及，spec.md 無對應 FR 或 SC

## Dependencies & Assumptions

- [x] CHK024 - Gemini API key 來源（VITE_GEMINI_API_KEY / .env.local）是否在假設章節說明？ [Assumption] ✅
- [x] CHK025 - Firebase Firestore 專案（solar-curve-490711-p4）是否在 shared/firebase.ts 設定且文件化？ [Dependency] ✅
- [ ] CHK026 - Google Maps API key（VITE_GOOGLE_MAPS_API_KEY）是否在 spec.md 假設章節列出？ [Dependency, Gap] ⚠️ 僅在 AGENTS.md 列出

---

## Run 2 Summary

| Category | ✅ Pass | ⚠️ Warning | ❌ Fail |
|----------|---------|-----------|--------|
| Completeness | 4 | 1 | 0 |
| Clarity | 3 | 1 | 1 |
| Consistency | 2 | 1 | 0 |
| Acceptance Criteria | 2 | 1 | 1 |
| Scenario Coverage | 2 | 1 | 0 |
| NFR | 2 | 1 | 0 |
| Dependencies | 2 | 1 | 0 |
| **Total** | **17** | **7** | **2** |

## Run 2 Recommended Actions

1. **❌ CHK008** — FR-006 補充錯誤訊息最低內容規格（錯誤類型說明 + 重試 CTA）
2. **❌ CHK015** — US2 補充圖表渲染失敗的錯誤驗收情境
3. **⚠️ CHK004** — 新增 FR-009：zh-TW 為預設語系
4. **⚠️ CHK013** — 移除假設章節「或使用 Google Auth」歧義，明確為「無帳號系統」
5. **⚠️ CHK019** — 補充 no_history 情境的 FR 或驗收情境
6. **⚠️ CHK026** — 在 spec.md 假設章節補充 VITE_GOOGLE_MAPS_API_KEY
