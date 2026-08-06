import { eq, and, asc, desc } from "drizzle-orm";
import { db } from "../db";
import { categories } from "../db/schema/categories";
import { type GetCategory, type CreateCategory } from "@ourbudget/shared";

type ListFilters = {
    familyId: number;
    type?: 'income' | 'expense';
    sort?: 'asc' | 'desc';
}

export const categoryRepository = {
	async list(filters: ListFilters) {
        const conditions = [eq(categories.familyId, filters.familyId)];
        if (filters.type) {
            conditions.push(eq(categories.type, filters.type));
        }
        const sortFn = filters.sort === 'asc' ? asc : desc;
		const result = await db.select().from(categories).where(and(...conditions)).orderBy(sortFn(categories.name));

		return result ?? null;
	},
    async updateName(id: number, name: string) {
        return await db.update(categories).set({name: name}).where(eq(categories.id, id));
    },
	async create(category: CreateCategory) {
		const result = await db
			.insert(categories)
			.values({
                familyId: category.familyId, 
                name: category.name,
                type: category.type
            })
			.returning();
		return result[0];
	},
};
