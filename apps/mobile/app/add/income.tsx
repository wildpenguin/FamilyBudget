import { StyleSheet, Text, View } from "react-native";

export default function AddIncomeScreen() {
	return (
		<View style={styles.container}>
			<Text>Add Income</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
});
