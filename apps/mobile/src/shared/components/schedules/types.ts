export type Frequency = "weekly" | "biweekly" | "monthly";

export interface Category {
	id: string;
	name: string;
}

export interface ScheduledTransaction {
	schedules: {
		id: string;
		categoryId: string;
		description: string;
		amountCents: number;
		frequency: Frequency;
		startDate: Date;
		endDate: Date | undefined;
		dayOfMonth: number | null; // only relevant when frequency === "monthly"
		dayOfWeek: number | null;
	},
	categories: {
		familyId: number;
		id: number;
		name: string;
		type: "expense" | "income";
	}
}

// Shape sent when creating a new schedule (id is assigned by the "server")
export type NewScheduledTransaction = Omit<ScheduledTransaction, "id">;
