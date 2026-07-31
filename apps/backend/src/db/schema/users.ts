import * as p from "drizzle-orm/pg-core";
import { timestamps } from "../columns.helpers";

export const users = p.pgTable("users", {
	id: p.integer().primaryKey().generatedAlwaysAsIdentity(),
	name: p.varchar().notNull(),
	email: p.varchar().notNull().unique(),
	password: p.varchar().notNull(),
	...timestamps,
});
