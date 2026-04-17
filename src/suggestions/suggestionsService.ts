import { SuggestionError } from '@/shared/errorTypes';
import { GeminiClient } from './geminiClient';
import { skills } from './kernel/skills';

// AgentDevelopKit Persona Definition
const COACH_PERSONA = {
  name: '攀岩教練阿強',
  traits: ['專業', '嚴謹', '富有激勵性'],
  knowledgeDomain: '攀岩訓練科學與路線分析',
};

export type ClimbingStyle = 'bouldering' | 'sport' | 'trad';
export type SuggestionIntent = 'general' | 'weakness' | 'training_plan';

export interface AISuggestion {
  name: string;
  grade: string;
  style: ClimbingStyle;
  reason: string;
}

export type StreamChunkCallback = (chunk: string) => void;

export type SuggestionResult =
  | { status: 'success'; suggestions: AISuggestion[]; context?: string }
  | { status: 'error'; error: SuggestionError };

export interface SuggestionRequest {
  maxGrade: string;
  style: ClimbingStyle;
  intent?: SuggestionIntent;
  onStreamChunk?: StreamChunkCallback;
}

export function createSuggestionsService(client: GeminiClient) {
  return {
    async getSuggestions(req: SuggestionRequest): Promise<SuggestionResult> {
      const isOnline = typeof window !== 'undefined' ? window.navigator.onLine : true;
      if (!isOnline) return { status: 'error', error: 'offline' };

      // [Issue #3] Kernel 編排邏輯
      // 1. 抓取歷史數據
      const climbs = await skills.getUserClimbHistory();
      if (climbs.length === 0) return { status: 'error', error: 'no_history' };

      // 2. 執行分析技能
      const analysisContext = await skills.analyzeWeakness(climbs);

      // 3. 搜尋外部資訊
      let searchQuery = `最新的 ${req.style} 攀岩訓練建議與熱門 ${req.maxGrade} 難度路線`;
      if (req.intent === 'weakness') searchQuery = `攀岩突破 ${req.maxGrade} 瓶頸的常見弱點與解決方法`;
      const searchAnswer = await skills.searchExternal(searchQuery);

      // 4. 構建增強提示詞
      const prompt = `
你現在的角色是：${COACH_PERSONA.name}
特質：${COACH_PERSONA.traits.join('、')}
專業範疇：${COACH_PERSONA.knowledgeDomain}

使用者歷史背景：${analysisContext}
攀岩者目前輸入：
- 最高難度：${req.maxGrade}
- 偏好風格：${req.style}
- 意圖：${req.intent || '一般建議'}

外部搜尋參考：${searchAnswer}

請基於以上數據提供 3 條具體的建議，並以 JSON 格式回應。
`;

      try {
        // [Issue #4] 使用串流
        const raw = await client.completeStream(prompt, (chunk) => {
          if (req.onStreamChunk) req.onStreamChunk(chunk);
        });

        const jsonMatch = raw.match(/\[[\s\S]*\]/);
        const suggestions: AISuggestion[] = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
        return { 
          status: 'success', 
          suggestions,
          context: searchAnswer 
        };
      } catch (err) {
        console.error('Service Error:', err);
        return { status: 'error', error: 'api_error' };
      }
    },
  };
}
