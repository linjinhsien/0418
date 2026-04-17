import { feloSearchService } from '../feloSearchService';
import { climbsRepository } from '@/climbs/climbsRepository';
import { Climb } from '@/climbs/types';

export const skills = {
  async searchExternal(query: string) {
    const result = await feloSearchService.search(query);
    return result ? result.answer : '未能獲取外部資訊。';
  },

  async getUserClimbHistory(): Promise<Climb[]> {
    return await climbsRepository.findAll();
  },

  async analyzeWeakness(climbs: Climb[]): Promise<string> {
    if (climbs.length === 0) return '尚無攀岩紀錄可供分析。';
    const sentCount = climbs.filter(c => c.result === 'sent').length;
    const total = climbs.length;
    const rate = Math.round((sentCount / total) * 100);
    return `使用者總計有 ${total} 筆紀錄，完攀率為 ${rate}%。`;
  }
};
