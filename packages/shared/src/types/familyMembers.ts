import { z } from "zod";

export const getFamilyMemberSchema = z.object({
	id: z.number(),
	familyId: z.number(),
	userId: z.number(),
	createdAt: z.date(),
});

export type GetFamilyMemberType = z.infer<typeof getFamilyMemberSchema>;
