import { GetTransactionType } from "@ourbudget/shared";
import { apiFetch } from "../../utils/apiConfig";
import type {
	BalanceSummary,
	CategoryBreakdown,
	MonthlyChartPoint,
	UpcomingSchedule,
} from "./dashboard";

export async function fetchBalanceSummary(): Promise<BalanceSummary> {
	const overview = await apiFetch("/budgets/overview", { method: "GET" });
	const max = Math.max(
		...overview.data.byCategory.map((category: CategoryBreakdown) =>
			Number(category.totalAmountCents),
		),
	);

	const result = {
		...overview.data,
		byCategory: overview.data.byCategory.map((category: CategoryBreakdown) => ({
			...category,
			percentOfMax: Number(category.totalAmountCents) / max,
		})),
	};

	return result;
}

export async function fetchMonthlyChartData(): Promise<MonthlyChartPoint[]> {
	const monthlyData = await apiFetch(`/budgets/monthly?months=6`, {
		method: "GET",
	});

	return monthlyData.data;
}

export async function fetchUpcomingSchedule(): Promise<UpcomingSchedule | null> {
	const response = await apiFetch("/schedules/upcoming");

	return response.data;
}

export async function fetchRecentTransactions(): Promise<GetTransactionType[]> {
	const recent = await apiFetch('/transactions?limit=3');

	return recent.data;
	
}
