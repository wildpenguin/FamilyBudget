import * as z from "zod";

export const getCategorySchema = z.object({
	familyId: z.number(),
	name: z.string().max(50),
	type: z.enum(["income", "expense"]),
	sort: z.enum(["asc", "desc"]).optional(),
	id: z.number().optional(),
});

export const createCategorySchema = z.object({
	name: z.string().max(50),
	type: z.enum(["income", "expense"]),
});

export type CategoryType = "income" | "expense";

export type GetCategory = {
	id: number;
	name: string;
	type: CategoryType;
};
export type CreateCategory = z.infer<typeof createCategorySchema>;

export const CATEGORIES_KEY = ["categories"];
