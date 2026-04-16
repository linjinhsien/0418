import { v4 as uuidv4 } from 'uuid';
import { GradeUtils } from '@/shared/gradeUtils';
import { climbsRepository } from './climbsRepository';
import { Climb, ClimbInput } from './types';

export type ValidationErrors = Partial<Record<keyof ClimbInput, string>>;

function validate(input: ClimbInput): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!input.routeName?.trim()) errors.routeName = 'required';
  if (!input.grade?.trim()) errors.grade = 'required';
  if (!input.date?.trim()) errors.date = 'required';
  if (!input.result) errors.result = 'required';
  return errors;
}

export const climbsService = {
  async addClimb(input: ClimbInput): Promise<Climb> {
    const errors = validate(input);
    if (Object.keys(errors).length > 0) {
      throw Object.assign(new Error('Validation failed'), { errors });
    }

    const { gradeSystem, gradeWarning } = GradeUtils.classify(input.grade);

    const climb: Climb = {
      id: uuidv4(),
      routeName: input.routeName.trim(),
      grade: input.grade.trim(),
      gradeSystem,
      gradeWarning,
      date: input.date,
      location: input.location?.trim() || undefined,
      result: input.result,
      notes: input.notes?.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    await climbsRepository.insert(climb);
    return climb;
  },

  async getClimbs(): Promise<Climb[]> {
    return climbsRepository.findAll();
  },
};
