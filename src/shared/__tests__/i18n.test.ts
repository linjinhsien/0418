import * as fc from 'fast-check';

// Mock expo-localization before importing i18n
jest.mock('expo-localization', () => ({ getLocales: () => [{ languageTag: 'zh-TW' }] }));

import { t } from '../i18n';
import en from '../en';

// Flatten nested keys for testing
function flattenKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k;
    return typeof v === 'object' && v !== null
      ? flattenKeys(v as Record<string, unknown>, key)
      : [key];
  });
}

const allKeys = flattenKeys(en as unknown as Record<string, unknown>);

describe('i18n', () => {
  // Property 9: key lookup never returns null/empty
  it('Property 9: t(key) returns non-empty string for all known keys', () => {
    allKeys.forEach((key) => {
      const result = t(key);
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  it('Property 9 (fast-check): t(key) never returns empty for any known key', () => {
    fc.assert(
      fc.property(fc.constantFrom(...allKeys), (key) => {
        const result = t(key);
        return typeof result === 'string' && result.length > 0;
      }),
      { numRuns: 100 }
    );
  });

  it('falls back to key string for unknown keys (non-empty)', () => {
    const result = t('nonexistent.key.xyz');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});
