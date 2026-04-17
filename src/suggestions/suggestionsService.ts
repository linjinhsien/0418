import { SuggestionError } from '@/shared/errorTypes';
import { climbsService } from '@/climbs/climbsService';
import { GeminiClient } from './geminiClient';
import { feloSearchService } from './feloSearchService';
import { SemanticKernel, buildPlan, SkillContext } from './orchestrator';

// AgentDevelopKit Persona
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

export type SuggestionIntent = 'general' | 'weakness' | 'training_plan';

export interface SuggestionRequest {
  maxGrade: string;
  style: ClimbingStyle;
  intent?: SuggestionIntent;
}

// ── Streaming callback ───────────────────────────────────────────────────────

export type StreamChunkCallback = (chunk: string) => void;

// ── Service factory ──────────────────────────────────────────────────────────

export function createSuggestionsService(client: GeminiClient) {
  // Build kernel with registered skills
  const kernel = new SemanticKernel();

  // Skill: Felo Search — enriches context with real-time climbing info
  kernel.register({
    name: 'feloSearch',
    description: 'Fetches real-time climbing route info via Felo Search',
    async run(ctx: SkillContext) {
      const result = await feloSearchService.search(ctx.searchQuery as string);
      return {
        searchAnswer: result?.answer ?? '',
        searchResources: result?.resources ?? [],
      };
    },
  });

  // Skill: Route Suggestions
  kernel.register({
    name: 'routeSuggestions',
    description: 'Generates route suggestions via Gemini',
    async run(ctx: SkillContext) {
      const prompt = buildPrompt(ctx, '請推薦 3 條適合的路線或訓練目標。');
      return { prompt };
    },
  });

  // Skill: Weakness Analysis
  kernel.register({
    name: 'weaknessAnalysis',
    description: 'Analyses climber weaknesses via Gemini',
    async run(ctx: SkillContext) {
      const prompt = buildPrompt(ctx, '請分析這位攀岩者的潛在弱點並給予改進建議。');
      return { prompt };
    },
  });

  // Skill: Training Plan
  kernel.register({
    name: 'trainingPlan',
    description: 'Generates a 4-week training plan via Gemini',
    async run(ctx: SkillContext) {
      const prompt = buildPrompt(ctx, '請為這位攀岩者量身打造一個為期四週的訓練目標。');
      return { prompt };
    },
  });

  return {
    /** Non-streaming: returns full result */
    async getSuggestions(req: SuggestionRequest): Promise<SuggestionResult> {
      const guard = await preflightCheck();
      if (guard) return guard;

      const ctx = buildInitialContext(req);
      const plan = buildPlan(req.intent ?? 'general');
      const finalCtx = await kernel.plan(plan, ctx);

      try {
        const raw = await client.complete(finalCtx.prompt as string);
        return parseResult(raw, finalCtx.searchAnswer as string);
      } catch {
        return { status: 'error', error: 'api_error' };
      }
    },

    /** Streaming: calls onChunk for each text delta, resolves when done */
    async getSuggestionsStream(
      req: SuggestionRequest,
      onChunk: StreamChunkCallback
    ): Promise<SuggestionResult> {
      const guard = await preflightCheck();
      if (guard) return guard;

      const ctx = buildInitialContext(req);
      const plan = buildPlan(req.intent ?? 'general');
      const finalCtx = await kernel.plan(plan, ctx);

      try {
        const raw = await client.completeStream(finalCtx.prompt as string, onChunk);
        return parseResult(raw, finalCtx.searchAnswer as string);
      } catch {
        return { status: 'error', error: 'api_error' };
      }
    },
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

async function preflightCheck(): Promise<SuggestionResult | null> {
  if (typeof window !== 'undefined' && !window.navigator.onLine)
    return { status: 'error', error: 'offline' };
  const climbs = await climbsService.getClimbs();
  if (climbs.length === 0) return { status: 'error', error: 'no_history' };
  return null;
}

function buildInitialContext(req: SuggestionRequest): SkillContext {
  const queryMap: Record<SuggestionIntent, string> = {
    general: `最新的 ${req.style} 攀岩訓練建議與熱門 ${req.maxGrade} 難度路線`,
    weakness: `攀岩突破 ${req.maxGrade} 瓶頸的常見弱點與解決方法`,
    training_plan: `針對程度 ${req.maxGrade} 的 ${req.style} 四週攀岩訓練課表範例`,
  };
  return {
    maxGrade: req.maxGrade,
    style: req.style,
    searchQuery: queryMap[req.intent ?? 'general'],
  };
}

function buildPrompt(ctx: SkillContext, intentPrompt: string): string {
  const searchContext = ctx.searchAnswer
    ? `\n最新外部資訊：\n${ctx.searchAnswer}\n參考來源：${
        (ctx.searchResources as Array<{ link: string }>).map(r => r.link).join(', ')
      }`
    : '';

  return `
你現在的角色是：${COACH_PERSONA.name}
特質：${COACH_PERSONA.traits.join('、')}
專業範疇：${COACH_PERSONA.knowledgeDomain}

攀岩者資訊：
- 最高難度：${ctx.maxGrade}
- 偏好風格：${ctx.style}
${searchContext}

${intentPrompt}
請以 JSON 格式回應。
`.trim();
}

function parseResult(raw: string, searchAnswer: string): SuggestionResult {
  const jsonMatch = raw.match(/\[[\s\S]*\]/);
  const suggestions: AISuggestion[] = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
  return { status: 'success', suggestions, context: searchAnswer || undefined };
}
