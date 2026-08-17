import bcrypt from "bcrypt";
import { BCRYPT_SALT_ROUNDS } from "../config/constants";
import { db } from "../db";
import { categories } from "../db/schema/categories";
import { families } from "../db/schema/families";
import { familyMembers } from "../db/schema/familyMembers";
import { schedules } from "../db/schema/schedules";
import { transactions } from "../db/schema/transactions";
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

export async function createCategory(
	name: string,
	familyId: number,
	type: "income" | "expense",
) {
	return await db
		.insert(categories)
		.values({
			name,
			familyId,
			type,
		})
		.returning();
}

export async function createTransaction(
	familyId: number,
	categoryId: number,
	description: string,
	amountCents: number,
	type: "income" | "expense",
	createdByUserId: number,
) {
	const [transaction] = await db
		.insert(transactions)
		.values({
			familyId,
			categoryId,
			description,
			amountCents,
			type,
			createdByUserId,
		})
		.returning();

	return transaction;
}

export async function createSchedule(
	familyId: number,
	categoryId: number,
	description: string,
	amountCents: number,
	frequency: "once" | "weekly" | "biweekly" | "monthly" | "yearly",
	startDate: string,
	active: boolean,
	createdByUserId: number,
	endDate?: string,
	dayOfMonth?: number,
	dayOfWeek?: number,
) {
	return await db
		.insert(schedules)
		.values({
			familyId,
			categoryId,
			description,
			amountCents,
			frequency,
			startDate,
			endDate,
			dayOfMonth,
			dayOfWeek,
			active,
			createdByUserId,
		})
		.returning();
}
