import { useQuery } from "@tanstack/react-query";
import { transactionsKeys } from "../transactions/transactions";
import type { TransactionFilters } from "../transactions/types";
import {
	fetchBalanceSummary,
	fetchMonthlyChartData,
	fetchRecentTransactions,
	fetchUpcomingSchedule,
} from "./dashboardApi";

// One queryKey namespace per dashboard section — keeps caching and
// invalidation granular (e.g. refetching just the chart after a new
// transaction is added, without refetching everything else).

// With filters, the summary is cached under the transactions namespace so
// deleting a transaction (which invalidates transactionsKeys.root) refreshes it.
export function useBalanceSummary(filters?: TransactionFilters) {
	return useQuery({
		queryKey: filters
			? transactionsKeys.summary(filters)
			: ["dashboard", "balance"],
		queryFn: () => fetchBalanceSummary(filters),
	});
}

export function useMonthlyChartData() {
	return useQuery({
		queryKey: ["dashboard", "monthlyChart"],
		queryFn: fetchMonthlyChartData,
	});
}

export function useUpcomingSchedule() {
	return useQuery({
		queryKey: ["dashboard", "upcomingSchedule"],
		queryFn: fetchUpcomingSchedule,
	});
}

export function useRecentTransactions() {
	return useQuery({
		queryKey: ["dashboard", "recentTransactions"],
		queryFn: fetchRecentTransactions,
	});
}
