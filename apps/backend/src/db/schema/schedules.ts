import * as p from "drizzle-orm/pg-core";

export const frequencyEnum = p.pgEnum("frequency", [
	"once",
	"weekly",
	"biweekly",
	"monthly",
	"yearly",
]);

export const schedules = p.pgTable("schedules", {
	id: p.serial("id").primaryKey(),
	familyId: p.integer("family_id").notNull(),
	categoryId: p.integer("category_id").notNull(),
	description: p.varchar("description", { length: 255 }).notNull(),
	amountCents: p.integer("amount_cents").notNull(), // positive = income, negative = expense
	frequency: frequencyEnum("frequency").notNull(),
	startDate: p.date("start_date").notNull(),
	endDate: p.date("end_date"), // nullable — open-ended
	dayOfMonth: p.integer("day_of_month"), // for 'monthly'/'yearly'
	dayOfWeek: p.integer("day_of_week"), // for 'weekly'/'biweekly'
	active: p.boolean("active").default(true).notNull(),
	createdByUserId: p.integer("created_by_user_id").notNull(),
	createdAt: p.timestamp("created_at").defaultNow().notNull(),
});
