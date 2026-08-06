import { getCategorySchema, createCategorySchema } from "@ourbudget/shared";
import type { Request, Response } from "express";
import * as z from "zod";
import { categoryRepository } from "../repositories/categoryRepository";

const listCategoriesSchema = getCategorySchema
	.pick({ type: true, sort: true })
	.partial({ type: true, sort: true });

const getFamilyParamSchema = z.object({
	familyId: z.coerce.number().int().positive(),
})
const getCategoryIdSchema = z.object({
	categoryId: z.coerce.number(),
});
const getCategoryNameSchema = z.object({
	name: z.string().max(50)
});


export const CategoriesController = {
	async list(req: Request, res: Response) {
		const parsedParams = getFamilyParamSchema.safeParse(req.params);
		if (!parsedParams.success) {
			return res.status(404).json({error: 'FamilyId not found'});
		}
		const parsedQuery = listCategoriesSchema.safeParse(req.query);
		if (!parsedQuery.success) {
			return res.status(400).json(z.treeifyError(parsedQuery.error));
		}
		const categories = await categoryRepository.list({
			familyId: parsedParams.data.familyId, 
			type: parsedQuery.data.type,
			sort: parsedQuery.data.sort,
		});

		return res.json({
			data: categories,
			meta: {
				total: categories.length
			}
		});
	},
	async update(req: Request, res: Response) {
		const parsedParams = getCategoryIdSchema.safeParse(req.params);
		if (!parsedParams.success) {
			return res.status(404).json({error: "CategoryId not found"});
		}
		const { categoryId } = parsedParams.data;

		const parsedBody = getCategoryNameSchema.safeParse(req.body);
		if (!parsedBody.success) {
			return res.status(400).json(z.treeifyError(parsedBody.error));
		}
		const { name } = parsedBody.data;
		await categoryRepository.updateName(categoryId, name);

		return res.json({
			data: 'success'
		});
	},
	async create(req: Request, res: Response) {
		const parsedBody = createCategorySchema.safeParse(req.body);
		if (!parsedBody.success) {
			return res.status(400).json(z.treeifyError(parsedBody.error));
		}
		const result = await categoryRepository.create(parsedBody.data);

		return res.json({ data: result });
	}

}
