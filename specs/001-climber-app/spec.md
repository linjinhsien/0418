# 功能規格：Climber 攀岩夥伴 App

**Feature Branch**: `001-climber-app`
**Created**: 2026-04-14
**Status**: Draft
**Input**: 使用者需求：「一個結合 AI（Gemini）的攀岩夥伴 App，協助記錄路線、追蹤進步，並提供 AI 路線建議。」

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 記錄與檢視攀登紀錄（Priority: P1）

攀岩者在每次訓練後可以快速輸入一筆紀錄，並立即在歷史清單中看到正確資料。

**Why this priority**：資料紀錄是整個產品價值的核心；沒有可依賴的紀錄，儀表板與 AI 建議都失去基礎。

**Independent Test**：開啟 App、送出一筆合法紀錄，確認新資料立刻出現在歷史清單且內容完整。

**Acceptance Scenarios**：

1. **Given** 使用者位於首頁，**When** 填寫路線名稱、難度、日期、地點與結果後送出，**Then** 系統成功儲存並顯示於歷史清單。
2. **Given** 系統已有多筆紀錄，**When** 使用者開啟歷史清單，**Then** 資料應依日期遞減排序。
3. **Given** 必填欄位缺漏，**When** 使用者嘗試送出，**Then** 顯示驗證錯誤且不儲存資料。

---

### User Story 2 - 檢視進度趨勢（Priority: P2）

攀岩者可以透過圖表了解自己在不同時間區間的難度趨勢與成功率變化。

**Why this priority**：在資料紀錄可用後，進度可視化是提升留存與回訪的關鍵功能。

**Independent Test**：匯入 10 筆以上不同日期與結果的樣本，確認趨勢圖與成功率統計計算正確。

**Acceptance Scenarios**：

1. **Given** 至少有 3 筆攀登紀錄，**When** 開啟儀表板，**Then** 顯示難度趨勢圖。
2. **Given** 有 sent/attempt 混合資料，**When** 儀表板載入完成，**Then** 正確顯示各難度成功率。
3. **Given** 尚無任何紀錄，**When** 進入儀表板，**Then** 顯示空狀態與「去記錄第一筆」引導。

---

### User Story 3 - 取得 AI 路線建議（Priority: P3）

攀岩者輸入自身能力與偏好後，可以取得 Gemini 產生的個人化建議路線與理由。

**Why this priority**：AI 是差異化功能，但依賴前兩個故事提供的資料品質與使用流程。

**Independent Test**：輸入最高難度與風格偏好，觸發 Gemini 後應回傳 3 筆以上建議；若 API 失敗，應顯示可重試錯誤流程。

**Acceptance Scenarios**：

1. **Given** 使用者提供最高難度與偏好風格，**When** 點擊取得建議，**Then** 回傳至少 3 筆含理由的建議路線。
2. **Given** Gemini 逾時或 API 錯誤，**When** 使用者請求建議，**Then** 顯示可理解錯誤訊息與重試按鈕。
3. **Given** 使用者尚無歷史紀錄，**When** 仍請求 AI 建議，**Then** 系統要求輸入起始偏好並給出基礎建議。

---

### Edge Cases

- 使用者輸入不支援的難度格式（例如 gym 自定義標記）時，系統需提示可接受格式。
- localStorage 容量不足導致儲存失敗時，系統需提示並避免靜默資料遺失。
- 裝置離線時請求 AI 建議，系統需提供離線友善提示與替代引導。
- 同一筆路線/日期/結果重複提交時，系統需維持可預期行為（允許重複或提示重複規則）。

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 系統 MUST 允許使用者記錄攀登資料：路線名稱、難度、日期、地點、結果（sent/attempt）、備註（選填）。
- **FR-002**: 系統 MUST 在儲存前驗證必填欄位與難度格式。
- **FR-003**: 系統 MUST 將攀登資料持久化於 localStorage，並在重新載入後正確還原。
- **FR-004**: 系統 MUST 依日期遞減顯示歷史紀錄。
- **FR-005**: 系統 MUST 提供難度趨勢與成功率儀表板。
- **FR-006**: 系統 MUST 整合 Gemini API，根據使用者能力與偏好生成建議路線。
- **FR-007**: 系統 MUST 在 Gemini/API/網路失敗時提供可重試且可理解的錯誤處理流程。
- **FR-008**: 系統 MUST 在新手或無歷史資料情境下提供明確引導。

### Key Entities *(include if feature involves data)*

- **ClimbEntry**：單筆攀登紀錄（路線、難度、日期、地點、結果、備註）。
- **ProgressSnapshot**：由歷史資料計算出的趨勢與成功率快照。
- **UserProfile**：使用者基本偏好（主場地、風格、目標、目前最高難度）。
- **AISuggestion**：Gemini 產生之建議路線與推薦理由。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 使用者完成一筆合法攀登紀錄的中位時間小於 60 秒。
- **SC-002**: 在 500 筆資料下，儀表板渲染完成時間小於 2 秒。
- **SC-003**: 在一般網路環境，95% 成功的 Gemini 請求於 5 秒內回應。
- **SC-004**: 至少 90% 首次使用者可在無外部協助下完成第一筆紀錄。
- **SC-005**: 核心流程符合 WCAG 2.1 AA（含色彩對比與鍵盤可操作性）。

## Assumptions

- v1 為單一使用者、local-first，不含帳號與雲端同步。
- 介面採 mobile-first（最低支援寬度 375px），並提供桌面響應。
- v1 僅支援 V-scale 與 YDS 難度系統。
- Gemini API 金鑰透過執行環境注入，不硬編碼於 repo。
- 圖表統計由前端依本地資料即時計算。
