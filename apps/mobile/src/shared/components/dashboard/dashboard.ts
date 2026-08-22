export type BalanceSummary = {
    currentBalance: number;
    currency: string;
    percentChangeVsLastMonth: number;
};

export type PeriodSummary = {
    totalIncome: number;
    totalExpenses: number;
};

export type MonthlyChartPoint = {
    month: string; // short label, e.g. "Mar"
    income: number;
    expenses: number;
};

export type CategoryBreakdown = {
    id: string;
    name: string;
    icon: string; // MaterialCommunityIcons name
    amount: number;
    percentOfMax: number; // 0–1, relative to the largest category, used for the bar width
};

export type UpcomingSchedule = {
    id: string;
    title: string;
    dueInDays: number;
    amount: number;
};

export type Transaction = {
    id: string;
    title: string;
    category: string;
    icon: string; // MaterialCommunityIcons name
    amount: number; // positive = income, negative = expense
    date: string; // display-ready label, e.g. "Today", "Yesterday", "Aug 19"
};
