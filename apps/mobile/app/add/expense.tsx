import type { GetTransactionType } from "@ourbudget/shared";
import { FlatList, StyleSheet, View } from "react-native";
import { ActivityIndicator, Divider, Text, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ExpenseForm } from "../../src/shared/components/expense/ExpenseForm";
import { ExpenseListItem } from "../../src/shared/components/expense/ExpenseListItem";
import {
	useCreateExpenseMutation,
	useDeleteExpenseMutation,
	useExpensesQuery,
} from "../../src/shared/components/expense/useExpenses";

export default function AddExpenseScreen() {
	const theme = useTheme();
	const insets = useSafeAreaInsets();

	const expensesQuery = useExpensesQuery();
	const createMutation = useCreateExpenseMutation();
	const deleteMutation = useDeleteExpenseMutation();

	return (
		<FlatList<GetTransactionType>
			style={{ backgroundColor: theme.colors.background }}
			contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}
			data={expensesQuery.data ?? []}
			keyExtractor={(item) => String(item.id)}
			ListHeaderComponent={
				<View>
					<Text style={[styles.title, { color: theme.colors.onSurface }]}>
						Add Expense
					</Text>

					<ExpenseForm
						onSave={(input) => createMutation.mutate(input)}
						isSaving={createMutation.isPending}
					/>

					<Text
						style={[styles.listLabel, { color: theme.colors.onSurfaceVariant }]}
					>
						Recent expenses
					</Text>

					{expensesQuery.isPending && (
						<ActivityIndicator style={styles.loader} />
					)}
				</View>
			}
			renderItem={({ item }) => (
				<ExpenseListItem
					expense={item}
					onDelete={(id) => deleteMutation.mutate(id)}
					isDeleting={
						deleteMutation.isPending && deleteMutation.variables === item.id
					}
				/>
			)}
			ItemSeparatorComponent={Divider}
			ListEmptyComponent={
				!expensesQuery.isPending ? (
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
