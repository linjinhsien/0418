import { GradeSystem } from '@/shared/gradeUtils';

export type ClimbResult = 'sent' | 'attempt';

export interface Climb {
  id: string;
  routeName: string;
  grade: string;
  gradeSystem: GradeSystem;
  gradeWarning: boolean;
  date: string;        // YYYY-MM-DD
  location?: string;
  result: ClimbResult;
  notes?: string;
  createdAt: string;   // ISO 8601
}

export interface ClimbInput {
  routeName: string;
  grade: string;
  date: string;
  result: ClimbResult;
  location?: string;
  notes?: string;
}
