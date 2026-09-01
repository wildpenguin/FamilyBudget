export type ScheduleFrequency =
	| "once"
	| "weekly"
	| "biweekly"
	| "monthly"
	| "yearly";

export type Schedule = {
	id: number;
	categoryId: number;
	categoryName: string;
	categoryType: "income" | "expense";
	description: string;
	amountCents: number; // signed: positive = income, negative = expense
	frequency: ScheduleFrequency;
	startDate: string; // YYYY-MM-DD
	endDate?: string;
	dayOfMonth?: number;
};

export type NewSchedule = Omit<Schedule, "id">;
