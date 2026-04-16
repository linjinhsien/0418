import NetInfo from '@react-native-community/netinfo';
import { SuggestionError } from '@/shared/errorTypes';
import { climbsService } from '@/climbs/climbsService';
import { GeminiClient } from './geminiClient';

export type ClimbingStyle = 'bouldering' | 'sport' | 'trad';

export interface AISuggestion {
  name: string;
  grade: string;
  style: ClimbingStyle;
  reason: string;
}

export type SuggestionResult =
  | { status: 'success'; suggestions: AISuggestion[] }
  | { status: 'error'; error: SuggestionError };

export interface SuggestionRequest {
  maxGrade: string;
  style: ClimbingStyle;
}

export function createSuggestionsService(client: GeminiClient) {
  return {
    async getSuggestions(req: SuggestionRequest): Promise<SuggestionResult> {
      const netState = await NetInfo.fetch();
      if (!netState.isConnected) {
        return { status: 'error', error: 'offline' };
      }

      const climbs = await climbsService.getClimbs();
      if (climbs.length === 0) {
        return { status: 'error', error: 'no_history' };
      }

      const prompt =
        `攀岩者資訊：\n- 最高難度：${req.maxGrade}\n- 偏好風格：${req.style}\n\n請推薦 3 條適合的路線。`;

      try {
        const raw = await client.complete(prompt);
        const jsonMatch = raw.match(/\[[\s\S]*\]/);
        const suggestions: AISuggestion[] = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
        return { status: 'success', suggestions };
      } catch {
        return { status: 'error', error: 'api_error' };
      }
    },
  };
}
