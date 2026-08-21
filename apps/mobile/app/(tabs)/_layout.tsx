import { Tabs } from "expo-router";
import { Icon } from "react-native-paper";

export default function TabsLayout() {
	return (
		<Tabs screenOptions={{ tabBarActiveTintColor: "#101010" }}>
			<Tabs.Screen
				name="index"
				options={{
					title: "Overview",
					tabBarIcon: ({ color, size }) => (
						<Icon source="view-dashboard" color={color as string} size={size} />
					),
				}}
			/>
			<Tabs.Screen
				name="expenses"
				options={{
					title: "Expenses",
					tabBarIcon: ({ color, size }) => (
						<Icon source="cash-minus" color={color as string} size={size} />
					),
				}}
			/>
			<Tabs.Screen
				name="income"
				options={{
					title: "Income",
					tabBarIcon: ({ color, size }) => (
						<Icon source="cash-plus" color={color as string} size={size} />
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					tabBarIcon: ({ color, size }) => (
						<Icon source="account" color={color as string} size={size} />
					),
				}}
			/>
		</Tabs>
	);
}
