import type { CreateCategory, GetCategory } from "@ourbudget/shared";
import { StyleSheet, View } from "react-native";
import { Icon, IconButton, Text } from "react-native-paper";
import { useAppTheme } from "../../theme";

type CategoryListItemProps = {
	category: GetCategory;
	onDelete: (id: number) => void;
	isDeleting: boolean;
};

export function CategoryListItem({
	category,
	onDelete,
	isDeleting,
}: CategoryListItemProps) {
	const theme = useAppTheme();
	const isIncome = category.type === "income";

	const tint = isIncome
		? {
				foreground: theme.colors.tertiary,
			}
		: {
				foreground: theme.colors.error,
			};

	return (
		<View style={styles.row}>
			<View
				style={[
					styles.iconCircle,
					{
						backgroundColor: isIncome
							? theme.colors.income
							: theme.colors.expense,
					},
				]}
			>
				<Icon
					source={isIncome ? "arrow-up" : "arrow-down"}
					size={16}
					color={tint.foreground}
				/>
			</View>

			<View style={styles.textContainer}>
				<Text style={{ fontSize: 14, color: theme.colors.onSurface }}>
					{category.name}
				</Text>
				<Text style={{ fontSize: 11, color: tint.foreground, marginTop: 1 }}>
					{isIncome ? "Income" : "Expense"}
				</Text>
			</View>

			<IconButton
				icon="trash-can-outline"
				size={18}
				onPress={() => onDelete(category.id)}
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
