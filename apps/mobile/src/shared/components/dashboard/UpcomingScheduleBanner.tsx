import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { Icon, Text, useTheme } from "react-native-paper";
import { formatCentsAsCurrency } from "../../utils/money";
import type { UpcomingSchedule } from "./dashboard";

type UpcomingScheduleBannerProps = {
	data: UpcomingSchedule | null | undefined;
};

export function UpcomingScheduleBanner({ data }: UpcomingScheduleBannerProps) {
	const theme = useTheme();

	if (!data) {
		return null;
	}
	return (
		<Pressable
			onPress={() => router.push("/(tabs)/schedules")}
			style={[
				styles.container,
				{ backgroundColor: "#cde2fb" },
			]}
		>
			<Icon
				source="calendar-refresh-outline"
				size={18}
				color={theme.colors.primary}
			/>
			<View style={styles.textContainer}>
				<Text
					style={{
						fontSize: 12,
						fontWeight: "600",
						color: theme.colors.onPrimaryContainer,
					}}
				>
					Upcoming: {data.title}
				</Text>
				<Text
					style={{
						fontSize: 11,
						color: theme.colors.onPrimaryContainer,
						opacity: 0.8,
					}}
				>
					Due in {data.dueInDays} {data.dueInDays === 1 ? "day" : "days"} ·
					{formatCentsAsCurrency(data.amountCents)}
				</Text>
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		borderRadius: 14,
		paddingHorizontal: 12,
		paddingVertical: 10,
	},
	textContainer: {
		flex: 1,
	},
});
