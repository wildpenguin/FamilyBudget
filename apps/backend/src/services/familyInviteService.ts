import { randomBytes } from "crypto";
import { familyInvitesRepository } from "../repositories/familyInvitesRepository";
import { CreateFamilyInviteType } from "@ourbudget/shared";

export const familyInviteService = {
    async createInvite(familyInvite: CreateFamilyInviteType) {

        const token = randomBytes(32).toString('hex');

        const result = await familyInvitesRepository.create({
            familyId: familyInvite.familyId,
            invitedByUserId: familyInvite.invitedByUserId,
            invitedEmail: familyInvite.invitedEmail,
            token: token,
            status: 'pending',
        });
    }
}