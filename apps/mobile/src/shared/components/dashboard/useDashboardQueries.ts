import { useQuery } from "@tanstack/react-query";

import {
	fetchBalanceSummary,
	fetchMonthlyChartData,
	fetchRecentTransactions,
	fetchUpcomingSchedule,
} from "./dashboardApi";

// One queryKey namespace per dashboard section — keeps caching and
// invalidation granular (e.g. refetching just the chart after a new
// transaction is added, without refetching everything else).

export function useBalanceSummary() {
	return useQuery({
		queryKey: ["dashboard", "balance"],
		queryFn: fetchBalanceSummary,
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
