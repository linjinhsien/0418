import { MigrationError } from './errorTypes';

export interface DB {
  execAsync(sql: string): Promise<void>;
  getAllAsync<T>(sql: string, params?: any[]): Promise<T[]>;
  runAsync(sql: string, params?: any[]): Promise<void>;
}

// Simple browser-based mock using localStorage for persistence
class LocalDB implements DB {
  async execAsync(sql: string): Promise<void> {}

  async getAllAsync<T>(sql: string, params: any[] = []): Promise<T[]> {
    if (sql.includes('SELECT version FROM schema_migrations')) {
      return [{ version: 1 }] as any;
    }
    if (sql.includes('FROM climbs')) {
      return JSON.parse(localStorage.getItem('climbs') || '[]');
    }
    return [];
  }

  async runAsync(sql: string, params: any[] = []): Promise<void> {
    if (sql.includes('INSERT INTO climbs')) {
       const climbs = JSON.parse(localStorage.getItem('climbs') || '[]');
       const newClimb = {
         id: params[0],
         routeName: params[1],
         grade: params[2],
         gradeSystem: params[3],
         gradeWarning: params[4],
         date: params[5],
         location: params[6],
         result: params[7],
         notes: params[8],
         createdAt: params[9]
       };
       climbs.push(newClimb);
       localStorage.setItem('climbs', JSON.stringify(climbs));
    }
  }
}

let _db: DB | null = null;

export function getDb(): DB {
  if (!_db) _db = new LocalDB();
  return _db;
}

export async function initDb(): Promise<void> {
  _db = new LocalDB();
}
