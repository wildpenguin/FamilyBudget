import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import { transactionsRepository } from "../repositories/transactionsRepository";

export const budgetsOverviewService = {
	async getOverview(familyId: number, filter?: { from?: string; to?: string }) {
		const from = filter?.from ?? format(startOfMonth(new Date()), "yyyy-MM-dd");
		const to = filter?.to ?? format(endOfMonth(new Date()), "yyyy-MM-dd");

		const summary = await transactionsRepository.getSummary(familyId, {
			from,
			to,
		});

		return summary;
	},
	async getMonthlyChart(familyId: number, months: number) {
		const dateAgo = format(subMonths(new Date(), months), "yyyy-MM-dd");
		const dateNow = format(new Date(), "yyyy-MM-dd");

		return await transactionsRepository.getMonthlyChartData(
			familyId,
			dateAgo,
			dateNow,
		);
	},
};
