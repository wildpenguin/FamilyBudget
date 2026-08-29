import { StyleSheet, View } from "react-native";
import { Icon, type MD3Theme, Text } from "react-native-paper";
import { useAppTheme } from "../../theme";
import { centsToDollars } from "../../utils/money";
import type { BalanceSummary } from "./dashboard";

type SummaryCardsProps = {
	data: BalanceSummary | undefined;
};

export function SummaryCards({ data }: SummaryCardsProps) {
	const theme = useAppTheme();

	return (
		<View style={styles.row}>
			<SummaryCard
				label="Income"
				amount={centsToDollars(data?.totalIncomeCents)}
				icon="arrow-up"
				tint={{
					background: theme.colors.income,
					foreground: theme.colors.tertiary,
				}}
				theme={theme}
			/>
			<SummaryCard
				label="Expenses"
				amount={centsToDollars(data?.totalExpensesCents)}
				icon="arrow-down"
				tint={{
					background: theme.colors.expense,
					foreground: theme.colors.error,
				}}
				theme={theme}
			/>
		</View>
	);
}

type SummaryCardProps = {
	label: string;
	amount: number | undefined;
	icon: string;
	tint: { background: string; foreground: string };
	theme: MD3Theme;
};

function SummaryCard({ label, amount, icon, tint, theme }: SummaryCardProps) {
	const formatted = amount !== undefined ? `$${amount.toLocaleString()}` : "—";

	return (
		<View
			style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]}
		>
			<View style={styles.labelRow}>
				<View style={[styles.iconCircle, { backgroundColor: tint.background }]}>
					<Icon source={icon} size={13} color={tint.foreground} />
				</View>
				<Text style={{ fontSize: 12, color: theme.colors.onSurfaceVariant }}>
					{label}
				</Text>
			</View>
			<Text
				style={[
					styles.amount,
					{ color: theme.colors.onSurface, fontWeight: 500 },
				]}
			>
				{formatted}
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		gap: 10,
	},
	card: {
		flex: 1,
		borderRadius: 16,
		padding: 12,
	},
	labelRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},
	iconCircle: {
		width: 22,
		height: 22,
		borderRadius: 7,
		alignItems: "center",
		justifyContent: "center",
	},
	amount: {
		fontSize: 18,
		fontWeight: "700",
		marginTop: 6,
	},
});
