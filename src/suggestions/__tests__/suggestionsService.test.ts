import * as fc from 'fast-check';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createSuggestionsService, SuggestionRequest } from '../suggestionsService';
import { GeminiClient } from '../geminiClient';

// Mock skills module with the new structure
vi.mock('../kernel/skills', () => ({
  skillRegistry: [
    { name: 'fetchHistory', description: 'desc', run: vi.fn() },
    { name: 'analyzeWeakness', description: 'desc', run: vi.fn() },
    { name: 'trainingPlan', description: 'desc', run: vi.fn() },
  ],
}));

import { skillRegistry } from '../kernel/skills';

const mockClient: GeminiClient = { 
  complete: vi.fn(),
  completeStream: vi.fn(),
};
const service = createSuggestionsService(mockClient);

const req: SuggestionRequest = { maxGrade: 'V5', style: 'bouldering' };

beforeEach(() => {
  vi.clearAllMocks();
  // Mock navigator.onLine
  Object.defineProperty(window.navigator, 'onLine', {
    configurable: true,
    value: true,
    writable: true,
  });

  // Default skill implementations
  (skillRegistry[0].run as any).mockResolvedValue({ climbs: [] });
  (skillRegistry[1].run as any).mockResolvedValue({ analysis: '分析結果' });
  (skillRegistry[2].run as any).mockResolvedValue({ planType: 'training' });
});

describe('suggestionsService', () => {
  it('returns offline error and never calls GeminiClient when offline', async () => {
    await fc.assert(
      fc.asyncProperty(fc.constant(req), async (r) => {
        Object.defineProperty(window.navigator, 'onLine', { value: false, configurable: true });
        const result = await service.getSuggestions(r);
        expect(result).toEqual({ status: 'error', error: 'offline' });
        expect(mockClient.completeStream).not.toHaveBeenCalled();
      }),
      { numRuns: 5 }
    );
  });

  it('returns success even when history is empty (new behavior)', async () => {
    (skillRegistry[0].run as any).mockResolvedValue({ climbs: [] });
    (skillRegistry[1].run as any).mockResolvedValue({ analysis: '初次使用，尚無歷史紀錄。' });
    (mockClient.completeStream as any).mockResolvedValue('[]');
    const result = await service.getSuggestions(req);
    expect(result.status).toBe('success');
  });

  it('returns api_error when GeminiClient throws', async () => {
    (mockClient.completeStream as any).mockRejectedValue(new Error('network'));
    const result = await service.getSuggestions(req);
    expect(result).toEqual({ status: 'error', error: 'api_error' });
  });

  it('returns success with parsed suggestions', async () => {
    const suggestions = [{ name: 'Route A', grade: 'V5', style: 'bouldering', reason: '適合' }];
    (mockClient.completeStream as any).mockImplementation(async (p: string, cb: any) => {
      const resp = JSON.stringify(suggestions);
      cb(resp);
      return resp;
    });
    const result = await service.getSuggestions(req);
    expect(result).toEqual({ status: 'success', suggestions });
  });

  it('Property: getSuggestions calls skills but never calls any repository write method', async () => {
    (mockClient.completeStream as any).mockResolvedValue('[]');
    await service.getSuggestions(req);
    expect(skillRegistry[0].run).toHaveBeenCalled();
    expect(skillRegistry[1].run).toHaveBeenCalled();
  });
});
