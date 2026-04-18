import { climbsRepository } from '@/climbs/climbsRepository';
import { Climb } from '@/climbs/types';
import { Skill, SkillContext } from '../orchestrator';

// ── 歷史數據抓取技能 ───────────────────────────────────────────────────────

export const FetchHistorySkill: Skill<SkillContext, { climbs: Climb[] }> = {
  name: 'fetchHistory',
  description: '從 Firestore 抓取使用者的所有攀岩歷史紀錄',
  async run() {
    const climbs = await climbsRepository.findAll();
    return { climbs };
  }
};

// ── 弱點分析技能 ───────────────────────────────────────────────────────────

export const AnalyzeWeaknessSkill: Skill<{ climbs: Climb[] }, { analysis: string }> = {
  name: 'analyzeWeakness',
  description: '分析攀岩者的數據以找出弱點',
  async run({ climbs }) {
    if (!climbs || climbs.length === 0) {
      return { analysis: '使用者尚無攀岩紀錄，建議從基礎力量與技巧開始。' };
    }
    const sentCount = climbs.filter(c => c.result === 'sent').length;
    const rate = Math.round((sentCount / climbs.length) * 100);
    const topGrade = climbs.reduce((max, c) => (c.grade > max ? c.grade : max), '');
    
    return { 
      analysis: `使用者總計有 ${climbs.length} 筆紀錄，完攀率為 ${rate}%。最高嘗試難度為 ${topGrade}。` 
    };
  }
};

// ── 訓練計畫生成技能 ───────────────────────────────────────────────────────

export const TrainingPlanSkill: Skill<SkillContext, { planType: string }> = {
  name: 'trainingPlan',
  description: '標記當前意圖為訓練計畫生成',
  async run() {
    return { planType: '4-week-intensive' };
  }
};

// ── 匯出所有技能 ───────────────────────────────────────────────────────────

export const skillRegistry = [
  FetchHistorySkill,
  AnalyzeWeaknessSkill,
  TrainingPlanSkill
];
