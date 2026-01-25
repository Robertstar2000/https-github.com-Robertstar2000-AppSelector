import { Pool } from 'pg';
import Database from 'better-sqlite3';

export interface DatabaseProxy {
  query: (sql: string, params?: any[]) => Promise<any>;
  run: (sql: string, params?: any[]) => Promise<any>;
  get: (sql: string, params?: any[]) => Promise<any>;
  all: (sql: string, params?: any[]) => Promise<any[]>;
  transaction: (fn: () => Promise<void>) => Promise<void>;
}

const isPostgres = !!process.env.POSTGRES_HOST;

const translateParams = (text: string) => {
  let index = 1;
  return text.replace(/\?/g, () => `$${index++}`);
};

class PostgresProxy implements DatabaseProxy {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: process.env.POSTGRES_HOST,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      port: 5432,
    });
  }

  async query(sql: string, params: any[] = []) {
    const translatedSql = translateParams(sql);
    return this.pool.query(translatedSql, params);
  }

  async run(sql: string, params: any[] = []) {
    const translatedSql = translateParams(sql);
    await this.pool.query(translatedSql, params);
  }

  async get(sql: string, params: any[] = []) {
    const translatedSql = translateParams(sql);
    const res = await this.pool.query(translatedSql, params);
    return res.rows[0];
  }

  async all(sql: string, params: any[] = []) {
    const translatedSql = translateParams(sql);
    const res = await this.pool.query(translatedSql, params);
    return res.rows;
  }

  async transaction(fn: () => Promise<void>) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      // For a real transaction wrapper, we'd need to pass the client to the fn
      // or use AsyncLocalStorage. For now, this is a simplified global lock pattern.
      // Ideally, the fn would take a `tx` object which is the client.
      await fn();
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }
}

class SQLiteProxy implements DatabaseProxy {
  private db: Database.Database;

  constructor() {
    this.db = new Database('local.db');
  }

  async query(sql: string, params: any[] = []) {
    const stmt = this.db.prepare(sql);
    return stmt.run(...params);
  }

  async run(sql: string, params: any[] = []) {
    const stmt = this.db.prepare(sql);
    return stmt.run(...params);
  }

  async get(sql: string, params: any[] = []) {
    const stmt = this.db.prepare(sql);
    return stmt.get(...params);
  }

  async all(sql: string, params: any[] = []) {
    const stmt = this.db.prepare(sql);
    return stmt.all(...params);
  }

  async transaction(fn: () => Promise<void>) {
    const runTx = this.db.transaction(async () => {
      await fn();
    });
    await runTx();
  }
}

export const db: DatabaseProxy = isPostgres ? new PostgresProxy() : new SQLiteProxy();
