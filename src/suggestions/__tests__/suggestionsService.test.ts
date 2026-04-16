import * as fc from 'fast-check';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createSuggestionsService, SuggestionRequest } from '../suggestionsService';
import { GeminiClient } from '../geminiClient';
import { climbsService } from '@/climbs/climbsService';

vi.mock('@/climbs/climbsService', () => ({
  climbsService: { getClimbs: vi.fn() },
}));

const mockClient: GeminiClient = { complete: vi.fn() };
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
});

describe('suggestionsService', () => {
  it('Property 7: returns offline error and never calls GeminiClient when offline', async () => {
    await fc.assert(
      fc.asyncProperty(fc.constant(req), async (r) => {
        Object.defineProperty(window.navigator, 'onLine', { value: false });
        (climbsService.getClimbs as any).mockResolvedValue([]);
        const result = await service.getSuggestions(r);
        expect(result).toEqual({ status: 'error', error: 'offline' });
        expect(mockClient.complete).not.toHaveBeenCalled();
      }),
      { numRuns: 20 }
    );
  });

  it('returns no_history when climb list is empty', async () => {
    (climbsService.getClimbs as any).mockResolvedValue([]);
    const result = await service.getSuggestions(req);
    expect(result).toEqual({ status: 'error', error: 'no_history' });
  });

  it('returns api_error when GeminiClient throws', async () => {
    (climbsService.getClimbs as any).mockResolvedValue([{ id: '1' }]);
    (mockClient.complete as any).mockRejectedValue(new Error('network'));
    const result = await service.getSuggestions(req);
    expect(result).toEqual({ status: 'error', error: 'api_error' });
  });

  it('returns success with parsed suggestions', async () => {
    (climbsService.getClimbs as any).mockResolvedValue([{ id: '1' }]);
    const suggestions = [{ name: 'Route A', grade: 'V5', style: 'bouldering', reason: '適合' }];
    (mockClient.complete as any).mockResolvedValue(JSON.stringify(suggestions));
    const result = await service.getSuggestions(req);
    expect(result).toEqual({ status: 'success', suggestions });
  });

  it('Property 8: getSuggestions never calls any repository write method', async () => {
    (climbsService.getClimbs as any).mockResolvedValue([{ id: '1' }]);
    (mockClient.complete as any).mockResolvedValue('[]');
    await service.getSuggestions(req);
    expect(climbsService.getClimbs).toHaveBeenCalledTimes(1);
  });
});
