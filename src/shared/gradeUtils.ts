export type GradeSystem = 'v-scale' | 'yds' | 'unknown';

export interface GradeClassification {
  gradeSystem: GradeSystem;
  gradeWarning: boolean;
}

const vScaleRegex = /^V([0-9]|1[0-7]|B)$/i;
const ydsRegex = /^5\.(([0-9])|1[0-5][abcd]?)$/i;

export function classifyGrade(grade: string): GradeClassification {
  if (vScaleRegex.test(grade)) return { gradeSystem: 'v-scale', gradeWarning: false };
  if (ydsRegex.test(grade)) return { gradeSystem: 'yds', gradeWarning: false };
  return { gradeSystem: 'unknown', gradeWarning: true };
}

export const GradeUtils = {
  classify: classifyGrade,
  isVScale: (grade: string) => vScaleRegex.test(grade),
  isYDS: (grade: string) => ydsRegex.test(grade),
};
