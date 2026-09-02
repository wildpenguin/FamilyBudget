import React from "react";
import { StyleSheet, View } from "react-native";
import { Chip, TextInput } from "react-native-paper";
import type { TransactionFilters as Filters } from "./types";

interface Props {
	value: Filters;
	onChange: (next: Filters) => void;
}

function pad(n: number): string {
	return n < 10 ? `0${n}` : `${n}`;
}

function toDateString(date: Date): string {
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function startOfMonth(date: Date): string {
	return toDateString(new Date(date.getFullYear(), date.getMonth(), 1));
}

function endOfMonth(date: Date): string {
	return toDateString(new Date(date.getFullYear(), date.getMonth() + 1, 0));
}

export default function TransactionFilters({ value, onChange }: Props) {
	const thisMonthStart = startOfMonth(new Date());
	const thisMonthEnd = endOfMonth(new Date());
	const isThisMonthActive =
		value.startDate === thisMonthStart && value.endDate === thisMonthEnd;

	const hasActiveFilters =
		!!value.search || !!value.startDate || !!value.endDate;

	function handleThisMonthPress() {
		if (isThisMonthActive) {
			onChange({ ...value, startDate: null, endDate: null });
			return;
		}
		onChange({ ...value, startDate: thisMonthStart, endDate: thisMonthEnd });
	}

	function handleClearAll() {
		onChange({ search: "", startDate: null, endDate: null });
	}

	return (
		<View style={styles.container}>
			<TextInput
				mode="outlined"
				placeholder="Search by description or category"
				left={<TextInput.Icon icon="magnify" />}
				value={value.search}
				onChangeText={(v) => onChange({ ...value, search: v })}
				style={styles.search}
				dense
			/>

			<View style={styles.chipRow}>
				<Chip
					selected={isThisMonthActive}
					onPress={handleThisMonthPress}
					icon="calendar-month-outline"
					compact
				>
					This month
				</Chip>
				{hasActiveFilters && (
					<Chip onPress={handleClearAll} icon="close" compact>
						Clear filters
					</Chip>
				)}
			</View>

			<View style={styles.dateRow}>
				<View style={styles.dateField}>
					<TextInput
						mode="outlined"
						label="From"
						placeholder="YYYY-MM-DD"
						value={value.startDate ?? ""}
						onChangeText={(v) =>
							onChange({ ...value, startDate: v.trim() || null })
						}
						style={styles.input}
						dense
					/>
				</View>
				<View style={styles.dateField}>
					<TextInput
						mode="outlined"
						label="To"
						placeholder="YYYY-MM-DD"
						value={value.endDate ?? ""}
						onChangeText={(v) =>
							onChange({ ...value, endDate: v.trim() || null })
						}
						style={styles.input}
						dense
					/>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		gap: 8,
	},
	search: {
		width: "100%",
	},
	chipRow: {
		flexDirection: "row",
		gap: 8,
		flexWrap: "wrap",
	},
	dateRow: {
		flexDirection: "row",
		gap: 8,
		width: "100%",
	},
	dateField: {
		flex: 1,
		minWidth: 0,
	},
	input: {
		width: "100%",
	},
});
