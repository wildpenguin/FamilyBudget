import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../utils/apiConfig";
import type { Transaction, TransactionFilters } from "./types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchTransactions(
	filters: TransactionFilters,
): Promise<Transaction[]> {
	const response = await apiFetch("/transactions", { method: "GET" });
	return response.data;
}

async function deleteTransactionById(id: string): Promise<{ id: string }> {
	return { id: "1" };
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
