import * as z from "zod";

export const getCategorySchema = z.object({
	familyId: z.number(),
	name: z.string().max(50),
	type: z.enum(["income", "expense"]),
	sort: z.enum(["asc", "desc"]),
});

export const createCategorySchema = z.object({
	familyId: z.number(),
	name: z.string().max(50),
	type: z.enum(["income", "expense"])
});


export type GetCategory = z.infer <typeof getCategorySchema>
export type CreateCategory = z.infer <typeof createCategorySchema>