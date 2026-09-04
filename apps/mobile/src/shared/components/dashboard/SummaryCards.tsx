import { StyleSheet, View } from "react-native";
import { Icon, type MD3Theme, Text } from "react-native-paper";
import { useAppTheme } from "../../theme";
import { formatCentsAsCurrency } from "../../utils/money";
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
				amount={data?.totalIncomeCents}
				icon="arrow-up"
				tint={{
					background: theme.colors.income,
					foreground: "#016301",
					boxBackground: theme.colors.income,
				}}
				theme={theme}
			/>
			<SummaryCard
				label="Expenses"
				amount={data?.totalExpensesCents}
				icon="arrow-down"
				tint={{
					background: theme.colors.expense,
					foreground: theme.colors.error,
					boxBackground: theme.colors.expense,
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
	tint: { background: string; foreground: string; boxBackground: string };
	theme: MD3Theme;
};

function SummaryCard({ label, amount, icon, tint, theme }: SummaryCardProps) {
	const formatted = amount !== undefined ? formatCentsAsCurrency(amount) : "—";

	return (
		<View style={[styles.card, { backgroundColor: tint.boxBackground }]}>
			<View style={styles.labelRow}>
				<View style={[styles.iconCircle, { backgroundColor: tint.background }]}>
					<Icon source={icon} size={13} color={tint.foreground} />
				</View>
				<Text style={{ fontSize: 13, color: tint.foreground }}>{label}</Text>
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
