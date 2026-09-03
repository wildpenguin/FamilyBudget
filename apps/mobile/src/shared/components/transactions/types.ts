export type TransactionType = "income" | "expense";

export interface Transaction {
	transactions: {
		id: number;
		type: TransactionType;
		description: string;
		category: string;
		amountCents: number; // always stored positive; sign is derived from `type`
		date: string; // ISO date, e.g. "2026-08-14"
	};
	categories: {
		id: number;
		familyId: number;
		name: string;
		type: "income" | "expense";
	};
}

// Shape sent when updating an existing transaction
export type UpdateTransaction = Partial<Omit<Transaction, "id">> & {
	id: string;
};

export interface TransactionFilters {
	search: string;
	startDate: string | null; // YYYY-MM-DD, inclusive
	endDate: string | null; // YYYY-MM-DD, inclusive
}

export const defaultTransactionFilters: TransactionFilters = {
	search: "",
	startDate: null,
	endDate: null,
};
