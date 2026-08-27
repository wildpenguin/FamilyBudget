import type {
	GetTransactionType,
	InputTransactionsType,
} from "@ourbudget/shared";
import { apiFetch } from "../../utils/apiConfig";

export async function fetchExpenses(): Promise<GetTransactionType[]> {
	const response = await apiFetch(`/transactions?filter[type]=expense`, {
		method: "GET",
	});
	return response.data;
}

export async function createExpense(
	input: InputTransactionsType,
): Promise<GetTransactionType> {
	return await apiFetch("/transactions", {
		method: "POST",
		body: JSON.stringify(input),
	});
}

export async function deleteExpense(id: number): Promise<void> {
	await apiFetch(`/transactions/${id}`, { method: "DELETE" });
}
