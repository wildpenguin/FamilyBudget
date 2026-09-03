import { CURRENCY } from "../constants";

export function centsToDollars(cents?: number): number {
	if (!cents) {
		return 0;
	}
	return cents / 100;
}

export function dollarsToCents(dollars: number): number {
	return Math.round(dollars * 100);
}

export function formatCentsAsCurrency(cents: number): string {
	return new Intl.NumberFormat("en-CA", {
		style: "currency",
		currency: CURRENCY,
		currencyDisplay: "narrowSymbol",
	}).format(cents / 100);
}
