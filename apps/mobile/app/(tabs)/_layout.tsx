import { Tabs } from "expo-router";

export default function TabsLayout() {
	return (
		<Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
			<Tabs.Screen name="index" options={{ title: "Budget Overview" }} />
			<Tabs.Screen name="expenses" options={{ title: "Budget Expenses" }} />
			<Tabs.Screen name="income" options={{ title: "Budget Income" }} />
		</Tabs>
	);
}
