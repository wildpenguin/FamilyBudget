import bcrypt from "bcrypt";
import { BCRYPT_SALT_ROUNDS } from "../config/constants";
import { db } from "../db";
import { families } from "../db/schema/families";
import { familyMembers } from "../db/schema/familyMembers";
import { users } from "../db/schema/users";

export async function createTestUser(overrides = {}) {
	const hashedPassword = await bcrypt.hash("password123", BCRYPT_SALT_ROUNDS);
	const [user] = await db
		.insert(users)
		.values({
			name: "testuser",
			email: "test@test.com",
			password: hashedPassword,
			...overrides,
		})
		.returning();
	return user;
}

export async function createFamily(name: string) {
	const [family] = await db.insert(families).values({ name: name }).returning();
	return family;
}

export async function createFamilyMember(familyId: number, userId: number) {
	const [member] = await db
		.insert(familyMembers)
		.values({ familyId: familyId, userId: userId })
		.returning();

	return member;
}
