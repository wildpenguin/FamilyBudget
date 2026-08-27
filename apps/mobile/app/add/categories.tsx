import type { GetCategory } from "@ourbudget/shared";
import { FlatList, StyleSheet, View } from "react-native";
import { ActivityIndicator, Divider, Text, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CategoryForm } from "../../src/shared/components/categories/CategoryForm";
import { CategoryListItem } from "../../src/shared/components/categories/CategoryListItem";
import {
	useCategoriesQuery,
	useCreateCategoryMutation,
	useDeleteCategoryMutation,
} from "../../src/shared/components/categories/useCategories";

export default function CategoriesScreen() {
	const theme = useTheme();
	const insets = useSafeAreaInsets();

	const categoriesQuery = useCategoriesQuery();
	const createMutation = useCreateCategoryMutation();
	const deleteMutation = useDeleteCategoryMutation();

	return (
		<FlatList<GetCategory>
			style={{ backgroundColor: theme.colors.background }}
			contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}
			data={categoriesQuery.data ?? []}
			keyExtractor={(item) => String(item.id)}
			ListHeaderComponent={
				<View>
					<Text style={[styles.title, { color: theme.colors.onSurface }]}>
						Categories
					</Text>

					<CategoryForm
						onSave={(input) => createMutation.mutate(input)}
						isSaving={createMutation.isPending}
					/>

					<Text
						style={[styles.listLabel, { color: theme.colors.onSurfaceVariant }]}
					>
						Current categories
					</Text>

					{categoriesQuery.isPending && (
						<ActivityIndicator style={styles.loader} />
					)}
				</View>
			}
			renderItem={({ item }) => (
				<CategoryListItem
					category={item}
					onDelete={(id) => deleteMutation.mutate(id)}
					isDeleting={
						deleteMutation.isPending && deleteMutation.variables === item.id
					}
				/>
			)}
			ItemSeparatorComponent={Divider}
			ListEmptyComponent={
				!categoriesQuery.isPending ? (
					<Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 13 }}>
						No categories yet — add your first one above.
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
		marginTop: 24,
		marginBottom: 8,
	},
	loader: {
		marginTop: 12,
	},
});
