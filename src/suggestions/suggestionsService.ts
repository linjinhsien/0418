import { SuggestionError } from '@/shared/errorTypes';
import { GeminiClient } from './geminiClient';
import { SemanticKernel, buildPlan } from './orchestrator';
import { skillRegistry } from './kernel/skills';

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

// 初始化 Kernel 並註冊技能
const kernel = new SemanticKernel();
skillRegistry.forEach(skill => kernel.register(skill));

export function createSuggestionsService(client: GeminiClient) {
  return {
    async getSuggestions(req: SuggestionRequest): Promise<SuggestionResult> {
      const isOnline = typeof window !== 'undefined' ? window.navigator.onLine : true;
      if (!isOnline) return { status: 'error', error: 'offline' };

      try {
        // 1. 使用 Semantic Kernel 進行任務編排 (Orchestration)
        const intent = req.intent || 'general';
        const plan = buildPlan(intent);
        
        // 執行計畫獲取上下文
        const context = await kernel.plan(plan, { 
          maxGrade: req.maxGrade, 
          style: req.style 
        });

        // 2. 構建並增強提示詞 (基於 Kernel 產出的上下文)
        const analysisContext = context.analysis as string || '初次使用，尚無歷史紀錄。';
        const isTrainingPlan = !!context.planType;

        const prompt = `
你現在的角色是：${COACH_PERSONA.name}
特質：${COACH_PERSONA.traits.join('、')}
專業範疇：${COACH_PERSONA.knowledgeDomain}

使用者歷史背景分析：${analysisContext}
攀岩者目前輸入：
- 最高難度：${req.maxGrade}
- 偏好風格：${req.style}
- 意圖：${isTrainingPlan ? '生成四週訓練計畫' : (intent === 'weakness' ? '深度弱點分析' : '一般路線建議')}

${isTrainingPlan ? '請提供一個為期四週的訓練建議。' : ''}
請基於以上數據與您的專業攀岩知識，提供 3 條具體的建議，並以 JSON 陣列格式回應。
格式範例：[{"name": "建議名稱", "grade": "建議難度", "style": "風格", "reason": "詳細原因"}]
`;

        const raw = await client.completeStream(prompt, (chunk) => {
          if (req.onStreamChunk) req.onStreamChunk(chunk);
        });

        const jsonMatch = raw.match(/\[[\s\S]*\]/);
        const suggestions: AISuggestion[] = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
        
        return { 
          status: 'success', 
          suggestions 
        };
      } catch (err) {
        console.error('Service Error:', err);
        return { status: 'error', error: 'api_error' };
      }
    },
  };
}
