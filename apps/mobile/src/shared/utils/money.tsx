export function centsToDollars(cents: number): number {
	return cents / 100;
}

export function dollarsToCents(dollars: number): number {
	return Math.round(dollars * 100);
}

export function formatCentsAsCurrency(
	cents: number,
	currency: string = "CAD",
): string {
	return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
		cents / 100,
	);
}
