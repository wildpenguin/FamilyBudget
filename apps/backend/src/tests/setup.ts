// src/test/setup.ts

import { sql } from "drizzle-orm";
import { beforeEach } from "vitest";
import { db } from "../db";

beforeEach(async () => {
	await db.execute(sql`TRUNCATE TABLE users RESTART IDENTITY CASCADE`);
});
