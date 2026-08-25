import * as p from "drizzle-orm/pg-core";

export const families = p.pgTable("families", {
	id: p.integer().primaryKey().generatedAlwaysAsIdentity(),
	name: p.varchar("name", { length: 100 }).notNull(),
	createdAt: p.timestamp("created_at").defaultNow().notNull(),
});
