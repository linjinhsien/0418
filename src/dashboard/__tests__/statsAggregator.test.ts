import * as fc from 'fast-check';
import { statsAggregator } from '../statsAggregator';
import { Climb } from '@/climbs/types';

const makeClimb = (overrides: Partial<Climb> = {}): Climb => ({
  id: '1',
  routeName: 'Test',
  grade: 'V5',
  gradeSystem: 'v-scale',
  gradeWarning: false,
  date: '2026-04-16',
  result: 'sent',
  createdAt: new Date().toISOString(),
  ...overrides,
});

const climbArb = fc.record({
  id: fc.uuid(),
  routeName: fc.string({ minLength: 1 }),
  grade: fc.constantFrom('V3', 'V5', '5.10a', 'custom'),
  gradeSystem: fc.constantFrom('v-scale' as const, 'yds' as const, 'unknown' as const),
  gradeWarning: fc.boolean(),
  date: fc.constant('2026-04-16'),
  result: fc.constantFrom('sent' as const, 'attempt' as const),
  createdAt: fc.constant(new Date().toISOString()),
});

describe('statsAggregator', () => {
  it('returns zeros for empty list', () => {
    const stats = statsAggregator.compute([]);
    expect(stats).toEqual({ totalClimbs: 0, totalSends: 0, totalAttempts: 0, byGrade: {} });
  });

  // Property 5: stats consistent with climb list
  it('Property 5: totalClimbs, totalSends, totalAttempts match list counts', () => {
    fc.assert(
      fc.property(fc.array(climbArb), (climbs) => {
        const stats = statsAggregator.compute(climbs);
        expect(stats.totalClimbs).toBe(climbs.length);
        expect(stats.totalSends).toBe(climbs.filter((c) => c.result === 'sent').length);
        expect(stats.totalAttempts).toBe(climbs.filter((c) => c.result === 'attempt').length);
      }),
      { numRuns: 200 }
    );
  });

  // Property 6: byGrade sum equals totalClimbs
  it('Property 6: sum of byGrade values equals totalClimbs', () => {
    fc.assert(
      fc.property(fc.array(climbArb), (climbs) => {
        const stats = statsAggregator.compute(climbs);
        const sum = Object.values(stats.byGrade).reduce((a, b) => a + b, 0);
        expect(sum).toBe(stats.totalClimbs);
      }),
      { numRuns: 200 }
    );
  });

  it('single sent climb', () => {
    const stats = statsAggregator.compute([makeClimb({ result: 'sent', grade: 'V3' })]);
    expect(stats).toEqual({ totalClimbs: 1, totalSends: 1, totalAttempts: 0, byGrade: { V3: 1 } });
  });

  it('single attempt climb', () => {
    const stats = statsAggregator.compute([makeClimb({ result: 'attempt', grade: 'V5' })]);
    expect(stats).toEqual({ totalClimbs: 1, totalSends: 0, totalAttempts: 1, byGrade: { V5: 1 } });
  });
});
