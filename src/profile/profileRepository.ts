import { getDb } from '@/shared/db';

export interface UserProfile {
  id: 'singleton';
  name?: string;
  homeGym?: string;
  climbingSince?: string;
  goals?: string;
}

export const profileRepository = {
  async get(): Promise<UserProfile | null> {
    const db = getDb();
    const row = await db.getFirstAsync<{
      id: string;
      name: string | null;
      homeGym: string | null;
      climbingSince: string | null;
      goals: string | null;
    }>('SELECT * FROM user_profile WHERE id = ?', ['singleton']);

    if (!row) return null;
    return {
      id: 'singleton',
      name: row.name ?? undefined,
      homeGym: row.homeGym ?? undefined,
      climbingSince: row.climbingSince ?? undefined,
      goals: row.goals ?? undefined,
    };
  },

  async save(profile: UserProfile): Promise<void> {
    const db = getDb();
    await db.runAsync(
      `INSERT INTO user_profile (id, name, homeGym, climbingSince, goals)
       VALUES ('singleton', ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         name = excluded.name,
         homeGym = excluded.homeGym,
         climbingSince = excluded.climbingSince,
         goals = excluded.goals`,
      [
        profile.name ?? null,
        profile.homeGym ?? null,
        profile.climbingSince ?? null,
        profile.goals ?? null,
      ]
    );
  },
};
