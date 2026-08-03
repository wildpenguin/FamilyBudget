import * as p from "drizzle-orm/pg-core";

export const families = p.pgTable("families", {
	id: p.serial("id").primaryKey(),
	name: p.varchar("name", { length: 100 }).notNull(),
	createdAt: p.timestamp("created_at").defaultNow().notNull(),
});
