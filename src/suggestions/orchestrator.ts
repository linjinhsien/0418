/**
 * Semantic Kernel-style Orchestrator
 *
 * Manages a registry of named "skills" and a simple sequential planner
 * that selects and executes skills based on the declared goal/intent.
 */

// ── Skill interface ──────────────────────────────────────────────────────────

export interface SkillContext {
  [key: string]: unknown;
}

export interface Skill<TInput = SkillContext, TOutput = SkillContext> {
  name: string;
  description: string;
  run(input: TInput): Promise<TOutput>;
}

// ── Kernel ───────────────────────────────────────────────────────────────────

export class SemanticKernel {
  private skills = new Map<string, Skill<any, any>>();

  register<TIn, TOut>(skill: Skill<TIn, TOut>): this {
    this.skills.set(skill.name, skill);
    return this;
  }

  get<TIn, TOut>(name: string): Skill<TIn, TOut> {
    const skill = this.skills.get(name);
    if (!skill) throw new Error(`Skill "${name}" not registered`);
    return skill;
  }

  /**
   * Sequential planner: runs a list of skill names in order,
   * merging each output into the shared context.
   */
  async plan(skillNames: string[], initialContext: SkillContext): Promise<SkillContext> {
    let ctx = { ...initialContext };
    for (const name of skillNames) {
      const skill = this.get(name);
      const output = await skill.run(ctx);
      ctx = { ...ctx, ...(output as SkillContext) };
    }
    return ctx;
  }
}

// ── Intent → plan mapping ────────────────────────────────────────────────────

import { SuggestionIntent } from './suggestionsService';

export function buildPlan(intent: SuggestionIntent): string[] {
  switch (intent) {
    case 'weakness':
      return ['feloSearch', 'weaknessAnalysis'];
    case 'training_plan':
      return ['feloSearch', 'trainingPlan'];
    case 'general':
    default:
      return ['feloSearch', 'routeSuggestions'];
  }
}
