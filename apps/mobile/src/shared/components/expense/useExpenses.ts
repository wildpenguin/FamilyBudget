import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createExpense, deleteExpense, fetchExpenses } from './expenseApi';
import type { InputTransactionsType } from '@ourbudget/shared';

import { EXPENSES_KEY } from '../../constants';

export function useExpensesQuery() {
    return useQuery({
        queryKey: EXPENSES_KEY,
        queryFn: fetchExpenses,
    });
}

export function useCreateExpenseMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: InputTransactionsType) => createExpense(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: EXPENSES_KEY });
            // Dashboard balance/summary cards depend on expense totals — refresh those too.
            //queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
    });
}

export function useDeleteExpenseMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteExpense(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: EXPENSES_KEY });
            //queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
    });
}
