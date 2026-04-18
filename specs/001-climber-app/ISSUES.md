# GitHub Issues: Climber App - AI & Maps Enhancement

## [Issue #1] 實作多意圖 AI 助理 (Agentic UI)
**狀態**: ⏳ 已完成 UI 與基礎 RAG，需強化深度分析邏輯。
**描述**: 
- 加入「分析弱點」與「四週計畫」功能按鈕。
- 根據意圖動態觸發 Felo Search 獲取不同領域的 Context。
- **TODO**: 整合 `ClimbList` 資料至「分析弱點」的 Prompt 中，實現資料驅動的建議。

## [Issue #2] 升級地點儲存與地圖視覺化
**狀態**: ✅ 已完成。
**描述**: 
- 修正 `db.ts` 中 `FirestoreDB` 與 `LocalDB` 的 INSERT 參數映射，確保 `locationId`（index 7）被正確持久化。
- `ClimbList` 已加入點擊跳轉至 Google Maps 功能（含 `query_place_id`）。

## [Issue #3] 實作 Semantic Kernel 編排器
**狀態**: ✅ 已完成。
**描述**: 
- 新增 `orchestrator.ts`：`SemanticKernel` 類別、`Skill` 介面、`buildPlan()` 意圖映射。
- 重構 `suggestionsService.ts`：註冊 `feloSearch`、`routeSuggestions`、`weaknessAnalysis`、`trainingPlan` 四個技能，透過 `kernel.plan()` 進行意圖導向編排。

## [Issue #4] 實作 AI 建議串流顯示 (Streaming UX)
**狀態**: ✅ 已完成。
**描述**: 
- `geminiClient.ts` 新增 `completeStream()`，使用 Vertex AI `generateContentStream` 逐塊回傳。
- `suggestionsService.ts` 新增 `getSuggestionsStream()`，透過 `onChunk` callback 傳遞串流片段。
- `SuggestionsScreen.tsx` 串流期間即時顯示原始 JSON 輸出（含游標動畫），完成後切換為解析後的建議卡片。
