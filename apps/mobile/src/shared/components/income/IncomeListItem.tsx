import type { GetTransactionType } from "@ourbudget/shared";
import { StyleSheet, View } from "react-native";
import { Icon, IconButton, Text } from "react-native-paper";
import { useAppTheme } from "../../theme";
import { centsToDollars } from "../../utils/money";

type IncomeListItemProps = {
	income: GetTransactionType;
	onDelete: (id: number) => void;
	isDeleting: boolean;
};

function formatDate(iso: string): string {
	const date = new Date(iso);
	return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function IncomeListItem({
	income,
	onDelete,
	isDeleting,
}: IncomeListItemProps) {
	const theme = useAppTheme();

	return (
		<View style={styles.row}>
			<View
				style={[styles.iconCircle, { backgroundColor: theme.colors.income }]}
			>
				<Icon source="arrow-up" size={16} color={theme.colors.tertiary} />
			</View>

			<View style={styles.textContainer}>
				<Text style={{ fontSize: 14, color: theme.colors.onSurface }}>
					{income.description}
				</Text>
				<Text
					style={{
						fontSize: 11,
						color: theme.colors.onSurfaceVariant,
						marginTop: 1,
					}}
				>
					{income.categoryId} · {formatDate(income.date)}
				</Text>
			</View>

			<Text
				style={{
					fontSize: 15,
					fontWeight: "400",
					color: theme.colors.primary,
					marginRight: 4,
				}}
			>
				+${centsToDollars(income.amountCents)}
			</Text>

			<IconButton
				icon="trash-can-outline"
				size={18}
				onPress={() => onDelete(income.id)}
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
