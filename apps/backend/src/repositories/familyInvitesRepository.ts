import type { FamilyInvite } from "@ourbudget/shared";
import { addDays } from "date-fns";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { familyInvites } from "../db/schema/familyInvites";

export const familyInvitesRepository = {
	async create(familyInvite: FamilyInviteType) {
		const [invite] = await db
			.insert(familyInvites)
			.values({
				familyId: familyInvite.familyId,
				invitedEmail: familyInvite.invitedEmail,
				invitedByUserId: familyInvite.invitedByUserId,
				token: familyInvite.token,
				status: familyInvite.status,
				expiresAt: addDays(new Date(), 3),
			})
			.returning();

		return invite;
	},
	async findByToken(token: string) {
		const [invite] = await db
			.select()
			.from(familyInvites)
			.where(eq(familyInvites.token, token));

		return invite;
	},
	async accept(invite: FamilyInvite) {
		db.transaction(async (tx) => {
			//await tx.update()...
		});
	},
};
