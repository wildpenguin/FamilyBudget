import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { useAppTheme } from "../../theme";

import type { MonthlyChartPoint } from "./dashboard";

type IncomeExpenseChartProps = {
	data: MonthlyChartPoint[] | undefined;
};

const CHART_HEIGHT = 60;

export function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
	const theme = useAppTheme();

	if (!data || data.length === 0) {
		return null;
	}

	const maxValue = Math.max(
		...data.flatMap((point) => [point.income, point.expenses]),
	);
	const currentMonth = data[data.length - 1]?.month;

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
					Income vs Expenses
				</Text>
				<Text style={{ fontSize: 12, color: theme.colors.onSurfaceVariant }}>
					{data.length} months
				</Text>
			</View>

			<View
				style={[
					styles.chartContainer,
					{ backgroundColor: theme.colors.surfaceVariant },
				]}
			>
				{data.map((point) => {
					const isCurrent = point.month === currentMonth;
					return (
						<View key={point.month} style={styles.barGroup}>
							<View style={styles.bars}>
								<View
									style={[
										styles.bar,
										{
											height: Math.max(
												(point.income / maxValue) * CHART_HEIGHT,
												4,
											),
											backgroundColor: theme.colors.primary,
											opacity: isCurrent ? 1 : 0.55,
										},
									]}
								/>
								<View
									style={[
										styles.bar,
										{
											height: Math.max(
												(point.expenses / maxValue) * CHART_HEIGHT,
												4,
											),
											backgroundColor: theme.colors.error,
											opacity: isCurrent ? 1 : 0.55,
										},
									]}
								/>
							</View>
							<Text
								style={{
									fontSize: 10,
									color: isCurrent
										? theme.colors.onSurface
										: theme.colors.onSurfaceVariant,
									fontWeight: isCurrent ? "600" : "400",
									marginTop: 4,
								}}
							>
								{point.month}
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
		marginBottom: 10,
	},
	chartContainer: {
		borderRadius: 12,
		paddingHorizontal: 12,
		paddingTop: 14,
		paddingBottom: 8,
		flexDirection: "row",
		alignItems: "flex-end",
		justifyContent: "flex-start",
		gap: 20,
		height: 100,
	},
	barGroup: {
		alignItems: "flex-start",
		gap: 4,
	},
	bars: {
		flexDirection: "row",
		alignItems: "flex-end",
		gap: 3,
		height: CHART_HEIGHT,
	},
	bar: {
		width: 7,
		borderRadius: 3,
	},
});
