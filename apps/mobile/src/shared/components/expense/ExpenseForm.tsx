import type { InputTransactionsType } from "@ourbudget/shared";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
	Button,
	HelperText,
	Icon,
	Menu,
	Text,
	TextInput,
	TouchableRipple,
	useTheme,
} from "react-native-paper";
import { DatePickerInput } from "react-native-paper-dates";
import { dollarsToCents } from "../../utils/money";
import { useCategoriesQuery } from "../categories/useCategories";

type ExpenseFormProps = {
	onSave: (input: InputTransactionsType) => void;
	isSaving: boolean;
};

export function ExpenseForm({ onSave, isSaving }: ExpenseFormProps) {
	const theme = useTheme();
	const categoriesQuery = useCategoriesQuery();
	const expenseCategories = (categoriesQuery.data ?? []).filter(
		(category) => category.type === "expense",
	);

	const [amountText, setAmountText] = useState("");
	const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
		null,
	);
	const [date, setDate] = useState<Date>(new Date());
	const [note, setNote] = useState("");
	const [menuVisible, setMenuVisible] = useState(false);
	const [touched, setTouched] = useState(false);

	const selectedCategory =
		expenseCategories.find((category) => category.id === selectedCategoryId) ??
		null;
	const parsedAmount = Number(amountText);
	const isAmountValid =
		amountText.trim().length > 0 &&
		!Number.isNaN(parsedAmount) &&
		parsedAmount > 0;
	const showAmountError = touched && !isAmountValid;
	const showCategoryError = touched && !selectedCategory;

	function handleSave(): void {
		setTouched(true);
		if (!isAmountValid || !selectedCategory) {
			return;
		}

		onSave({
			amountCents: dollarsToCents(parsedAmount),
			categoryId: selectedCategory.id,
			date: date,
			description: note.trim().length > 0 ? note.trim() : "",
			type: "expense",
			status: "actual",
		});

		setAmountText("");
		setSelectedCategoryId(null);
		setDate(new Date());
		setNote("");
		setTouched(false);
	}

	return (
		<View style={styles.container}>
			<TextInput
				label="Amount"
				value={amountText}
				onChangeText={setAmountText}
				mode="outlined"
				keyboardType="decimal-pad"
				placeholder="0.00"
				left={<TextInput.Affix text="$" />}
				error={showAmountError}
			/>
			<HelperText type="error" visible={showAmountError}>
				Enter a valid amount
			</HelperText>

			<Menu
				visible={menuVisible}
				onDismiss={() => setMenuVisible(false)}
				anchor={
					<TouchableRipple
						onPress={() => setMenuVisible(true)}
						style={[styles.selector, { borderColor: theme.colors.outline }]}
					>
						<View style={styles.selectorRow}>
							<Text
								style={{ fontSize: 12, color: theme.colors.onSurfaceVariant }}
							>
								Category
							</Text>
							<View style={styles.selectorValueRow}>
								<Text
									style={{
										fontSize: 15,
										color: selectedCategory
											? theme.colors.onSurface
											: theme.colors.onSurfaceVariant,
									}}
								>
									{selectedCategory ? selectedCategory.name : "Select category"}
								</Text>
								<Icon
									source="chevron-down"
									size={18}
									color={theme.colors.onSurfaceVariant}
								/>
							</View>
						</View>
					</TouchableRipple>
				}
			>
				{expenseCategories.map((category) => (
					<Menu.Item
						key={category.id}
						title={category.name}
						onPress={() => {
							setSelectedCategoryId(category.id);
							setMenuVisible(false);
						}}
					/>
				))}
				{expenseCategories.length === 0 && (
					<Menu.Item title="No expense categories yet" disabled />
				)}
			</Menu>
			<HelperText type="error" visible={showCategoryError}>
				Select a category
			</HelperText>

			<View style={{ justifyContent: "center", flex: 1, alignItems: "center" }}>
				<DatePickerInput
					locale="en"
					label="When"
					value={date}
					onChange={(d) => setDate(d)}
					inputMode="start"
				/>
			</View>

			<TextInput
				label="Note (optional)"
				value={note}
				onChangeText={setNote}
				mode="outlined"
				multiline
				style={styles.noteInput}
			/>

			<Button
				mode="contained"
				onPress={handleSave}
				loading={isSaving}
				disabled={isSaving}
				style={styles.saveButton}
				contentStyle={styles.saveButtonContent}
			>
				Save expense
			</Button>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		gap: 4,
	},
	selector: {
		borderWidth: 1,
		borderRadius: 4,
		paddingHorizontal: 14,
		paddingVertical: 8,
	},
	selectorRow: {
		gap: 2,
	},
	selectorValueRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	dateRow: {
		marginTop: 4,
		marginBottom: 4,
	},
	dateValueGroup: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},
	noteInput: {
		marginTop: 4,
		marginBottom: 16,
		minHeight: 60,
	},
	saveButton: {
		borderRadius: 8,
	},
	saveButtonContent: {
		paddingVertical: 4,
	},
});
