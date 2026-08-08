import { eq } from "drizzle-orm";
import { db } from "../db";
import { familyMembers } from "../db/schema/familyMembers";
import { type CreateFamilyInviteType } from "@ourbudget/shared";


export const familyMembersRepository = {
	async findByUser(userId?: number) {
		if (!userId) {
			return null;
		}
		const result = await db
			.select()
			.from(familyMembers)
			.where(eq(familyMembers.userId, userId));

		return result[0] ?? null;
	},
	async create(familyInvite:CreateFamilyInviteType, userId?:number) {
		
	}
};
