import { eq } from "drizzle-orm";
import { db } from "../db";
import { familyMembers } from "../db/schema/familyMembers";

export const familyMembersRepository = {
    async findByUser(userId: number) {
        const result = await db.select()
            .from(familyMembers)
            .where(eq(familyMembers.userId, userId));

        return result[0] ?? null;
    }
}