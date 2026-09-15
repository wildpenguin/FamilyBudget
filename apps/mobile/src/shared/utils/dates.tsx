import { format } from "date-fns";

export function formatDateOnly(value: string, pattern = "d LLL") {
	// PostgreSQL DATE values arrive as YYYY-MM-DD, but this app records them in
	// UTC. Add the UTC offset explicitly so format() renders that instant in the
	// browser's current timezone instead of treating it as a local calendar date.
	const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
	const date = new Date(dateOnly ? `${value}T00:00:00.000Z` : value);

	return format(date, pattern);
}
