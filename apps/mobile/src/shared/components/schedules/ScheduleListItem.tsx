import { StyleSheet, View } from "react-native";
import {
	ActivityIndicator,
	Card,
	Icon,
	IconButton,
	Text,
} from "react-native-paper";
import { useAppTheme } from "../../theme";
import { centsToDollars } from "../../utils/money";
import {
	useDeleteScheduledTransaction,
	useScheduledTransactions,
} from "./scheduledTransactions";
import type { Frequency, ScheduledTransaction } from "./types";

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
	const { schedules, categories } = item;
	const theme = useAppTheme();

	return (
		<Card style={styles.scheduleCard} mode="outlined">
			<View style={styles.scheduleRow}>
				<View
					style={[
						styles.iconCircle,
						{
							backgroundColor:
								categories.type === "income"
									? theme.colors.income
									: theme.colors.expense,
						},
					]}
				>
					<Icon
						source={categories.type === "income" ? "arrow-up" : "arrow-down"}
						size={16}
						color={
							categories.type === "income"
								? theme.colors.tertiary
								: theme.colors.error
						}
					/>
				</View>
				<View style={styles.scheduleInfo}>
					<Text style={styles.scheduleDescription} numberOfLines={1}>
						{schedules.description}
					</Text>
					<Text style={styles.scheduleMeta} numberOfLines={1}>
						{categories.name} ·{" "}
						{frequencyLabel(schedules.frequency, schedules.dayOfMonth)}
					</Text>
				</View>
				<Text style={styles.scheduleAmount}>
					${centsToDollars(schedules.amountCents)}
				</Text>
				<IconButton
					icon="trash-can-outline"
					size={18}
					onPress={() => onDelete(schedules.id)}
					disabled={deleting}
				/>
			</View>
		</Card>
	);
}

export default function ScheduledTransactionList() {
	const { data = [], isLoading, isError } = useScheduledTransactions();
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

	if (data.length === 0) {
		return (
			<View style={styles.centered}>
				<Text style={styles.emptyText}>No scheduled transactions yet</Text>
			</View>
		);
	}

	return (
		<View style={styles.listContent}>
			{data.map((item) => (
				<ScheduleRow
					key={item.schedules.id}
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
	iconCircle: {
		width: 34,
		height: 34,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
	},
});
