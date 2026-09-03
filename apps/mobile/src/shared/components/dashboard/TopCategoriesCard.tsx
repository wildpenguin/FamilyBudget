import { StyleSheet, View } from "react-native";
import { Icon, ProgressBar, Text } from "react-native-paper";
import { useAppTheme } from "../../theme";
import { centsToDollars } from "../../utils/money";
import type { CategoryBreakdown } from "./dashboard";

type TopCategoriesCardProps = {
	data: CategoryBreakdown[] | undefined;
};

export function TopCategoriesCard({ data }: TopCategoriesCardProps) {
	const theme = useAppTheme();

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
					<View style={styles.category} key={category.categoryId}>
						<View
							style={[
								styles.iconContainer,
								{ backgroundColor: theme.colors.expense },
							]}
						>
							<Icon source="arrow-down" size={15} color={theme.colors.error} />
						</View>

						<View style={styles.middle}>
							<View style={styles.nameRow}>
								<Text variant="bodySmall" numberOfLines={1} style={styles.name}>
									{category.categoryName}
								</Text>

								<Text variant="bodySmall">
									${centsToDollars(category.totalAmountCents)}
								</Text>
							</View>

							<ProgressBar
								progress={category.percentOfMax}
								style={styles.progress}
								theme={{ colors: { primary: theme.colors.primary } }}
							/>
						</View>
					</View>
				))}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	category: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},

	iconContainer: {
		width: 34,
		height: 34,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
		marginRight: 12,
	},

	middle: {
		flex: 1,
		minWidth: 0,
	},

	nameRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 6,
	},

	name: {
		flex: 1,
		marginRight: 8,
	},

	progress: {
		height: 6,
		borderRadius: 3,
	},
});
