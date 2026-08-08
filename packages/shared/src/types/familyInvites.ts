import * as z from "zod";

export const familyInvitesSchema = z.object({
    familyId: z.number(),
    invitedEmail: z.email(),
    invitedByUserId: z.number(),
});

export type CreateFamilyInviteType = z.infer<typeof familyInvitesSchema>;

