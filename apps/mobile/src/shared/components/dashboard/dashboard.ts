export type BalanceSummary = {
	totalIncomeCents: number;
	totalExpensesCents: number;
	totalNetCents: number;
	byCategory: CategoryBreakdown[];
};

export type MonthlyChartPoint = {
	month: string; // short label, e.g. "Mar"
	income: number;
	expenses: number;
};

export type CategoryBreakdown = {
	categoryId: number;
	categoryName: string;
	icon: string; // MaterialCommunityIcons name
	totalAmountCents: number;
	percentOfMax: number; // 0–1, relative to the largest category, used for the bar width
};

export type UpcomingSchedule = {
	title: string;
	dueInDays: number;
	amountCents: number;
	type: string;
	category: string;
};

export type Transaction = {
	id: string;
	title: string;
	category: string;
	icon: string; // MaterialCommunityIcons name
	amount: number; // positive = income, negative = expense
	date: string; // display-ready label, e.g. "Today", "Yesterday", "Aug 19"
};
