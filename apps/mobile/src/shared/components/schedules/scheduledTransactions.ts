import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
	Category,
	NewScheduledTransaction,
	ScheduledTransaction,
} from "./types";

// ---------------------------------------------------------------------------
// Mock "database" — replace fetchSchedules / createSchedule / deleteSchedule
// with real fetch()/axios calls to your backend when ready. The hooks below
// (useScheduledTransactions, useCreateScheduledTransaction, etc.) don't need
// to change since they just call these functions.
// ---------------------------------------------------------------------------

const MOCK_CATEGORIES: Category[] = [
	{ id: "cat-1", name: "Salary" },
	{ id: "cat-2", name: "Electric bill" },
	{ id: "cat-3", name: "Rent" },
	{ id: "cat-4", name: "Internet" },
	{ id: "cat-5", name: "Groceries" },
];

let mockSchedules: ScheduledTransaction[] = [
	{
		id: "sch-1",
		categoryId: "cat-1",
		categoryName: "Salary",
		description: "Monthly salary",
		amount: 2400,
		frequency: "biweekly",
		startDate: "2026-01-02",
		endDate: null,
		dayOfMonth: null,
	},
	{
		id: "sch-2",
		categoryId: "cat-2",
		categoryName: "Electric bill",
		description: "Electric bill",
		amount: 85,
		frequency: "monthly",
		startDate: "2026-01-05",
		endDate: null,
		dayOfMonth: 5,
	},
	{
		id: "sch-3",
		categoryId: "cat-3",
		categoryName: "Rent",
		description: "Apartment rent",
		amount: 1200,
		frequency: "monthly",
		startDate: "2026-01-01",
		endDate: null,
		dayOfMonth: 1,
	},
	{
		id: "sch-4",
		categoryId: "cat-4",
		categoryName: "Internet",
		description: "Fiber internet",
		amount: 60,
		frequency: "monthly",
		startDate: "2026-01-10",
		endDate: null,
		dayOfMonth: 10,
	},
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchSchedules(): Promise<ScheduledTransaction[]> {
	await delay(400);
	return [...mockSchedules];
}

async function fetchCategories(): Promise<Category[]> {
	await delay(200);
	return [...MOCK_CATEGORIES];
}

async function createSchedule(
	payload: NewScheduledTransaction,
): Promise<ScheduledTransaction> {
	await delay(400);
	const created: ScheduledTransaction = {
		...payload,
		id: `sch-${Date.now()}`,
	};
	mockSchedules = [created, ...mockSchedules];
	return created;
}

async function deleteSchedule(id: string): Promise<{ id: string }> {
	await delay(300);
	mockSchedules = mockSchedules.filter((s) => s.id !== id);
	return { id };
}

// ---------------------------------------------------------------------------
// Query keys
// ---------------------------------------------------------------------------

export const scheduledTransactionsKeys = {
	all: ["scheduledTransactions"] as const,
	categories: ["categories"] as const,
};

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

export function useScheduledTransactions() {
	return useQuery({
		queryKey: scheduledTransactionsKeys.all,
		queryFn: fetchSchedules,
	});
}

export function useCategories() {
	return useQuery({
		queryKey: scheduledTransactionsKeys.categories,
		queryFn: fetchCategories,
	});
}

export function useCreateScheduledTransaction() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: createSchedule,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: scheduledTransactionsKeys.all,
			});
		},
	});
}

export function useDeleteScheduledTransaction() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteSchedule,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: scheduledTransactionsKeys.all,
			});
		},
	});
}
