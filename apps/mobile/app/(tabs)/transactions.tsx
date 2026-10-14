import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import TransactionFilters from "../../src/shared/components/transactions/TransactionFilters";
import TransactionList from "../../src/shared/components/transactions/TransactionList";
import TransactionsSummary from "../../src/shared/components/transactions/TransactionsSummary";

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
			{(filters.from || filters.to) && (
				<TransactionsSummary filters={filters} />
			)}
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
