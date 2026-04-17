export type GradeSystem = 'V-scale' | 'YDS' | 'unknown';

export interface GradeClassification {
  gradeSystem: GradeSystem;
  gradeWarning: boolean;
}

/**
 * 根據難度字串判斷其所屬系統 (V-scale 或 YDS)
 * V-scale: V0, V1, ..., V17, VB
 * YDS: 5.0, 5.1, ..., 5.15a/b/c/d
 */
export function classifyGrade(grade: string): GradeClassification {
  const vScaleRegex = /^V([0-9]|1[0-7]|B)$/i;
  const ydsRegex = /^5\.(([0-9])|1[0-5][abcd]?)$/i;

  if (vScaleRegex.test(grade)) {
    return {
      gradeSystem: 'V-scale',
      gradeWarning: false,
    };
  }

  if (ydsRegex.test(grade)) {
    return {
      gradeSystem: 'YDS',
      gradeWarning: false,
    };
  }

  return {
    gradeSystem: 'unknown',
    gradeWarning: true,
  };
}
