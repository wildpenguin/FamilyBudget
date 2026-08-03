import { sql } from "drizzle-orm";
import * as p from "drizzle-orm/pg-core";
import { typeEnum } from "./categories";

export const transactionStatusEnum = p.pgEnum("transaction_status", [
	"actual",
	"projected",
	"skipped",
]);

export const transactions = p.pgTable("transactions", {
	id: p.serial("id").primaryKey(),
	familyId: p.integer("family_id").notNull(),
	categoryId: p.integer("category_id").notNull(),
	scheduleId: p.integer("schedule_id"),
	createdByUserId: p.integer("created_by_user_id").notNull(),
	amount: p.numeric({ precision: 12, scale: 2 }).notNull(),
	type: typeEnum(),
	date: p.date("date").default(sql`CURRENT_DATE`).notNull(),
	description: p.varchar("description", { length: 255 }),
	status: transactionStatusEnum("status").default("actual").notNull(),
});
