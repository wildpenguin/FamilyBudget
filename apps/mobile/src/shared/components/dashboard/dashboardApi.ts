import type {
    BalanceSummary,
    CategoryBreakdown,
    MonthlyChartPoint,
    PeriodSummary,
    Transaction,
    UpcomingSchedule,
} from './dashboard';

// import { API_URL } from '../utils/apiConfig'; // uncomment once wired to the real backend

const MOCK_DELAY_MS = 400;

function delay<T>(value: T, ms: number = MOCK_DELAY_MS): Promise<T> {
    return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

// Each function below returns mock data today. Swap the body for a real
// `fetch(`${API_URL}/...`)` call once the backend is ready — the return
// type stays identical, so nothing else in the app (hooks, components)
// needs to change.

export async function fetchBalanceSummary(): Promise<BalanceSummary> {
    // return (await fetch(`${API_URL}/dashboard/balance`)).json();
    return delay({
        currentBalance: 4286.5,
        currency: 'USD',
        percentChangeVsLastMonth: 4.2,
    });
}

export async function fetchPeriodSummary(): Promise<PeriodSummary> {
    // return (await fetch(`${API_URL}/dashboard/summary`)).json();
    return delay({
        totalIncome: 3540,
        totalExpenses: 2510,
    });
}

export async function fetchMonthlyChartData(): Promise<MonthlyChartPoint[]> {
    // return (await fetch(`${API_URL}/dashboard/chart?months=6`)).json();
    return delay([
        { month: 'Mar', income: 3200, expenses: 2400 },
        { month: 'Apr', income: 3100, expenses: 2800 },
        { month: 'May', income: 3400, expenses: 2300 },
        { month: 'Jun', income: 3300, expenses: 3100 },
        { month: 'Jul', income: 3600, expenses: 2600 },
        { month: 'Aug', income: 3540, expenses: 2510 },
    ]);
}

export async function fetchTopCategories(): Promise<CategoryBreakdown[]> {
    // return (await fetch(`${API_URL}/dashboard/top-categories`)).json();
    const categories = [
        { id: 'rent', name: 'Rent', icon: 'home-outline', amount: 1200 },
        { id: 'groceries', name: 'Groceries', icon: 'cart-outline', amount: 420 },
        { id: 'transport', name: 'Transport', icon: 'car-outline', amount: 180 },
    ];
    const max = Math.max(...categories.map((category) => category.amount));
    return delay(categories.map((category) => ({ ...category, percentOfMax: category.amount / max })));
}

export async function fetchUpcomingSchedule(): Promise<UpcomingSchedule | null> {
    // return (await fetch(`${API_URL}/schedules/next`)).json();
    return delay({
        id: 'sched-1',
        title: 'Car insurance',
        dueInDays: 3,
        amount: 85,
    });
}

export async function fetchRecentTransactions(): Promise<Transaction[]> {
    // return (await fetch(`${API_URL}/transactions/recent?limit=3`)).json();
    return delay([
        { id: 't1', title: 'Salary', category: 'Income', icon: 'briefcase-outline', amount: 3200, date: 'Today' },
        { id: 't2', title: 'Whole Foods', category: 'Groceries', icon: 'cart-outline', amount: -64.2, date: 'Yesterday' },
        { id: 't3', title: 'Electric bill', category: 'Utilities', icon: 'flash-outline', amount: -92.5, date: 'Aug 19' },
    ]);
}
