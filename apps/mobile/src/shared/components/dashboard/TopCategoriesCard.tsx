import { StyleSheet, View } from "react-native";
import { Icon, ProgressBar, Text, useTheme } from "react-native-paper";
import { centsToDollars, dollarsToCents } from "../../utils/money";
import type { CategoryBreakdown } from "./dashboard";

type TopCategoriesCardProps = {
	data: CategoryBreakdown[] | undefined;
};

export function TopCategoriesCard({ data }: TopCategoriesCardProps) {
	const theme = useTheme();

	if (!data || data.length === 0) {
		return null;
	}

	return (
		<View>
			<Text
				style={{
					fontSize: 14,
					fontWeight: "600",
					color: theme.colors.onSurface,
					marginBottom: 8,
				}}
			>
				Top categories
			</Text>
			<View style={{ gap: 10 }}>
				{data.map((category) => (
					<View key={category.categoryId} style={styles.row}>
						<Icon
							source="arrow-down"
							size={15}
							color={theme.colors.onSurfaceVariant}
						/>
						<Text style={[styles.name, { color: theme.colors.onSurface }]}>
							{category.categoryName}
						</Text>
						<ProgressBar
							progress={category.percentOfMax}
							color={theme.colors.primary}
							style={styles.progressBar}
						/>
						<Text
							style={[styles.amount, { color: theme.colors.onSurfaceVariant }]}
						>
							${centsToDollars(category.totalAmountCents)}
						</Text>
					</View>
				))}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		width: "60%",
	},
	name: {
		fontSize: 12,
		width: 70,
	},
	progressBar: {
		flex: 1,
		height: 6,
		borderRadius: 4,
		minWidth: 0,
		overflow: "hidden",
	},
	amount: {
		fontSize: 12,
		width: 48,
		textAlign: "right",
	},
});
