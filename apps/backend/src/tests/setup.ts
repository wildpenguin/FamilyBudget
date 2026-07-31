// src/test/setup.ts
import { beforeEach } from 'vitest';
import { sql } from 'drizzle-orm';
import { db } from '../db';

beforeEach(async () => {
  await db.execute(sql`TRUNCATE TABLE users RESTART IDENTITY CASCADE`);
});