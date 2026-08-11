import type { FamilyInvite } from "@ourbudget/shared";
import { randomBytes } from "crypto";
import { addDays } from "date-fns";
import { and, eq, gt, sql } from "drizzle-orm";
import { db } from "../db";
import { familyInvites } from "../db/schema/familyInvites";
import { familyMembers } from "../db/schema/familyMembers";
import { familyMembersRepository } from "./familyMembersRepository";

export const familyInvitesRepository = {
	async create(
		invitedEmail: string,
		familyId: number,
		invitedByUserId: number,
		status: string,
	) {
		const token = randomBytes(32).toString("hex");
		const [prevInvite] = await db
			.select()
			.from(familyInvites)
			.where(
				and(
					eq(familyInvites.invitedEmail, invitedEmail),
					eq(familyInvites.invitedByUserId, invitedByUserId),
					eq(familyInvites.status, "pending"),
					gt(familyInvites.expiresAt, sql`now()`),
				),
			);
		if (prevInvite) {
			return prevInvite;
		}
		const [invite] = await db
			.insert(familyInvites)
			.values({
				familyId,
				invitedEmail,
				invitedByUserId,
				status,
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
			const familyMember = await familyMembersRepository.findByUser(userId);
			if (familyMember?.familyId === invite.familyId) {
				throw new Error("User is already member of this group");
			}

			return await db.transaction(async (tx) => {
				await tx.delete(familyMembers).where(eq(familyMembers.userId, userId)); // part of one family only

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
