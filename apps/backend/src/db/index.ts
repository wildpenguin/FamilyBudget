import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,                        // max simultaneous connections
  idleTimeoutMillis: 30000,       // close idle clients after 30s
  connectionTimeoutMillis: 5000,  // fail fast if DB is unreachable
});

export const db = drizzle({client: pool});

export async function closeDb() {
    await pool.end();
}