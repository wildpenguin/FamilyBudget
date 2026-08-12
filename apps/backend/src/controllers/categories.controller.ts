import { createCategorySchema, getCategorySchema } from "@ourbudget/shared";
import type { Response } from "express";
import * as z from "zod";
import { categoryRepository } from "../repositories/categoryRepository";
import type { AuthenticatedRequest } from "../services/authService";

const listCategoriesSchema = getCategorySchema
	.pick({ type: true, sort: true })
	.partial({ type: true, sort: true });

const getCategoryIdSchema = z.object({
	categoryId: z.coerce.number(),
});

const getCategoryNameSchema = z.object({
	name: z.string().max(50),
});

export const CategoriesController = {
	async list(req: AuthenticatedRequest, res: Response) {
		const parsedQuery = listCategoriesSchema.safeParse(req.query);
		if (!parsedQuery.success) {
			return res.status(400).json(z.treeifyError(parsedQuery.error));
		}
		const categories = await categoryRepository.list(
			{
				type: parsedQuery.data.type,
				sort: parsedQuery.data.sort,
			},
			req.userId,
		);
		return res.json({
			data: categories,
			meta: {
				total: categories ? categories.length : 0,
			},
		});
	},
	async update(req: AuthenticatedRequest, res: Response) {
		const parsedParams = getCategoryIdSchema.safeParse(req.params);
		if (!parsedParams.success) {
			return res.status(404).json({ error: "CategoryId not found" });
		}
		const { categoryId } = parsedParams.data;
		const parsedBody = getCategoryNameSchema.safeParse(req.body);
		if (!parsedBody.success) {
			return res.status(400).json(z.treeifyError(parsedBody.error));
		}
		const { name } = parsedBody.data;
		const result = await categoryRepository.updateName(
			categoryId,
			name,
			req.userId,
		);

		return res.json({
			data: result,
		});
	},
	async create(req: AuthenticatedRequest, res: Response) {
		const parsedBody = createCategorySchema.safeParse(req.body);
		if (!parsedBody.success) {
			return res.status(400).json(z.treeifyError(parsedBody.error));
		}
		const result = await categoryRepository.create(parsedBody.data, req.userId);

		return res.json({ data: result });
	},
	async delete(req: AuthenticatedRequest, res: Response) {
		const params = getCategoryIdSchema.safeParse(req.params);
		if (!params.success) {
			return res.status(400).json({ error: "Missing categoryId" });
		}
		const category = await categoryRepository.delete(
			params.data.categoryId,
			req.userId,
		);

		return res.json({ data: category });
	},
};
