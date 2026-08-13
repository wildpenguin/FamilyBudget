// src/test/setup.ts

import { sql } from "drizzle-orm";
import { beforeEach } from "vitest";
import { db } from "../db";

beforeEach(async () => {
	await db.execute(sql`TRUNCATE TABLE users RESTART IDENTITY CASCADE`);
	await db.execute(sql`TRUNCATE TABLE family_members RESTART IDENTITY CASCADE`);
	await db.execute(sql`TRUNCATE TABLE families RESTART IDENTITY CASCADE`);
	await db.execute(sql`TRUNCATE TABLE categories RESTART IDENTITY CASCADE`);
	await db.execute(sql`TRUNCATE TABLE family_invites RESTART IDENTITY CASCADE`);
	await db.execute(sql`TRUNCATE TABLE schedules RESTART IDENTITY CASCADE`);
	await db.execute(sql`TRUNCATE TABLE transactions RESTART IDENTITY CASCADE`);
});
