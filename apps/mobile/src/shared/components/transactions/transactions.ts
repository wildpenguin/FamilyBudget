import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { apiFetch } from "../../utils/apiConfig";
import type { Transaction, TransactionFilters } from "./types";

async function fetchTransactions(
	filters: TransactionFilters,
): Promise<Transaction[]> {
	const params = new URLSearchParams(
		Object.entries(filters)
			.filter(([k, v]) => v !== undefined && v !== "")
			.map(([k, v]) => [
				`filter[${k}]`,
				v instanceof Date ? format(v, "yyyy-MM-dd") : v,
			]),
	);
	const response = await apiFetch(`/transactions?${params}`, {
		method: "GET",
	});
	return response.data;
}

async function deleteTransactionById(id: number): Promise<{ id: number }> {
	return { id };
}

// ---------------------------------------------------------------------------
// Query keys
// ---------------------------------------------------------------------------

export const transactionsKeys = {
	// Root key — invalidating this refetches every filtered variant below.
	root: ["transactions"] as const,
	list: (filters: TransactionFilters) =>
		["transactions", "list", filters] as const,
};

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

export function useTransactions(filters: TransactionFilters) {
	return useQuery({
		queryKey: transactionsKeys.list(filters),
		queryFn: () => fetchTransactions(filters),
	});
}

export function useDeleteTransaction() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteTransactionById,
		onSuccess: () => {
			// Matches every ["transactions", "list", ...] query regardless of filters
			queryClient.invalidateQueries({ queryKey: transactionsKeys.root });
		},
	});
}
