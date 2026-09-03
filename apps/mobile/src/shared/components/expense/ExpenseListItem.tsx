import { format, parse } from "date-fns";
import { StyleSheet, View } from "react-native";
import { Icon, IconButton, Text } from "react-native-paper";
import { useAppTheme } from "../../theme";
import { formatDateOnly } from "../../utils/dates";
import { centsToDollars } from "../../utils/money";

type ExpenseListItemProps = {
	expense: Expense;
	onDelete: (id: string) => void;
	isDeleting: boolean;
};

export function ExpenseListItem({
	expense,
	onDelete,
	isDeleting,
}: ExpenseListItemProps) {
	const theme = useAppTheme();
	const { transactions, categories } = expense;
	return (
		<View style={styles.row}>
			<View
				style={[styles.iconCircle, { backgroundColor: theme.colors.expense }]}
			>
				<Icon source="arrow-down" size={16} color={theme.colors.error} />
			</View>

			<View style={styles.textContainer}>
				<Text style={{ fontSize: 14, color: theme.colors.onSurface }}>
					{transactions.description}
				</Text>
				<Text
					style={{
						fontSize: 11,
						color: theme.colors.onSurfaceVariant,
						marginTop: 1,
					}}
				>
					{categories.name} · {formatDateOnly(transactions.date)}
				</Text>
			</View>

			<Text
				style={{
					fontSize: 15,
					fontWeight: "400",
					color: theme.colors.error,
					marginRight: 4,
				}}
			>
				-${centsToDollars(transactions.amountCents)}
			</Text>

			<IconButton
				icon="trash-can-outline"
				size={18}
				onPress={() => onDelete(transactions.id)}
				disabled={isDeleting}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		paddingVertical: 8,
	},
	iconCircle: {
		width: 34,
		height: 34,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
	},
	textContainer: {
		flex: 1,
	},
});
