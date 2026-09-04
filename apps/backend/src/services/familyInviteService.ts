import { isPast } from "date-fns";
import { familyInvitesRepository } from "../repositories/familyInvitesRepository";
import { familyMembersRepository } from "../repositories/familyMembersRepository";
import { userRepository } from "../repositories/userRepository";

// TODO: Send email to the invite
// Not sure what email
// services I can find to relay some emails
export const familyInviteService = {
	async createInvite(invitedEmail: string, userId: number) {
		const invitedUser = await userRepository.findByEmail(invitedEmail);
		if (!invitedUser) {
			throw new Error("Invited User must have an account");
		}
		const familyMember = await familyMembersRepository.findByUser(userId);
		if (!familyMember) {
			throw new Error("Cant find the family for this account");
		}
		const result = await familyInvitesRepository.create(
			invitedEmail,
			familyMember.familyId,
			userId,
			"pending",
		);

		return result;
	},
	async acceptInvite(token: string) {
		const invite = await familyInvitesRepository.findByToken(token);
		if (invite?.status !== "pending" || isPast(invite.expiresAt)) {
			throw new Error("Invalid or expired token");
		}
		const user = await userRepository.findByEmail(invite.invitedEmail);
		if (!user) {
			throw new Error("Invited email must have an account!");
		}

		await familyInvitesRepository.accept(invite, user.id);
	},
};
