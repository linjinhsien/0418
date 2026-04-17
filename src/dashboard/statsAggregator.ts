import { Climb } from '@/climbs/types';

export interface ClimbStats {
  totalClimbs: number;
  totalSends: number;
  totalAttempts: number;
  byGrade: Record<string, number>;
}

export const statsAggregator = {
  compute(climbs: Climb[]): ClimbStats {
    const byGrade: Record<string, number> = {};
    let totalSends = 0;

    for (const c of climbs) {
      if (c.result === 'sent') totalSends++;
      byGrade[c.grade] = (byGrade[c.grade] ?? 0) + 1;
    }

    return {
      totalClimbs: climbs.length,
      totalSends,
      totalAttempts: climbs.length - totalSends,
      byGrade,
    };
  },
};
