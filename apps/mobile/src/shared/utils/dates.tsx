import { format, parse } from "date-fns";

export function formatDateOnly(value: string, pattern = "d LLL") {
	const date = parse(value, "yyyy-MM-dd", new Date());

	return format(date, pattern);
}
