import * as p from "drizzle-orm/pg-core";

export const familyInvites = p.pgTable("family_invites", {
	id: p.serial("id").primaryKey(),
	familyId: p.integer("family_id").notNull(),
	invitedEmail: p.varchar("invited_email", { length: 100 }).notNull(),
	invitedByUserId: p.integer("invited_by_user_id").notNull(),
	token: p.varchar("token", { length: 64 }).notNull().unique(),
	status: p.varchar("status", { length: 20 }).default("pending").notNull(), // pending | accepted | expired
	createdAt: p.timestamp("created_at").defaultNow().notNull(),
	expiresAt: p.timestamp("expires_at").notNull(),
});
