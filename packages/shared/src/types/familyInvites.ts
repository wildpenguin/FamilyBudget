import * as z from "zod";

export const familyInvitesSchema = z.object({
	familyId: z.number(),
	invitedEmail: z.email(),
	invitedByUserId: z.number(),
});

export type FamilyInviteInput = z.infer<typeof familyInvitesSchema>;

export type FamilyInvite = FamilyInviteInput & {
	id: number;
	createdAt: string;
	expiredAt: string;
	token: string;
	status: "completed" | "pending" | "expired";
};
