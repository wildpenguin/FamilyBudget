export type FamilyInvite = {
	id: number;
	familyId: number;
	invitedEmail: string;
	invitedByUserId: number;
	status?: string;
	token: string;
	createdAt: Date;
	expiresAt: Date;
};
