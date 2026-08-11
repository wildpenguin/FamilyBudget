import type { FamilyInviteInput } from "@ourbudget/shared";
import { isPast } from "date-fns";
import { familyInvitesRepository } from "../repositories/familyInvitesRepository";
import { userRepository } from "../repositories/userRepository";

export const familyInviteService = {
	async createInvite(familyInvite: FamilyInviteInput) {
		const invitedUser = await userRepository.findByEmail(familyInvite.invitedEmail);
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
			status: "pending",
		});

		return result;
	},
	async acceptInvite(token: string, acceptingUserId: number) {
		const invite = await familyInvitesRepository.findByToken(token);
		if (invite?.status !== "pending" || isPast(invite.expiresAt)) {
			throw new Error("Invalid or expired token");
		}
		const user = await userRepository.findByEmail(invite.invitedEmail);
		if (!user) {
			throw new Error("Invited email must have an account!");
		}
		if (acceptingUserId !== user.id) {
			throw new Error("Requested invite does not match original user");
		}
		await familyInvitesRepository.accept(invite, acceptingUserId);
	},
};
