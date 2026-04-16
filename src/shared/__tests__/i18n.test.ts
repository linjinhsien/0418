import * as fc from 'fast-check';
import { describe, it, expect, vi } from 'vitest';
import { t } from '../i18n';
import en from '../i18n/en';

// Flatten nested keys for testing
function flattenKeys(obj: Record<string, any>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k;
    return typeof v === 'object' && v !== null
      ? flattenKeys(v, key)
      : [key];
  });
}

const allKeys = flattenKeys(en);

describe('i18n', () => {
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
