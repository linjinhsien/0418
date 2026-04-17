import { SuggestionError } from '@/shared/errorTypes';
import { climbsService } from '@/climbs/climbsService';
import { GeminiClient } from './geminiClient';
import { feloSearchService } from './feloSearchService';

// AgentDevelopKit Persona Definition
const COACH_PERSONA = {
  name: '攀岩教練阿強',
  traits: ['專業', '嚴謹', '富有激勵性'],
  knowledgeDomain: '攀岩訓練科學與路線分析',
};

export type ClimbingStyle = 'bouldering' | 'sport' | 'trad';

export interface AISuggestion {
  name: string;
  grade: string;
  style: ClimbingStyle;
  reason: string;
}

export type SuggestionResult =
  | { status: 'success'; suggestions: AISuggestion[]; context?: string }
  | { status: 'error'; error: SuggestionError };

export interface SuggestionRequest {
  maxGrade: string;
  style: ClimbingStyle;
}

export function createSuggestionsService(client: GeminiClient) {
  return {
    async getSuggestions(req: SuggestionRequest): Promise<SuggestionResult> {
      const isOnline = typeof window !== 'undefined' ? window.navigator.onLine : true;
      if (!isOnline) return { status: 'error', error: 'offline' };

      const climbs = await climbsService.getClimbs();
      if (climbs.length === 0) return { status: 'error', error: 'no_history' };

      // 1. 執行 Search-Augmented Generation (RAG)
      const searchQuery = `最新的 ${req.style} 攀岩訓練建議與熱門 ${req.maxGrade} 難度路線`;
      const searchResult = await feloSearchService.search(searchQuery);

      const searchContext = searchResult 
        ? `\n最新外部資訊：\n${searchResult.answer}\n參考來源：${searchResult.resources.map(r => r.link).join(', ')}`
        : '';

      // 2. 構建增強提示詞 (Enhanced Prompt)
      const prompt = `
你現在的角色是：${COACH_PERSONA.name}
特質：${COACH_PERSONA.traits.join('、')}
專業範疇：${COACH_PERSONA.knowledgeDomain}

攀岩者資訊：
- 最高難度：${req.maxGrade}
- 偏好風格：${req.style}
${searchContext}

請結合以上最新資訊與攀岩者背景，推薦 3 條適合的路線或訓練目標。
`;

      try {
        const raw = await client.complete(prompt);
        const jsonMatch = raw.match(/\[[\s\S]*\]/);
        const suggestions: AISuggestion[] = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
        return { 
          status: 'success', 
          suggestions,
          context: searchResult?.answer 
        };
      } catch {
        return { status: 'error', error: 'api_error' };
      }
    },
  };
}

