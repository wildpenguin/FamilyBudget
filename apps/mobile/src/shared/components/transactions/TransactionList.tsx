import { StyleSheet, View } from "react-native";
import {
	ActivityIndicator,
	Avatar,
	Card,
	IconButton,
	Text,
} from "react-native-paper";
import { formatDateOnly } from "../../utils/dates";
import { centsToDollars } from "../../utils/money";
import { useDeleteTransaction, useTransactions } from "./transactions";
import type { Transaction, TransactionFilters } from "./types";

interface Props {
	filters: TransactionFilters;
	onEditTransaction?: (transaction: Transaction) => void;
}

interface RowProps {
	item: Transaction;
	onDelete: (id: number) => void;
	onEdit?: (transaction: Transaction) => void;
	deleting: boolean;
}

function TransactionRow({ item, onDelete, onEdit, deleting }: RowProps) {
	const { transactions, categories } = item;
	const isIncome = transactions.type === "income";
	const sign = isIncome ? "+" : "-";

	return (
		<Card style={styles.card} mode="outlined">
			<View style={styles.row}>
				<Avatar.Icon
					size={32}
					icon={isIncome ? "arrow-up" : "arrow-down"}
					style={isIncome ? styles.incomeIcon : styles.expenseIcon}
					color={isIncome ? "#0F6E56" : "#993C1D"}
				/>

				<View style={styles.info}>
					<Text style={styles.description} numberOfLines={1}>
						{transactions.description}
					</Text>
					<Text style={styles.category} numberOfLines={1}>
						{formatDateOnly(transactions.date)} {" / "}
						{categories.name}
					</Text>
				</View>

				<Text style={[styles.amount, isIncome && styles.incomeAmount]}>
					{sign}${centsToDollars(transactions.amountCents)}
				</Text>

				<IconButton
					icon="pencil-outline"
					size={18}
					onPress={() => onEdit?.(item)}
				/>
				<IconButton
					icon="trash-can-outline"
					size={18}
					onPress={() => onDelete(transactions.id)}
					disabled={deleting}
				/>
			</View>
		</Card>
	);
}

export default function TransactionList({ filters, onEditTransaction }: Props) {
	const { data = [], isLoading, isError } = useTransactions(filters);

	const deleteMutation = useDeleteTransaction();

	if (isLoading) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator />
			</View>
		);
	}

	if (isError) {
		return (
			<View style={styles.centered}>
				<Text style={styles.emptyText}>Couldn't load transactions.</Text>
			</View>
		);
	}

	if (data.length === 0) {
		return (
			<View style={styles.centered}>
				<Text style={styles.emptyText}>
					No transactions match your filters.
				</Text>
			</View>
		);
	}

	return (
		<View style={styles.list}>
			{data.map((item) => (
				<TransactionRow
					key={item.transactions.id}
					item={item}
					onDelete={(id) => deleteMutation.mutate(id)}
					onEdit={onEditTransaction}
					deleting={deleteMutation.isPending}
				/>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	list: {
		marginTop: 10,
		gap: 4,
	},
	centered: {
		paddingVertical: 24,
		alignItems: "center",
	},
	card: {
		width: "100%",
		backgroundColor: "#fff",
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		padding: 10,
	},
	incomeIcon: {
		backgroundColor: "#E1F5EE",
	},
	expenseIcon: {
		backgroundColor: "#FAECE7",
	},
	info: {
		flex: 1,
		minWidth: 0,
	},
	description: {
		fontSize: 13,
		fontWeight: "500",
	},
	category: {
		fontSize: 11,
		color: "#666",
		marginTop: 2,
	},
	amount: {
		fontSize: 13,
		fontWeight: "500",
		flexShrink: 0,
	},
	incomeAmount: {
		color: "#0F6E56",
	},
	emptyText: {
		textAlign: "center",
		color: "#888",
		fontSize: 13,
	},
});
