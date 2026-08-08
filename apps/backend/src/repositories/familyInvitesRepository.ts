import { db } from "../db";
import { familyInvites } from "../db/schema/familyInvites";
import { addDays } from 'date-fns';

type FamilyInviteType = {
    familyId: number,
    invitedEmail: string,
    invitedByUserId: number,
    token: string,
    status: 'completed' | 'pending' | 'expired',
}

export const familyInvitesRepository = {
    
    async create (familyInvite: FamilyInviteType) {
        const [invite] = await db.insert(familyInvites).values({
            familyId: familyInvite.familyId,
            invitedEmail: familyInvite.invitedEmail,
            invitedByUserId: familyInvite.invitedByUserId,
            token: familyInvite.token,
            status: familyInvite.status,
            expiresAt: addDays(new Date(), 3),
        }).returning();

        return invite;
    }

}