import { endOfMonth, format, startOfMonth } from "date-fns";
import { transactionsRepository } from "../repositories/transactionsRepository";

export const budgetsOverviewService = {
	async getOverview(familyId: number, filter?: { from?: string; to?: string }) {
		const from = filter?.from ?? format(startOfMonth(new Date()), "yyyy-MM-dd");
		const to = filter?.to ?? format(endOfMonth(new Date()), "yyyy-MM-dd");

		const summary = transactionsRepository.getSummary(familyId, { from, to });

		return summary;
	},
};
