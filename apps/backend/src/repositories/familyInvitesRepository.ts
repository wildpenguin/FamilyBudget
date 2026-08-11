import type { FamilyInvite, FamilyInviteInput } from "@ourbudget/shared";
import { randomBytes } from "crypto";
import { addDays } from "date-fns";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { familyInvites } from "../db/schema/familyInvites";
import { familyMembers } from "../db/schema/familyMembers";

export const familyInvitesRepository = {
	async create(familyInvite: FamilyInviteInput) {
		const token = randomBytes(32).toString("hex");

		const [invite] = await db
			.insert(familyInvites)
			.values({
				familyId: familyInvite.familyId,
				invitedEmail: familyInvite.invitedEmail,
				invitedByUserId: familyInvite.invitedByUserId,
				status: familyInvite.status,
				token: token,
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
	async accept(invite: FamilyInvite, userId: number) {
		try {
			return await db.transaction(async (tx) => {
				await tx.insert(familyMembers).values({
					familyId: invite.familyId,
					userId,
				});
				await tx
					.update(familyInvites)
					.set({ status: "completed" })
					.where(eq(familyInvites.token, invite.token));
			});
		} catch (err) {
			throw new Error("Accept invite failed");
		}
	},
};
