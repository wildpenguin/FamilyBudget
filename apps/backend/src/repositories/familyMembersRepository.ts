import { eq } from "drizzle-orm";
import { db } from "../db";
import { familyMembers } from "../db/schema/familyMembers";

export const familyMembersRepository = {
	async findByUser(userId?: number) {
		if (!userId) {
			return null;
		}
		const [member] = await db
			.select()
			.from(familyMembers)
			.where(eq(familyMembers.userId, userId));

		return member;
	},
};
