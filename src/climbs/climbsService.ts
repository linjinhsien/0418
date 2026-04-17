import { v4 as uuidv4 } from 'uuid';
import { Climb, ClimbInput } from './types';
import { climbsRepository } from './climbsRepository';
import { classifyGrade } from '@/shared/gradeUtils';

export const climbsService = {
  async addClimb(input: ClimbInput): Promise<Climb> {
    // 1. 驗證必填欄位
    if (!input.routeName.trim() || !input.grade.trim() || !input.date) {
      throw new Error('請填寫所有必填欄位');
    }

    // 2. 難度分類
    const { gradeSystem, gradeWarning } = classifyGrade(input.grade);

    // 3. 建立完整的 Climb 物件
    const climb: Climb = {
      id: uuidv4(),
      routeName: input.routeName,
      grade: input.grade,
      gradeSystem,
      gradeWarning,
      date: input.date,
      location: input.location,
      result: input.result,
      notes: input.notes,
      createdAt: new Date().toISOString(),
    };

    // 4. 持久化至 Firestore (透過 Repository)
    await climbsRepository.insert(climb);
    
    return climb;
  },

  async getClimbs(): Promise<Climb[]> {
    return await climbsRepository.findAll();
  }
};
