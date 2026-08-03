import * as p from "drizzle-orm/pg-core";

export const familyMembers = p.pgTable('family_members', {
  id: p.serial('id').primaryKey(),
  familyId: p.integer('family_id').notNull(),
  userId: p.integer('user_id').notNull(),
  joinedAt: p.timestamp('joined_at').defaultNow().notNull(),
});