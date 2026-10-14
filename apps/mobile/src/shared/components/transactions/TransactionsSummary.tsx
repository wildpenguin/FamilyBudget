import { StyleSheet, View } from "react-native";
import { Card, Icon, Text } from "react-native-paper";
import { useAppTheme } from "../../theme";
import { formatCentsAsCurrency } from "../../utils/money";
import { useBalanceSummary } from "../dashboard/useDashboardQueries";
import type { TransactionFilters } from "./types";

interface Props {
	filters: TransactionFilters;
}

const COLORS = {
	incomeText: "#1E7A3C",
	incomeTint: "#D4EFD9",
	expenseText: "#D32F2F",
	expenseTint: "#FBDCDC",
	border: "#E3E5EA",
	placeholder: "rgba(0, 0, 0, 0.08)",
};

export default function TransactionsSummary({ filters }: Props) {
	const theme = useAppTheme();

	// On error, data stays undefined and both cells fall back to "—".
	const { data, isLoading } = useBalanceSummary(filters);

	return (
		<Card
			mode="outlined"
			style={[
				styles.card,
				{ backgroundColor: theme.colors.surface, borderColor: COLORS.border },
			]}
		>
			<View style={styles.row}>
				<Cell
					label="Income"
					icon="arrow-up"
					value={data?.totalIncomeCents}
					tint={COLORS.incomeTint}
					color={COLORS.incomeText}
					labelColor={theme.colors.onSurfaceVariant}
					loading={isLoading}
				/>
				<View style={[styles.divider, { backgroundColor: COLORS.border }]} />
				<Cell
					label="Expenses"
					icon="arrow-down"
					value={data?.totalExpensesCents}
					tint={COLORS.expenseTint}
					color={COLORS.expenseText}
					labelColor={theme.colors.onSurfaceVariant}
					loading={isLoading}
				/>
			</View>
		</Card>
	);
}

type CellProps = {
	label: string;
	icon: string;
	value: number | undefined;
	tint: string;
	color: string;
	labelColor: string;
	loading: boolean;
};

function Cell({
	label,
	icon,
	value,
	tint,
	color,
	labelColor,
	loading,
}: CellProps) {
	return (
		<View style={styles.cell}>
			<View style={[styles.chip, { backgroundColor: tint }]}>
				<Icon source={icon} size={16} color={color} />
			</View>
			<View style={styles.cellText}>
				<Text variant="labelSmall" style={{ color: labelColor }}>
					{label}
				</Text>
				{loading ? (
					<View style={styles.placeholder} />
				) : (
					<Text
						variant="titleSmall"
						style={[styles.value, { color }]}
						numberOfLines={1}
						adjustsFontSizeToFit
					>
						{value !== undefined ? formatCentsAsCurrency(value) : "—"}
					</Text>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		marginVertical: 16,
		borderRadius: 10,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 12,
		paddingVertical: 10,
		gap: 12,
	},
	divider: {
		width: StyleSheet.hairlineWidth,
		alignSelf: "stretch",
	},
	cell: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		minWidth: 0,
	},
	chip: {
		width: 32,
		height: 32,
		borderRadius: 7,
		alignItems: "center",
		justifyContent: "center",
	},
	cellText: {
		flex: 1,
		minWidth: 0,
	},
	value: {
		fontSize: 15,
		fontWeight: "700",
		fontVariant: ["tabular-nums"],
	},
	placeholder: {
		height: 16,
		width: "70%",
		borderRadius: 4,
		marginTop: 2,
		backgroundColor: COLORS.placeholder,
	},
});
