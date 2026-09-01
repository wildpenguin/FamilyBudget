export type Frequency = "weekly" | "biweekly" | "monthly";

export interface Category {
	id: string;
	name: string;
}

export interface ScheduledTransaction {
	id: string;
	categoryId: string;
	categoryName: string;
	description: string;
	amount: number;
	frequency: Frequency;
	startDate: string; // YYYY-MM-DD
	endDate: string | null; // YYYY-MM-DD or null
	dayOfMonth: number | null; // only relevant when frequency === "monthly"
}

// Shape sent when creating a new schedule (id is assigned by the "server")
export type NewScheduledTransaction = Omit<ScheduledTransaction, "id">;
