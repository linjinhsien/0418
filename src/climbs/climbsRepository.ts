import { getDb } from '@/shared/db';
import { Climb } from './types';

export const climbsRepository = {
  async insert(climb: Climb): Promise<void> {
    const db = getDb();
    await db.runAsync(
      `INSERT INTO climbs (id, routeName, grade, gradeSystem, gradeWarning, date, location, result, notes, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        climb.id,
        climb.routeName,
        climb.grade,
        climb.gradeSystem,
        climb.gradeWarning ? 1 : 0,
        climb.date,
        climb.location ?? null,
        climb.result,
        climb.notes ?? null,
        climb.createdAt,
      ]
    );
  },

  async findAll(): Promise<Climb[]> {
    const db = getDb();
    const rows = await db.getAllAsync<{
      id: string;
      routeName: string;
      grade: string;
      gradeSystem: string;
      gradeWarning: number;
      date: string;
      location: string | null;
      result: string;
      notes: string | null;
      createdAt: string;
    }>('SELECT * FROM climbs ORDER BY date DESC, createdAt DESC');

    return rows.map((r) => ({
      id: r.id,
      routeName: r.routeName,
      grade: r.grade,
      gradeSystem: r.gradeSystem as Climb['gradeSystem'],
      gradeWarning: r.gradeWarning === 1,
      date: r.date,
      location: r.location ?? undefined,
      result: r.result as Climb['result'],
      notes: r.notes ?? undefined,
      createdAt: r.createdAt,
    }));
  },
};
