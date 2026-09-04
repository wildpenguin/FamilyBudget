import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import TransactionFilters from "../../src/shared/components/transactions/TransactionFilters";
import TransactionList from "../../src/shared/components/transactions/TransactionList";
import {
	defaultTransactionFilters,
	type TransactionFilters as Filters,
} from "../../src/shared/components/transactions/types";

export default function TransactionsScreen() {
	const [filters, setFilters] = useState<Filters>(defaultTransactionFilters);

	return (
		<ScrollView
			contentContainerStyle={styles.content}
			keyboardShouldPersistTaps="handled"
		>
			<View>
				<Text>Transactions Overview</Text>
			</View>
			<TransactionFilters value={filters} onChange={setFilters} />
			<TransactionList filters={filters} />
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	content: {
		padding: 12,
		paddingBottom: 32,
		gap: 12,
	},
});
