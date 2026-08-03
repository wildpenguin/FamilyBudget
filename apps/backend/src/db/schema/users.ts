import * as p from "drizzle-orm/pg-core";

export const users = p.pgTable("users", {
	id: p.integer().primaryKey().generatedAlwaysAsIdentity(),
	name: p.varchar().notNull(),
	email: p.varchar().notNull().unique(),
	password: p.varchar().notNull(),
	created_at: p.timestamp().defaultNow().notNull(),
	updated_at: p.timestamp(),
});
