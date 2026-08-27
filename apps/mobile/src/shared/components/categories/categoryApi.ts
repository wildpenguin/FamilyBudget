import type { CreateCategory, GetCategory } from "@ourbudget/shared";
import { apiFetch } from "../../utils/apiConfig";

export async function fetchCategories(): Promise<GetCategory[]> {
	const response = await apiFetch(`/categories`, { method: 'GET' });
	return response.data;
}

export async function createCategory(
	input: CreateCategory,
): Promise<GetCategory> {
	const response = await apiFetch("/categories", {
		method: "POST",
		body: JSON.stringify(input),
	});
	return response.data;
}

export async function deleteCategory(id: number): Promise<void> {
	return await apiFetch(`/categories/${id}`, { method: "DELETE" });
}
