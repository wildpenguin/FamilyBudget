import type { CreateCategory, GetCategory } from "@ourbudget/shared";
import { apiFetch } from "../../utils/apiConfig";

export async function fetchCategories(): Promise<GetCategory[]> {
	return await apiFetch(`/categories`);
}

export async function createCategory(
	input: CreateCategory,
): Promise<GetCategory> {
	return await apiFetch("/categories", {
		method: "POST",
		body: JSON.stringify(input),
	});
}

export async function deleteCategory(id: string): Promise<void> {
	return await apiFetch(`/categories/${id}`, { method: "DELETE" });
}
