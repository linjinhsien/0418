import * as SQLite from 'expo-sqlite';
import { MigrationError } from './errorTypes';

export interface Migration {
  version: number;
  up: string;
}

const MIGRATIONS: Migration[] = [
  {
    version: 1,
    up: `
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version INTEGER PRIMARY KEY,
        applied_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS climbs (
        id          TEXT PRIMARY KEY,
        routeName   TEXT NOT NULL,
        grade       TEXT NOT NULL,
        gradeSystem TEXT NOT NULL DEFAULT 'unknown',
        gradeWarning INTEGER NOT NULL DEFAULT 0,
        date        TEXT NOT NULL,
        location    TEXT,
        result      TEXT NOT NULL,
        notes       TEXT,
        createdAt   TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS user_profile (
        id            TEXT PRIMARY KEY DEFAULT 'singleton',
        name          TEXT,
        homeGym       TEXT,
        climbingSince TEXT,
        goals         TEXT
      );
    `,
  },
];

let _db: SQLite.SQLiteDatabase | null = null;

export function getDb(): SQLite.SQLiteDatabase {
  if (!_db) throw new Error('Database not initialized. Call initDb() first.');
  return _db;
}

export async function initDb(): Promise<void> {
  _db = await SQLite.openDatabaseAsync('climber.db');

  // Ensure migrations table exists before querying it
  await _db.execAsync(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY,
      applied_at TEXT NOT NULL
    );
  `);

  const applied = await _db.getAllAsync<{ version: number }>(
    'SELECT version FROM schema_migrations ORDER BY version ASC'
  );
  const appliedVersions = new Set(applied.map((r) => r.version));

  for (const migration of MIGRATIONS) {
    if (appliedVersions.has(migration.version)) continue;
    try {
      await _db.execAsync(migration.up);
      await _db.runAsync(
        'INSERT INTO schema_migrations (version, applied_at) VALUES (?, ?)',
        [migration.version, new Date().toISOString()]
      );
    } catch (err) {
      const error: MigrationError = {
        type: 'migration_error',
        version: migration.version,
        cause: err instanceof Error ? err.message : String(err),
      };
      throw error;
    }
  }
}
