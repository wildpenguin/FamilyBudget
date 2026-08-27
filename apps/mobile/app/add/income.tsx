import type { GetTransactionType } from "@ourbudget/shared";
import { FlatList, StyleSheet, View } from "react-native";
import { ActivityIndicator, Divider, Text, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IncomeForm } from "../../src/shared/components/income/IncomeForm";
import { IncomeListItem } from "../../src/shared/components/income/IncomeListItem";
import {
	useCreateIncomeMutation,
	useDeleteIncomeMutation,
	useIncomeQuery,
} from "../../src/shared/components/income/useIncome";

export default function AddIncomeScreen() {
	const theme = useTheme();
	const insets = useSafeAreaInsets();

	const incomeQuery = useIncomeQuery();
	const createMutation = useCreateIncomeMutation();
	const deleteMutation = useDeleteIncomeMutation();

	return (
		<FlatList<GetTransactionType>
			style={{ backgroundColor: theme.colors.background }}
			contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}
			data={incomeQuery.data ?? []}
			keyExtractor={(item) => String(item.id)}
			ListHeaderComponent={
				<View>
					<Text style={[styles.title, { color: theme.colors.onSurface }]}>
						Add Income
					</Text>

					<IncomeForm
						onSave={(input) => createMutation.mutate(input)}
						isSaving={createMutation.isPending}
					/>

					<Text
						style={[styles.listLabel, { color: theme.colors.onSurfaceVariant }]}
					>
						Recent Inputs
					</Text>

					{incomeQuery.isPending && <ActivityIndicator style={styles.loader} />}
				</View>
			}
			renderItem={({ item }) => (
				<IncomeListItem
					income={item}
					onDelete={(id) => deleteMutation.mutate(id)}
					isDeleting={
						deleteMutation.isPending && deleteMutation.variables === item.id
					}
				/>
			)}
			ItemSeparatorComponent={Divider}
			ListEmptyComponent={
				!incomeQuery.isPending ? (
					<Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 13 }}>
						No expenses yet — add your first one above.
					</Text>
				) : null
			}
		/>
	);
}

const styles = StyleSheet.create({
	content: {
		paddingHorizontal: 18,
		paddingBottom: 32,
	},
	title: {
		fontSize: 22,
		fontWeight: "700",
		marginBottom: 18,
	},
	listLabel: {
		fontSize: 13,
		fontWeight: "600",
		marginTop: 8,
		marginBottom: 8,
	},
	loader: {
		marginTop: 12,
	},
});
