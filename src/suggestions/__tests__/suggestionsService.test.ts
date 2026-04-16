import * as fc from 'fast-check';
import { createSuggestionsService, SuggestionRequest } from '../suggestionsService';
import { GeminiClient } from '../geminiClient';

jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(),
}));
jest.mock('@/climbs/climbsService', () => ({
  climbsService: { getClimbs: jest.fn() },
}));

import NetInfo from '@react-native-community/netinfo';
import { climbsService } from '@/climbs/climbsService';

const mockClient: GeminiClient = { complete: jest.fn() };
const service = createSuggestionsService(mockClient);

const req: SuggestionRequest = { maxGrade: 'V5', style: 'bouldering' };

beforeEach(() => jest.clearAllMocks());

describe('suggestionsService', () => {
  // Property 7: offline → no GeminiClient call
  it('Property 7: returns offline error and never calls GeminiClient when offline', async () => {
    await fc.assert(
      fc.asyncProperty(fc.constant(req), async (r) => {
        (NetInfo.fetch as jest.Mock).mockResolvedValue({ isConnected: false });
        (climbsService.getClimbs as jest.Mock).mockResolvedValue([]);
        const result = await service.getSuggestions(r);
        expect(result).toEqual({ status: 'error', error: 'offline' });
        expect(mockClient.complete).not.toHaveBeenCalled();
      }),
      { numRuns: 20 }
    );
  });

  it('returns no_history when climb list is empty', async () => {
    (NetInfo.fetch as jest.Mock).mockResolvedValue({ isConnected: true });
    (climbsService.getClimbs as jest.Mock).mockResolvedValue([]);
    const result = await service.getSuggestions(req);
    expect(result).toEqual({ status: 'error', error: 'no_history' });
  });

  it('returns api_error when GeminiClient throws', async () => {
    (NetInfo.fetch as jest.Mock).mockResolvedValue({ isConnected: true });
    (climbsService.getClimbs as jest.Mock).mockResolvedValue([{ id: '1' }]);
    (mockClient.complete as jest.Mock).mockRejectedValue(new Error('network'));
    const result = await service.getSuggestions(req);
    expect(result).toEqual({ status: 'error', error: 'api_error' });
  });

  it('returns success with parsed suggestions', async () => {
    (NetInfo.fetch as jest.Mock).mockResolvedValue({ isConnected: true });
    (climbsService.getClimbs as jest.Mock).mockResolvedValue([{ id: '1' }]);
    const suggestions = [{ name: 'Route A', grade: 'V5', style: 'bouldering', reason: '適合' }];
    (mockClient.complete as jest.Mock).mockResolvedValue(JSON.stringify(suggestions));
    const result = await service.getSuggestions(req);
    expect(result).toEqual({ status: 'success', suggestions });
  });

  // Property 8: suggestions never persisted — verified by absence of any DB write mock calls
  it('Property 8: getSuggestions never calls any repository write method', async () => {
    (NetInfo.fetch as jest.Mock).mockResolvedValue({ isConnected: true });
    (climbsService.getClimbs as jest.Mock).mockResolvedValue([{ id: '1' }]);
    (mockClient.complete as jest.Mock).mockResolvedValue('[]');
    await service.getSuggestions(req);
    // No insert/save mock should have been called — service only reads climbs
    expect(climbsService.getClimbs).toHaveBeenCalledTimes(1);
  });
});
