import { Pool, PoolConfig } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const poolConfig: PoolConfig = {
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB || 'riverb',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

export const pool = new Pool(poolConfig);

pool.on('connect', () => {
  console.log('[Riverb] PostgreSQL connected');
});

// Log error but never exit - DB is optional for AI pipeline
pool.on('error', (err) => {
  console.error('[Riverb] PostgreSQL pool error (non-fatal):', err.message);
});

export async function query(text: string, params?: any[]) {
  const res = await pool.query(text, params);
  return res;
}
