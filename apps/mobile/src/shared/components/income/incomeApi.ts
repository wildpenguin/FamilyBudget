import type {
	GetTransactionType,
	InputTransactionsType,
} from "@ourbudget/shared";
import { apiFetch } from "../../utils/apiConfig";

export async function fetchIncome(): Promise<GetTransactionType[]> {
	const response = await apiFetch(`/transactions?filter[type]=income`, {
		method: "GET",
	});
	return response.data;
}

export async function createIncome(
	input: InputTransactionsType,
): Promise<GetTransactionType> {
	return await apiFetch("/transactions", {
		method: "POST",
		body: JSON.stringify(input),
	});
}

export async function deleteIncome(id: number): Promise<void> {
	await apiFetch(`/transactions/${id}`, { method: "DELETE" });
}
