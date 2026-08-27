import type { CreateCategory } from "@ourbudget/shared";
import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { db } from "../db";
import { categories } from "../db/schema/categories";
import { familyMembers } from "../db/schema/familyMembers";

type ListFilters = {
	userId?: number;
	type?: "income" | "expense";
	sort?: "asc" | "desc";
};

export const categoryRepository = {
	async list(filters: ListFilters, userId?: number) {
		if (!userId) {
			return null;
		}
		const conditions = [
			inArray(
				categories.familyId,
				db
					.select({ familyId: familyMembers.familyId })
					.from(familyMembers)
					.where(eq(familyMembers.userId, userId)),
			),
		];

		if (filters.type) {
			conditions.push(eq(categories.type, filters.type));
		}
		const sortFn = filters.sort === "asc" ? asc : desc;
		const query = db
			.select()
			.from(categories)
			.where(and(...conditions))
			.orderBy(sortFn(categories.name));
		const result = await query;

		return result ?? null;
	},
	async updateName(categoryId: number, name: string, userId?: number) {
		if (!userId) {
			return null;
		}
		const result = await db
			.update(categories)
			.set({ name: name })
			.where(
				and(
					eq(categories.id, categoryId),
					inArray(
						categories.familyId,
						db
							.select({ familyId: familyMembers.familyId })
							.from(familyMembers)
							.where(eq(familyMembers.userId, userId)),
					),
				),
			)
			.returning();
		return result[0] ?? null;
	},
	async create(category: CreateCategory, userId: number, familyId: number) {
		const result = await db
			.insert(categories)
			.values({
				familyId,
				name: category.name,
				type: category.type,
			})
			.returning();
		return result[0];
	},
	async delete(categoryId: number, userId?: number) {
		if (!userId) {
			return null;
		}
		const result = await db
			.delete(categories)
			.where(
				and(
					eq(categories.id, categoryId),
					inArray(
						categories.familyId,
						db
							.select({ familyId: familyMembers.familyId })
							.from(familyMembers)
							.where(eq(familyMembers.userId, userId)),
					),
				),
			)
			.returning();

		return result[0] ?? null;
	},
};
