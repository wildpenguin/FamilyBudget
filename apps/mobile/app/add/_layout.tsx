import { router, Stack } from "expo-router";
import { IconButton } from "react-native-paper";

export default function AddStackLayout() {
	return (
		<Stack
			screenOptions={{
				presentation: "modal",
				headerLeft: () => (
					<IconButton icon="close" onPress={() => router.replace("/(tabs)")} />
				),
			}}
		>
			<Stack.Screen name="categories" options={{ title: "Categories" }} />
			<Stack.Screen name="income" options={{ title: "Income" }} />
			<Stack.Screen name="expense" options={{ title: "Expenses" }} />
		</Stack>
	);
}
