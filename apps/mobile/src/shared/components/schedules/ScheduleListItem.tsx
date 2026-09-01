import React from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Card, IconButton, Text } from "react-native-paper";
import type { Frequency, ScheduledTransaction } from "../types";
import {
	useDeleteScheduledTransaction,
	useScheduledTransactions,
} from "./scheduledTransactions";

function frequencyLabel(
	frequency: Frequency,
	dayOfMonth: number | null,
): string {
	if (frequency === "weekly") return "Weekly";
	if (frequency === "biweekly") return "Every 2 weeks";
	return `Monthly, day ${dayOfMonth}`;
}

interface RowProps {
	item: ScheduledTransaction;
	onDelete: (id: string) => void;
	deleting: boolean;
}

function ScheduleRow({ item, onDelete, deleting }: RowProps) {
	return (
		<Card style={styles.scheduleCard} mode="outlined">
			<View style={styles.scheduleRow}>
				<View style={styles.scheduleInfo}>
					<Text style={styles.scheduleDescription} numberOfLines={1}>
						{item.description}
					</Text>
					<Text style={styles.scheduleMeta} numberOfLines={1}>
						{item.categoryName} ·{" "}
						{frequencyLabel(item.frequency, item.dayOfMonth)}
					</Text>
				</View>
				<Text style={styles.scheduleAmount}>${item.amount.toFixed(0)}</Text>
				<IconButton
					icon="trash-can-outline"
					size={18}
					onPress={() => onDelete(item.id)}
					disabled={deleting}
				/>
			</View>
		</Card>
	);
}

export default function ScheduledTransactionList() {
	const {
		data: schedules = [],
		isLoading,
		isError,
	} = useScheduledTransactions();
	const deleteMutation = useDeleteScheduledTransaction();

	if (isLoading) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator />
			</View>
		);
	}

	if (isError) {
		return (
			<View style={styles.centered}>
				<Text style={styles.emptyText}>
					Couldn't load scheduled transactions.
				</Text>
			</View>
		);
	}

	if (schedules.length === 0) {
		return (
			<View style={styles.centered}>
				<Text style={styles.emptyText}>No scheduled transactions yet</Text>
			</View>
		);
	}

	return (
		<View style={styles.listContent}>
			{schedules.map((item) => (
				<ScheduleRow
					key={item.id}
					item={item}
					onDelete={(id) => deleteMutation.mutate(id)}
					deleting={deleteMutation.isPending}
				/>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	listContent: {
		gap: 8,
	},
	centered: {
		paddingVertical: 24,
		alignItems: "center",
	},
	scheduleCard: {
		width: "100%",
	},
	scheduleRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		padding: 12,
	},
	scheduleInfo: {
		flex: 1,
		minWidth: 0,
	},
	scheduleDescription: {
		fontSize: 14,
		fontWeight: "500",
	},
	scheduleMeta: {
		fontSize: 12,
		color: "#666",
		marginTop: 2,
	},
	scheduleAmount: {
		fontSize: 14,
		fontWeight: "500",
		flexShrink: 0,
	},
	emptyText: {
		textAlign: "center",
		color: "#888",
		fontSize: 13,
	},
});
