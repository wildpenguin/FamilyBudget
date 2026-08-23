import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createCategory, deleteCategory, fetchCategories } from './categoryApi';
import type { CreateCategoryInput } from './category';

const CATEGORIES_KEY = ['categories'];

export function useCategoriesQuery() {
    return useQuery({
        queryKey: CATEGORIES_KEY,
        queryFn: fetchCategories,
    });
}

export function useCreateCategoryMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: CreateCategoryInput) => createCategory(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY });
        },
    });
}

export function useDeleteCategoryMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY });
        },
    });
}
