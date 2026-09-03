import { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
	ActivityIndicator,
	IconButton,
	Text,
	useTheme,
} from "react-native-paper";
import { formatCentsAsCurrency } from "../../utils/money";
import type { BalanceSummary } from "./dashboard";

type BalanceCardProps = {
	data: BalanceSummary | undefined;
	isLoading: boolean;
};

export function BalanceCard({ data, isLoading }: BalanceCardProps) {
	const theme = useTheme();
	const [isHidden, setIsHidden] = useState(false);

	const formattedBalance = data
		? formatCentsAsCurrency(data.totalNetCents)
		: "—";

	return (
		<View style={[styles.card, { backgroundColor: "#2b78d6"}]}>
			<View style={styles.headerRow}>
				<Text style={[styles.label, { color: theme.colors.onPrimary }]}>
					Current Balance
				</Text>
				<IconButton
					icon={isHidden ? "eye-off-outline" : "eye-outline"}
					size={16}
					iconColor={theme.colors.onPrimary}
					onPress={() => setIsHidden((prev) => !prev)}
					style={styles.eyeButton}
				/>
			</View>

			{isLoading ? (
				<ActivityIndicator
					color={theme.colors.onPrimary}
					style={styles.loader}
				/>
			) : (
				<Text style={[styles.balance, { color: theme.colors.onPrimary }]}>
					{isHidden ? "••••••" : formattedBalance}
				</Text>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		borderRadius: 20,
		padding: 20,
	},
	headerRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	label: {
		fontSize: 13,
		opacity: 0.85,
	},
	eyeButton: {
		margin: 0,
	},
	balance: {
		fontSize: 34,
		fontWeight: "700",
		marginTop: 2,
	},
	loader: {
		alignSelf: "flex-start",
		marginTop: 12,
		marginBottom: 10,
	},
});
