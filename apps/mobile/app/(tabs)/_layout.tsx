import { Tabs } from "expo-router";
import { Icon } from "react-native-paper";
import { useAddSheet } from "../../src/shared/context/AddSheetContext";

export default function TabsLayout() {
	const { openAddSheet } = useAddSheet();

	return (
		<Tabs screenOptions={{ 
			tabBarActiveTintColor: "#101010",
			tabBarStyle: { backgroundColor: "#d4ddf7"},
		}}>
			<Tabs.Screen
				name="index"
				options={{
					title: "Overview",
					tabBarIcon: ({ color, size }) => (
						<Icon source="home" color={color as string} size={size} />
					),
				}}
			/>
			<Tabs.Screen
				name="transactions"
				options={{
					title: "Transactions",
					tabBarIcon: ({ color, size }) => (
						<Icon source="hand-coin" color={color as string} size={size} />
					),
				}}
			/>
			<Tabs.Screen
				name="add"
				listeners={{
					tabPress: (e) => {
						e.preventDefault();
						openAddSheet();
					},
				}}
				options={{
					title: "Add",
					tabBarIcon: ({ color, size }) => (
						<Icon source="plus-circle" color="#2b78d6" size={size} />
					),
				}}
			/>
			<Tabs.Screen
				name="schedules"
				options={{
					title: "Schedules",
					tabBarIcon: ({ color, size }) => (
						<Icon source="calendar-refresh" color={color as string} size={size} />
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
