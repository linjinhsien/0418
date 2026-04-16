export type GradeSystem = 'v-scale' | 'yds' | 'unknown';

export interface GradeClassification {
  gradeSystem: GradeSystem;
  gradeWarning: boolean;
}

const V_SCALE = /^V([0-9]|1[0-7]|B)$/i;
const YDS = /^5\.(([0-9])|1[0-5][abcd]?)$/i;

export const GradeUtils = {
  isVScale(grade: string): boolean {
    return V_SCALE.test(grade);
  },

  isYDS(grade: string): boolean {
    return YDS.test(grade);
  },

  classify(grade: string): GradeClassification {
    if (GradeUtils.isVScale(grade)) {
      return { gradeSystem: 'v-scale', gradeWarning: false };
    }
    if (GradeUtils.isYDS(grade)) {
      return { gradeSystem: 'yds', gradeWarning: false };
    }
    return { gradeSystem: 'unknown', gradeWarning: true };
  },
};
