import type { FamilyInviteInput } from "@ourbudget/shared";
import { randomBytes } from "crypto";
import { isPast } from "date-fns";
import { familyInvitesRepository } from "../repositories/familyInvitesRepository";
import { userRepository } from "../repositories/userRepository";

export const familyInviteService = {
	async createInvite(familyInvite: FamilyInviteInput) {
		const token = randomBytes(32).toString("hex");

		const invitedUser = userRepository.findByEmail(familyInvite.invitedEmail);
		if (!invitedUser) {
			throw new Error("Invited User must have an account");
		}

		// Todo: Send email to the invite
		// but will do it later. Not sure what email
		// services I can find to relay some emails

		const result = await familyInvitesRepository.create({
			familyId: familyInvite.familyId,
			invitedByUserId: familyInvite.invitedByUserId,
			invitedEmail: familyInvite.invitedEmail,
			token: token,
			status: "pending",
		});

		return result;
	},
	async acceptInvite(token: string, acceptingUserId: number) {
		const invite = await familyInvitesRepository.findByToken(token);
		if (invite?.status !== "pending" || isPast(invite.expiresAt)) {
			throw new Error("Invalid or expired token");
		}
		await familyInvitesRepository.accept(invite);
	},
};
