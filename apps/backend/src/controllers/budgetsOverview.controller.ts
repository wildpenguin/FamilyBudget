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

const chartQuery = z.object({
	months: z.coerce.number().int(),
});

export const BudgetsOverviewController = {
	async overview(req: AuthenticatedRequest, res: Response) {
		const familyMember = await familyMembersRepository.findByUser(req.userId);
		if (!familyMember?.familyId) {
			return res
				.status(403)
				.json({ error: "The current user is missing from requested family" });
		}
		const parsedQuery = overviewQuery.safeParse(req.query);
		if (!parsedQuery.success) {
			return res.status(400).json({ error: z.treeifyError(parsedQuery.error) });
		}
		const overview = await budgetsOverviewService.getOverview(
			familyMember.familyId,
			parsedQuery.data.filter,
		);
		return res.json({
			data: overview,
			meta: {
				total: overview.byCategory.length,
			},
		});
	},
	async monthlyChart(req: AuthenticatedRequest, res: Response) {
		const familyMember = await familyMembersRepository.findByUser(req.userId);
		if (!familyMember?.familyId) {
			return res
				.status(403)
				.json({ error: "The current user is missing from requested family" });
		}
		const chart = chartQuery.safeParse(req.query);
		if (!chart.success) {
			return res.status(400).json(z.treeifyError(chart.error));
		}
		const monthlyChart = await budgetsOverviewService.getMonthlyChart(
			familyMember.familyId,
			chart.data.months,
		);

		return res.json({
			data: monthlyChart,
			meta: {
				total: monthlyChart.length,
			},
		});
	},
};
