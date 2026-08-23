import type { Category, CreateCategoryInput } from "./category";

// import { API_URL } from '../utils/apiConfig'; // uncomment once wired to the real backend

const MOCK_DELAY_MS = 300;

function delay<T>(value: T, ms: number = MOCK_DELAY_MS): Promise<T> {
	return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

// In-memory store standing in for the backend. Replace each function body
// below with a real fetch() call once the API exists — signatures and
// return types stay identical, so the hooks/components never need to change.
let categories: Category[] = [
	{ id: "cat-1", name: "Rent", type: "expense" },
	{ id: "cat-2", name: "Groceries", type: "expense" },
	{ id: "cat-3", name: "Transport", type: "expense" },
	{ id: "cat-4", name: "Salary", type: "income" },
	{ id: "cat-5", name: "Freelance", type: "income" },
];

export async function fetchCategories(): Promise<Category[]> {
	// return (await fetch(`${API_URL}/categories`)).json();
	return delay([...categories]);
}

export async function createCategory(
	input: CreateCategoryInput,
): Promise<Category> {
	// return (await fetch(`${API_URL}/categories`, {
	//   method: 'POST',
	//   headers: { 'Content-Type': 'application/json' },
	//   body: JSON.stringify(input),
	// })).json();
	const newCategory: Category = { id: `cat-${Date.now()}`, ...input };
	categories = [newCategory, ...categories];
	return delay(newCategory);
}

export async function deleteCategory(id: string): Promise<void> {
	// await fetch(`${API_URL}/categories/${id}`, { method: 'DELETE' });
	categories = categories.filter((category) => category.id !== id);
	return delay(undefined);
}
