import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
	Button,
	Card,
	Menu,
	SegmentedButtons,
	Text,
	TextInput,
} from "react-native-paper";
import type { Frequency } from "../types";
import {
	useCategories,
	useCreateScheduledTransaction,
} from "./scheduledTransactions";

const FREQUENCIES: { value: Frequency; label: string }[] = [
	{ value: "weekly", label: "Weekly" },
	{ value: "biweekly", label: "Biweekly" },
	{ value: "monthly", label: "Monthly" },
];

interface FormState {
	categoryId: string | null;
	description: string;
	amount: string;
	frequency: Frequency;
	startDate: string;
	endDate: string;
	dayOfMonth: string;
}

const emptyForm: FormState = {
	categoryId: null,
	description: "",
	amount: "",
	frequency: "monthly",
	startDate: "",
	endDate: "",
	dayOfMonth: "",
};

type FormErrors = Partial<Record<keyof FormState, string>>;

export default function ScheduledTransactionForm() {
	const { data: categories = [] } = useCategories();
	const createMutation = useCreateScheduledTransaction();

	const [form, setForm] = useState<FormState>(emptyForm);
	const [menuVisible, setMenuVisible] = useState(false);
	const [errors, setErrors] = useState<FormErrors>({});

	const selectedCategory = categories.find((c) => c.id === form.categoryId);

	function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
		setForm((prev) => ({ ...prev, [key]: value }));
		if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
	}

	function validate(): boolean {
		const e: FormErrors = {};
		if (!form.categoryId) e.categoryId = "Select a category";
		if (!form.description.trim()) e.description = "Required";
		if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
			e.amount = "Enter a valid amount";
		if (!form.startDate.trim()) e.startDate = "Required (YYYY-MM-DD)";
		if (
			form.frequency === "monthly" &&
			(!form.dayOfMonth ||
				isNaN(Number(form.dayOfMonth)) ||
				Number(form.dayOfMonth) < 1 ||
				Number(form.dayOfMonth) > 31)
		)
			e.dayOfMonth = "1–31 required";
		setErrors(e);
		return Object.keys(e).length === 0;
	}

	function handleAdd() {
		if (!validate() || !selectedCategory || !form.categoryId) return;

		createMutation.mutate(
			{
				categoryId: form.categoryId,
				categoryName: selectedCategory.name,
				description: form.description.trim(),
				amount: Number(form.amount),
				frequency: form.frequency,
				startDate: form.startDate,
				endDate: form.endDate.trim() ? form.endDate.trim() : null,
				dayOfMonth:
					form.frequency === "monthly" ? Number(form.dayOfMonth) : null,
			},
			{ onSuccess: () => setForm(emptyForm) },
		);
	}

	return (
		<Card style={styles.formCard} mode="outlined">
			<Card.Title title="New scheduled transaction" />
			<Card.Content style={styles.formContent}>
				<Menu
					visible={menuVisible}
					onDismiss={() => setMenuVisible(false)}
					anchor={
						<Button
							mode="outlined"
							onPress={() => setMenuVisible(true)}
							style={styles.fullWidthButton}
							contentStyle={styles.categoryButtonContent}
						>
							{selectedCategory ? selectedCategory.name : "Select category"}
						</Button>
					}
				>
					{categories.map((cat) => (
						<Menu.Item
							key={cat.id}
							onPress={() => {
								updateField("categoryId", cat.id);
								setMenuVisible(false);
							}}
							title={cat.name}
						/>
					))}
				</Menu>
				{!!errors.categoryId && (
					<Text style={styles.errorText}>{errors.categoryId}</Text>
				)}

				<TextInput
					mode="outlined"
					label="Description"
					value={form.description}
					onChangeText={(v) => updateField("description", v)}
					style={styles.input}
					dense
					error={!!errors.description}
				/>
				{!!errors.description && (
					<Text style={styles.errorText}>{errors.description}</Text>
				)}

				<View style={styles.inlineRow}>
					<View style={styles.inlineField}>
						<TextInput
							mode="outlined"
							label="Amount"
							value={form.amount}
							onChangeText={(v) =>
								updateField("amount", v.replace(/[^0-9.]/g, ""))
							}
							keyboardType="decimal-pad"
							style={styles.input}
							dense
							error={!!errors.amount}
						/>
						{!!errors.amount && (
							<Text style={styles.errorText}>{errors.amount}</Text>
						)}
					</View>

					{form.frequency === "monthly" && (
						<View style={styles.inlineField}>
							<TextInput
								mode="outlined"
								label="Day of month"
								value={form.dayOfMonth}
								onChangeText={(v) =>
									updateField("dayOfMonth", v.replace(/[^0-9]/g, ""))
								}
								keyboardType="number-pad"
								style={styles.input}
								dense
								error={!!errors.dayOfMonth}
							/>
							{!!errors.dayOfMonth && (
								<Text style={styles.errorText}>{errors.dayOfMonth}</Text>
							)}
						</View>
					)}
				</View>

				<SegmentedButtons
					value={form.frequency}
					onValueChange={(v) => updateField("frequency", v as Frequency)}
					buttons={FREQUENCIES}
					style={styles.segmented}
				/>

				<View style={styles.inlineRow}>
					<View style={styles.inlineField}>
						<TextInput
							mode="outlined"
							label="Start date (YYYY-MM-DD)"
							value={form.startDate}
							onChangeText={(v) => updateField("startDate", v)}
							style={styles.input}
							dense
							error={!!errors.startDate}
						/>
						{!!errors.startDate && (
							<Text style={styles.errorText}>{errors.startDate}</Text>
						)}
					</View>
					<View style={styles.inlineField}>
						<TextInput
							mode="outlined"
							label="End date (optional)"
							value={form.endDate}
							onChangeText={(v) => updateField("endDate", v)}
							style={styles.input}
							dense
						/>
					</View>
				</View>

				<Button
					mode="contained"
					onPress={handleAdd}
					style={styles.addButton}
					loading={createMutation.isPending}
					disabled={createMutation.isPending}
				>
					Add schedule
				</Button>
			</Card.Content>
		</Card>
	);
}

const styles = StyleSheet.create({
	formCard: {
		width: "100%",
	},
	formContent: {
		gap: 8,
	},
	fullWidthButton: {
		width: "100%",
	},
	categoryButtonContent: {
		justifyContent: "flex-start",
	},
	input: {
		width: "100%",
	},
	inlineRow: {
		flexDirection: "row",
		gap: 8,
		width: "100%",
	},
	inlineField: {
		flex: 1,
		minWidth: 0,
	},
	segmented: {
		width: "100%",
	},
	addButton: {
		marginTop: 4,
	},
	errorText: {
		fontSize: 11,
		color: "#B3261E",
		marginTop: -4,
	},
});
