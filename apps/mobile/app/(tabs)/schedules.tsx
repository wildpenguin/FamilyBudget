import React from "react";
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	View,
} from "react-native";
import { Text } from "react-native-paper";
import ScheduledTransactionForm from "../../src/shared/components/schedules/ScheduleForm";
import ScheduledTransactionList from "../../src/shared/components/schedules/ScheduleListItem";

export default function ScheduledTransactionsScreen() {
	return (
		<KeyboardAvoidingView
			style={styles.flex}
			behavior={Platform.OS === "ios" ? "padding" : undefined}
		>
			<ScrollView
				contentContainerStyle={styles.content}
				keyboardShouldPersistTaps="handled"
			>
				<ScheduledTransactionForm />

				<View style={styles.listHeader}>
					<Text style={styles.listTitle}>Scheduled transactions</Text>
				</View>

				<ScheduledTransactionList />
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	flex: {
		flex: 1,
	},
	content: {
		padding: 12,
		paddingBottom: 32,
		gap: 8,
	},
	listHeader: {
		marginTop: 16,
		marginBottom: 8,
	},
	listTitle: {
		fontSize: 13,
		color: "#666",
	},
});
