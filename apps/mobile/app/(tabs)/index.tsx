import { ScrollView, StyleSheet, View } from "react-native";
import { Avatar, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BalanceCard } from "../../src/shared/components/dashboard/BalanceCard";
import { IncomeExpenseChart } from "../../src/shared/components/dashboard/IncomeExpenseChart";
import { RecentTransactionsCard } from "../../src/shared/components/dashboard/RecentTransactionsCard";
import { SummaryCards } from "../../src/shared/components/dashboard/SummaryCards";
import { TopCategoriesCard } from "../../src/shared/components/dashboard/TopCategoriesCard";
import { UpcomingScheduleBanner } from "../../src/shared/components/dashboard/UpcomingScheduleBanner";
import {
	useBalanceSummary,
	useMonthlyChartData,
	usePeriodSummary,
	useRecentTransactions,
	useTopCategories,
	useUpcomingSchedule,
} from "../../src/shared/components/dashboard/useDashboardQueries";

import { useAuth } from "../../src/shared/context/AuthContext";
import { useAppTheme } from "../../src/shared/theme";

export default function Home() {
	const theme = useAppTheme();
	const insets = useSafeAreaInsets();
	const { user } = useAuth();

	const balanceQuery = useBalanceSummary();
	const periodSummaryQuery = usePeriodSummary();
	const chartQuery = useMonthlyChartData();
	const categoriesQuery = useTopCategories();
	const scheduleQuery = useUpcomingSchedule();
	const transactionsQuery = useRecentTransactions();

	return (
		<ScrollView
			style={{ backgroundColor: theme.colors.background }}
			contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}
		>
			<View style={styles.headerRow}>
				<View>
					<Text style={{ fontSize: 13, color: theme.colors.onSurfaceVariant }}>
						Good morning
					</Text>
					<Text
						style={{
							fontSize: 17,
							fontWeight: "600",
							color: theme.colors.onSurface,
						}}
					>
						{user?.name}
					</Text>
				</View>
				<Avatar.Icon size={38} icon="account" />
			</View>

			<View style={styles.section}>
				<BalanceCard
					data={balanceQuery.data}
					isLoading={balanceQuery.isPending}
				/>
			</View>

			<View style={styles.section}>
				<SummaryCards data={balanceQuery.data} />
			</View>

			<View style={styles.section}>
				<IncomeExpenseChart data={chartQuery.data} />
			</View>

			<View style={styles.section}>
				<TopCategoriesCard data={categoriesQuery.data} />
			</View>

			<View style={styles.section}>
				<UpcomingScheduleBanner data={scheduleQuery.data} />
			</View>

			<View style={styles.section}>
				<RecentTransactionsCard data={transactionsQuery.data} />
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	content: {
		paddingHorizontal: 18,
		paddingBottom: 32,
	},
	headerRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 16,
	},
	section: {
		marginBottom: 18,
	},
});
