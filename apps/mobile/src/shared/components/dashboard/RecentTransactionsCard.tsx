import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { Icon, Text } from "react-native-paper";
import { useAppTheme } from "../../theme";

import { GetTransactionType } from "@ourbudget/shared";
import { formatCentsAsCurrency } from "../../utils/money";

type RecentTransactionsCardProps = {
	data: GetTransactionType[] | undefined;
};

export function RecentTransactionsCard({ data }: RecentTransactionsCardProps) {
	const theme = useAppTheme();

	return (
		<View>
			<View style={styles.headerRow}>
				<Text
					style={{
						fontSize: 14,
						fontWeight: "600",
						color: theme.colors.onSurface,
					}}
				>
					Recent transactions
				</Text>
				<Pressable onPress={() => router.push("/(tabs)/transactions")}>
					<Text style={{ fontSize: 12, color: theme.colors.primary }}>
						See all
					</Text>
				</Pressable>
			</View>

			<View>
				{(data ?? []).map((item) => {
					const { transactions, categories} = item;
					const isIncome = transactions.type === 'income';
					const tint = isIncome
						? {
								background: theme.colors.income,
								foreground: theme.colors.tertiary,
							}
						: {
								background: theme.colors.expense,
								foreground: theme.colors.error,
							};

					return (
						<View key={transactions.id} style={styles.row}>
							<View
								style={[
									styles.iconCircle,
									{ backgroundColor: tint.background },
								]}
							>
								<Icon
									source= {isIncome ? 'arrow-up' : 'arrow-down'}
									size={16}
									color={tint.foreground}
								/>
							</View>
							<View style={styles.textContainer}>
								<Text style={{ fontSize: 13, color: theme.colors.onSurface }}>
									{transactions.description}
								</Text>
								<Text
									style={{ fontSize: 11, color: theme.colors.onSurfaceVariant }}
								>
									{transactions.date}
								</Text>
							</View>
							<Text
								style={[{
									fontSize: 13,
									fontWeight: "400",
									color: tint.foreground,
								}, isIncome && styles.incomeAmount]}
							>
								{isIncome ? "+" : "-"}
								{formatCentsAsCurrency(transactions.amountCents)}
							</Text>
						</View>
					);
				})}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	headerRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 8,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		paddingVertical: 9,
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
	incomeAmount: {
		color: "#0F6E56",
	},
});
