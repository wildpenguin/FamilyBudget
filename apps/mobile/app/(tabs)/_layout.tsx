import { Tabs } from "expo-router";
import { Icon } from "react-native-paper";
import { useAddSheet } from "../../src/shared/context/AddSheetContext";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ACTIVE_COLOR = "#2b78d6";
const INACTIVE_COLOR = "#9aa0ab";
const TAB_BAR_CONTENT_HEIGHT = 70;

type TabIconProps = {
    source: string;
    color: string;
    size: number;
    focused: boolean;
};

function TabIcon({ source, color, size, focused }: TabIconProps) {
    return (
        <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
            <Icon source={source} color={color as string} size={size} />
        </View>
    );
}
export default function TabsLayout() {
    const { openAddSheet } = useAddSheet();
	const insets = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: ACTIVE_COLOR,
                tabBarInactiveTintColor: INACTIVE_COLOR,
                tabBarLabelStyle: styles.label,
                tabBarStyle: [
                    styles.tabBar,
                    {
                        height: TAB_BAR_CONTENT_HEIGHT + insets.bottom,
                        paddingBottom: insets.bottom + 6, // 6px of breathing room above the safe area line
                    },
                ],
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Overview",
                    tabBarIcon: ({ color, size, focused }) => (
                        <TabIcon source="home-outline" color={color} size={size} focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="transactions"
                options={{
                    title: "Transactions",
                    tabBarIcon: ({ color, size, focused }) => (
                        <TabIcon source="swap-horizontal" color={color} size={size} focused={focused} />
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
                    tabBarLabelStyle: styles.addLabel,
                    tabBarIcon: () => (
                        <View style={styles.addButton}>
                            <Icon source="plus" color="#ffffff" size={24} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="schedules"
                options={{
                    title: "Schedules",
                    tabBarIcon: ({ color, size, focused }) => (
                        <TabIcon source="calendar-refresh" color={color} size={size} focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, size, focused }) => (
                        <TabIcon source="account-outline" color={color} size={size} focused={focused} />
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: "#ffffff",
        borderTopWidth: 0.5,
        borderTopColor: "#e5e7eb",
        height: 64,
        paddingTop: 8,
        paddingBottom: 10,
        // subtle lifted shadow instead of a flat filled color
        elevation: 8, // Android
        shadowColor: "#000", // iOS
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    label: {
        fontSize: 10,
        fontWeight: "600",
    },
    iconWrapper: {
        width: 52,
        height: 30,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
    },
    iconWrapperActive: {
        backgroundColor: "#dbe7fb", // light tint of ACTIVE_COLOR behind the selected icon
    },
    addButton: {
        width: 30,
        height: 30,
        borderRadius: 23,
        backgroundColor: ACTIVE_COLOR,
        alignItems: "center",
        justifyContent: "center",
        marginTop: -2, // raises it above the bar, matching the mockup
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 5,
    },
    addLabel: {
        fontSize: 10,
        fontWeight: "600",
        marginTop: 2,
    },
});

