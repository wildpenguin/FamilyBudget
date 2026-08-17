import type { Response } from "express";
import { z } from "zod";
import { familyMembersRepository } from "../repositories/familyMembersRepository";
import type { AuthenticatedRequest } from "../services/authService";
import { budgetsOverviewService } from "../services/budgetsOverviewService";

const overviewQuery = z.object({
	filter: z
		.object({
			from: z.iso.date().optional(),
			to: z.iso.date().optional(),
		})
		.optional(),
});
const overviewParams = z.object({
	familyId: z.coerce.number(),
});

export const BudgetsOverviewController = {
	async overview(req: AuthenticatedRequest, res: Response) {
		const parsedParams = overviewParams.safeParse(req.params);
		if (!parsedParams.success) {
			return res
				.status(400)
				.json({ error: z.treeifyError(parsedParams.error) });
		}
		const familyMember = await familyMembersRepository.findByUser(req.userId);
		if (familyMember?.familyId !== parsedParams.data.familyId) {
			return res
				.status(403)
				.json({ error: "The current user is missing from requested family" });
		}
		const parsedQuery = overviewQuery.safeParse(req.query);
		if (!parsedQuery.success) {
			return res.status(400).json({ error: z.treeifyError(parsedQuery.error) });
		}
		const overview = await budgetsOverviewService.getOverview(
			parsedParams.data.familyId,
			parsedQuery.data.filter,
		);
		return res.json({
			data: overview,
			meta: {
				total: overview.byCategory.length,
			},
		});
	},
};
