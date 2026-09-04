import React from "react";
import { StyleSheet, View } from "react-native";
import { Chip, TextInput } from "react-native-paper";
import { DatePickerInput } from "react-native-paper-dates";
import type { TransactionFilters as Filters } from "./types";

interface Props {
	value: Filters;
	onChange: (next: Filters) => void;
}

export default function TransactionFilters({ value, onChange }: Props) {
	const hasActiveFilters = !!value.search || !!value.from || !!value.to;

	function handleClearAll() {
		onChange({ search: "", from: undefined, to: undefined });
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

			<View style={styles.dateRow}>
				<View style={styles.dateField}>
					<DatePickerInput
						locale="en"
						label="From"
						value={value.from}
						onChange={(d) => onChange({ ...value, from: d })}
						inputMode="start"
					/>
				</View>
				<View style={styles.dateField}>
					<DatePickerInput
						locale="en"
						label="To"
						value={value.to}
						onChange={(d) => onChange({ ...value, to: d })}
						inputMode="start"
					/>
				</View>
			</View>
			<View style={styles.chipRow}>
				{hasActiveFilters && (
					<Chip onPress={handleClearAll} icon="close" compact>
						Clear filters
					</Chip>
				)}
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
