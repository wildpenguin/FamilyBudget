import * as z from "zod";

export const familyInvitesSchema = z.object({
	familyId: z.number(),
	invitedEmail: z.email(),
	invitedByUserId: z.number(),
	status: z.string().optional(),
});

export type FamilyInviteInput = z.infer<typeof familyInvitesSchema>;

export type FamilyInvite = FamilyInviteInput & {
	id: number;
	token: string;
	createdAt: Date;
	expiresAt: Date;
};
