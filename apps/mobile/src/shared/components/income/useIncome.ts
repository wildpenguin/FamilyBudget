import type { InputTransactionsType } from "@ourbudget/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { INCOME_KEY } from "../../constants";
import { createIncome, deleteIncome, fetchIncome } from "./incomeApi";

export function useIncomeQuery() {
	return useQuery({
		queryKey: INCOME_KEY,
		queryFn: fetchIncome,
	});
}

export function useCreateIncomeMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: InputTransactionsType) => createIncome(input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: INCOME_KEY });
			// Dashboard balance/summary cards depend on expense totals — refresh those too.
			//queryClient.invalidateQueries({ queryKey: ['dashboard'] });
		},
	});
}

export function useDeleteIncomeMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => deleteIncome(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: INCOME_KEY });
			//queryClient.invalidateQueries({ queryKey: ['dashboard'] });
		},
	});
}
