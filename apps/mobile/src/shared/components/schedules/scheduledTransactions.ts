import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../utils/apiConfig";
import type {
	Category,
	NewScheduledTransaction,
	ScheduledTransaction,
} from "./types";

async function fetchSchedules(): Promise<ScheduledTransaction[]> {
	const result = await apiFetch("/schedules", { method: "GET" });

	return result?.data;
}

async function fetchCategories(): Promise<Category[]> {
	const result = await apiFetch("/categories", { method: "GET" });

	return result?.data;
}

async function createSchedule(
	payload: NewScheduledTransaction,
): Promise<ScheduledTransaction> {
	const result = await apiFetch("/schedules", {
		method: "POST",
		body: JSON.stringify(payload),
	});
	return result;
}

async function deleteSchedule(id: string): Promise<{ id: string }> {
	const response = await apiFetch(`schedules/${id}`, { method: "DELETE" });

	return response;
}

// ---------------------------------------------------------------------------
// Query keys
// ---------------------------------------------------------------------------

export const scheduledTransactionsKeys = {
	all: ["scheduledTransactions"] as const,
	categories: ["categories"] as const,
};

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

export function useScheduledTransactions() {
	return useQuery({
		queryKey: scheduledTransactionsKeys.all,
		queryFn: fetchSchedules,
	});
}

export function useCategories() {
	return useQuery({
		queryKey: scheduledTransactionsKeys.categories,
		queryFn: fetchCategories,
	});
}

export function useCreateScheduledTransaction() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: createSchedule,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: scheduledTransactionsKeys.all,
			});
		},
	});
}

export function useDeleteScheduledTransaction() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteSchedule,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: scheduledTransactionsKeys.all,
			});
		},
	});
}
