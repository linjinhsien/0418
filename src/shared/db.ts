import { MigrationError } from './errorTypes';
import { db as firestore } from './firebase';
import { 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  query, 
  orderBy, 
  getDoc,
  updateDoc
} from 'firebase/firestore';

export interface DB {
  execAsync(sql: string): Promise<void>;
  getAllAsync<T>(sql: string, params?: any[]): Promise<T[]>;
  getFirstAsync<T>(sql: string, params?: any[]): Promise<T | null>;
  runAsync(sql: string, params?: any[]): Promise<void>;
}

class FirestoreDB implements DB {
  async execAsync(sql: string): Promise<void> {}

  async getAllAsync<T>(sql: string, params: any[] = []): Promise<T[]> {
    if (sql.includes('FROM climbs')) {
      const q = query(collection(firestore, 'climbs'), orderBy('date', 'desc'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
    }
    return [];
  }

  async getFirstAsync<T>(sql: string, params: any[] = []): Promise<T | null> {
    if (sql.includes('FROM user_profile')) {
      const docRef = doc(firestore, 'user_profile', 'singleton');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      }
    }
    return null;
  }

  async runAsync(sql: string, params: any[] = []): Promise<void> {
    if (sql.includes('INSERT INTO climbs')) {
      const climbId = params[0];
      const data = {
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
      await setDoc(doc(firestore, 'climbs', climbId), data);
    } else if (sql.includes('INSERT INTO user_profile')) {
      const data = {
        name: params[0],
        homeGym: params[1],
        climbingSince: params[2],
        goals: params[3]
      };
      await setDoc(doc(firestore, 'user_profile', 'singleton'), data, { merge: true });
    }
  }
}

// Simple browser-based mock using localStorage for persistence
class LocalDB implements DB {
  async execAsync(sql: string): Promise<void> {}

  async getFirstAsync<T>(sql: string, params: any[] = []): Promise<T | null> {
    if (sql.includes('FROM user_profile')) {
       const profiles = JSON.parse(localStorage.getItem('user_profile') || '{}');
       return profiles['singleton'] || null;
    }
    return null;
  }

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
    } else if (sql.includes('INSERT INTO user_profile')) {
       const profiles = JSON.parse(localStorage.getItem('user_profile') || '{}');
       profiles['singleton'] = {
         id: 'singleton',
         name: params[0],
         homeGym: params[1],
         climbingSince: params[2],
         goals: params[3]
       };
       localStorage.setItem('user_profile', JSON.stringify(profiles));
    }
  }
}

let _db: DB | null = null;

export function getDb(): DB {
  if (!_db) _db = new FirestoreDB(); // 預設切換為 FirestoreDB
  return _db;
}

export async function initDb(): Promise<void> {
  _db = new FirestoreDB();
}
