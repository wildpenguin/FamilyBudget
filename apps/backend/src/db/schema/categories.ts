import * as p from "drizzle-orm/pg-core";

export const typeEnum = p.pgEnum("type", ["income", "expense"]);

export const categories = p.pgTable("categories", {
	id: p.serial("id").primaryKey(),
	familyId: p.integer("family_id").notNull(),
	name: p.varchar("name", { length: 50 }).notNull(), // "Groceries", "Rent", "Salary"
	type: typeEnum().notNull(),
});
