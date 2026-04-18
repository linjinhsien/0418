import * as fc from 'fast-check';
import { describe, it, expect } from 'vitest';
import { GradeUtils } from '../gradeUtils';

const validVScale = ['V0', 'V1', 'V5', 'V10', 'V17', 'VB', 'v5', 'vb'];
const validYDS = ['5.0', '5.9', '5.10a', '5.12d', '5.15c', '5.15d'];
const invalid = ['6a', 'E1', '7c+', 'V18', '5.16a', '', 'easy', '5.'];

describe('GradeUtils', () => {
  // Property 1: classify is total — never throws, always returns one of three values
  it('Property 1: classify is total and exhaustive for any string', () => {
    fc.assert(
      fc.property(fc.string(), (grade) => {
        const result = GradeUtils.classify(grade);
        expect(['v-scale', 'yds', 'unknown']).toContain(result.gradeSystem);
        expect(typeof result.gradeWarning).toBe('boolean');
      }),
      { numRuns: 200 }
    );
  });

  // Property 2: unknown grades always carry a warning
  it('Property 2: non-V-scale non-YDS grades always have gradeWarning=true', () => {
    fc.assert(
      fc.property(
        fc.string().filter((s) => !GradeUtils.isVScale(s) && !GradeUtils.isYDS(s)),
        (grade) => {
          const result = GradeUtils.classify(grade);
          expect(result.gradeSystem).toBe('unknown');
          expect(result.gradeWarning).toBe(true);
        }
      ),
      { numRuns: 200 }
    );
  });

  // Property 3: valid grades never carry a warning
  it('Property 3: valid V-scale grades have gradeWarning=false', () => {
    validVScale.forEach((grade) => {
      const result = GradeUtils.classify(grade);
      expect(result.gradeSystem).toBe('v-scale');
      expect(result.gradeWarning).toBe(false);
    });
  });

  it('Property 3: valid YDS grades have gradeWarning=false', () => {
    validYDS.forEach((grade) => {
      const result = GradeUtils.classify(grade);
      expect(result.gradeSystem).toBe('yds');
      expect(result.gradeWarning).toBe(false);
    });
  });

  it('invalid grades return unknown with warning', () => {
    invalid.forEach((grade) => {
      const result = GradeUtils.classify(grade);
      expect(result.gradeSystem).toBe('unknown');
      expect(result.gradeWarning).toBe(true);
    });
  });
});
