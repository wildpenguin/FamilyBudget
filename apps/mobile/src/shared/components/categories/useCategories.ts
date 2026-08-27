import { CATEGORIES_KEY, type CreateCategory } from "@ourbudget/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCategory, deleteCategory, fetchCategories } from "./categoryApi";

export function useCategoriesQuery() {
	return useQuery({
		queryKey: CATEGORIES_KEY,
		queryFn: fetchCategories,
	});
}

export function useCreateCategoryMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: CreateCategory) => createCategory(input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY });
		},
	});
}

export function useDeleteCategoryMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => deleteCategory(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY });
		},
	});
}
