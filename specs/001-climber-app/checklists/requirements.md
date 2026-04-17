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
